
USE ZIPCODE_DB;

SET @query1_average = 0;
SET @query2_average = 0;
SET @performance_difference_q1_q2 = 0;
SET @performance_relative_difference_q1_q2 = 0;

DROP PROCEDURE IF EXISTS testPerformanceComparisonQueryOptimization;

-- Drop index on name in Category if it already exists to make sure Test does not take into account index performance on Query 1
-- ALTER TABLE Category DROP INDEX name;


CREATE PROCEDURE testPerformanceComparisonQueryOptimization()

BEGIN
-- Disable the cache to negate the effect of caching (if desired)
    /*
    SET GLOBAL query_cache_type = OFF;
    SET GLOBAL query_cache_type = ON;
    */

SET @iterations = 15; -- Number of iterations

-- Run Query 1
SET @counter = 1; -- Counter variable
SET @query1_duration = 0; -- Variable to store total duration of Query 1

SET @business_weight = 0.25; --  user in[ut for weight of Business category in final livability score
SET @user_zipcode = 19104; -- user input for zip code

SET @category:= 'Restaurants';
SET @cat_review_stars_weight:= 0.80; -- weight of review_stars: worth 80% of Business category of score
SET @cat_zipcode_count_weight:= 0.20; -- weight of review_stars: worth 80% of Business category of score

WHILE @counter <= @iterations DO

    -- Record start time
    SET @start_time = NOW(6);

    -- Run Query 1
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

    -- Record end time
    SET @end_time = NOW(6);

    -- Add the duration of the current run to the total duration
    SET @query1_duration = @query1_duration + TIMESTAMPDIFF(MICROSECOND, @start_time, @end_time);

    -- Increment counter
    SET @counter = @counter + 1;
END WHILE;

-- Calculate average duration of Query 1
SET @query1_avg_duration = @query1_duration / @iterations;

-- Display average duration of Query 1
SELECT CONCAT('Query 1 Average Duration: ', FORMAT(@query1_avg_duration / 1000000, 4), ' seconds') AS ' ';
SET @query1_average = FORMAT(@query1_avg_duration / 1000, 2); -- milliseconds


-- Run Query 2
SET @counter = 1; -- Reset counter
SET @query2_duration = 0; -- Reset total duration of Query 2

-- Add Index on Category.name if not there
ALTER TABLE Category ADD CONSTRAINT name UNIQUE(name);
-- Create index on Business.zipcode if not there
-- CREATE INDEX idx_zipcode ON Business(zipcode); DO NOT USE SINCE DID NOT IMPROVE PERFORMANCE

SET @business_weight = 0.25; --  user in[ut for weight of Business category in final livability score
SET @user_zipcode = 19104; -- user input for zip code

SET @cat:= 'Restaurants';
SET @cat_review_stars_weight:= 0.80; -- weight of review_stars: worth 80% of Business category of score
SET @cat_zipcode_count_weight:= 0.20; -- weight of review_stars: worth 80% of Business category of score

WHILE @counter <= @iterations DO

    -- Record start time
    SET @start_time = NOW(6);

    -- Run Query 2

    WITH bus_cat_review_star_quintile AS (
        SELECT quintile, MIN(review_stars) AS review_stars
        FROM (
        SELECT
            bus.zipcode,
            bus.review_stars,
            NTILE(5) OVER w AS quintile
        FROM Business bus
        JOIN
        (SELECT BC.business_id
        FROM Business_Category BC
        JOIN Category C
             ON BC.category_id = C.id
        WHERE C.name = @category) relevant_businesses
            ON bus.id = relevant_businesses.business_id
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
            JOIN Business_Category BC
               ON B.id = BC.business_id
            JOIN Category C
               ON BC.category_id = C.id
            WHERE C.name = @category
            GROUP BY zipcode) category_count
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
        JOIN Business_Category BC
           ON B.id = BC.business_id
        JOIN Category C
           ON BC.category_id = C.id
        WHERE C.name = @category AND B.zipcode = @user_zipcode
        GROUP BY zipcode) a
    ) final
    JOIN Zipcode
        ON Zipcode.zipcode = final.zipcode;

    -- Record end time
    SET @end_time = NOW(6);

    -- Add the duration of the current run to the total duration
    SET @query2_duration = @query2_duration + TIMESTAMPDIFF(MICROSECOND, @start_time, @end_time);

    -- Increment counter
    SET @counter = @counter + 1;
END WHILE;

-- Calculate average duration of Query 2
SET @query2_avg_duration = @query2_duration / @iterations;

-- Display average duration of Query 2
SELECT CONCAT('Query 2 Average Duration: ', FORMAT(@query2_avg_duration / 1000000, 4), ' seconds') AS ' ';
SET @query2_average = FORMAT(@query2_avg_duration / 1000, 2); -- milliseconds

SELECT CONCAT('Performance difference Q1 - Q2: ', FORMAT( (@query1_avg_duration  - @query2_avg_duration) / 1000000, 4), ' seconds') AS ' ';
SET @performance_difference_q1_q2 = FORMAT(@query1_average - @query2_average, 4); -- milliseconds

SELECT CONCAT('Performance difference Q1 - Q2: ', FORMAT( ((@query1_avg_duration  - @query2_avg_duration) / @query1_avg_duration) / 1000000, 4), ' seconds') AS ' ';
SET @performance_relative_difference_q1_q2 = FORMAT((@performance_difference_q1_q2  / @query1_average), 4); -- milliseconds

END;

CALL testPerformanceComparisonQueryOptimization();

-- Saved Results to view Outside of Procedure Scope
SELECT CONCAT('Query 1 Average Time: ', @query1_average, ' milliseconds') AS 'Query 1 Average Time';
SELECT CONCAT('Query 2 (Optimized) Average Time: ', @query2_average, ' milliseconds') AS 'Query 2 Average Time: ';

-- Due to Glitch in Script Calculate Q1 - Q2 manually and compute relative difference manually
-- SELECT CONCAT('Absolute Difference Query 1 - Query 2 Average Times: ', FORMAT((@query1_average - @query2_average), 4), ' milliseconds') AS 'Abs Difference Q1 - Q2'; -- if positive it means optimized Query 2 is faster than Query 1 by X milliseconds
-- SELECT CONCAT('Relative Difference (Absolute Difference/Query 1 Average Time: ', @performance_relative_difference_q1_q2 * 100, ' %') AS 'Relative Difference Abs/Q1 Time'; -- if positive it means optimized Query 2 is faster than Query 1 by X% of Query 1's original time








-- Raw Results no Strings
SELECT @query1_average;
SELECT @query2_average;
SELECT @performance_difference_q1_q2;
SELECT @performance_relative_difference_q1_q2;
