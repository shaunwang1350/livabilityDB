

SET @business_weight = 0.25; --  user in[ut for weight of Business category in final livability score
SET @user_zipcode = 19104; -- user input for zip code

SET @cat:= 'Restaurants';
SET @cat_review_stars_weight:= 0.80; -- weight of review_stars: worth 80% of Business category of score
SET @cat_zipcode_count_weight:= 0.20; -- weight of review_stars: worth 80% of Business category of score

-- Get summary quintile metrics for the Business category to use in scoring
    WITH bus_cat_review_star_quintile AS (
        SELECT quintile, MIN(review_stars) AS review_stars
        FROM (
        SELECT
            bus.zipcode,
            bus.review_stars,
            NTILE(5) OVER w AS quintile
        FROM Business bus
        WHERE bus.id IN
        (SELECT BC.business_id
        FROM Business_Category BC
        JOIN Category C
             ON BC.category_id = C.id
        WHERE LOWER(C.name) LIKE CONCAT('%', @category, '%'))
        WINDOW w AS (ORDER BY review_stars)) a
        GROUP BY quintile
    ), bus_cat_count_quintile AS (
        SELECT quintile, MIN(zipcode_category_count) AS zipcode_bus_category_count
        FROM (
        SELECT zipcode,
           zipcode_category_count,
           NTILE(5) OVER w AS quintile
        FROM
            (SELECT B.zipcode, COUNT(B.id) AS zipcode_category_count
            FROM Business B
            WHERE B.id IN
            (SELECT BC.business_id
            FROM Business_Category BC
            JOIN Category C
               ON BC.category_id = C.id
            WHERE LOWER(C.name) LIKE CONCAT('%', @category, '%')
            GROUP BY zipcode) ) category_count
        WINDOW w AS (ORDER BY zipcode_category_count)) a
        GROUP BY quintile
    )

    -- Scoring System

    SELECT
            final.zipcode,
            city,
            state,
            cat_avg_stars,
            category_count,
            review_score,
            cat_count_score,
            ROUND(((review_score * @cat_review_stars_weight) + (cat_count_score * @cat_zipcode_count_weight)), 2) AS final_weighted_score
    FROM
    (SELECT
            zipcode,
            cat_avg_stars,
            category_count,
           (SELECT MAX(quintile) FROM bus_cat_review_star_quintile WHERE cat_avg_stars >=  bus_cat_review_star_quintile.review_stars) AS review_score,
           (SELECT MAX(quintile) FROM bus_cat_count_quintile WHERE category_count >= bus_cat_count_quintile.zipcode_bus_category_count) AS cat_count_score
    FROM (SELECT B.zipcode,
            AVG(B.review_stars) AS cat_avg_stars,
            COUNT(B.id) AS category_count
        FROM Business B
        WHERE B.id IN
        ( SELECT BC.business_id
        FROM Business_Category BC
        JOIN Category C
           ON BC.category_id = C.id
        WHERE LOWER(C.name) LIKE CONCAT('%', @category, '%') AND B.zipcode = @user_zipcode
        GROUP BY zipcode)) a
    ) final
    JOIN Zipcode
        ON Zipcode.zipcode = final.zipcode;