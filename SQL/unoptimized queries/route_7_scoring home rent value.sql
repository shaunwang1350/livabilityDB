
USE ZIPCODE_DB;

SET @user_zipcode = 19104;
-- Example of User defined parameters
SET @user_preference_home_value_high:= FALSE;
SET @user_preference_rent_value_high:= FALSE;
SET @home_value_weight:= 0.80; -- worth 80% of weighted score
SET @rent_value_weight:= 0.20; -- worth 20% of weighted score



-- Get summary metrics for these parameters to use in scoring
WITH home_value_quintile AS (
    SELECT quintile, MIN(median_home_value) AS home_value
    FROM (
    SELECT zipcode,
       median_home_value,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE median_home_value IS NOT NULL
    WINDOW w AS (ORDER BY median_home_value)) a
    GROUP BY quintile
), rent_value_quintile AS (
    SELECT quintile, MIN(median_rent_value) AS rent_value
    FROM (
    SELECT zipcode,
       median_rent_value,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE median_rent_value IS NOT NULL
    WINDOW w AS (ORDER BY median_rent_value)) a
    GROUP BY quintile
)

-- Scoring System
SELECT
    zipcode,
    city,
    state,
    median_home_value,
    median_rent_value,
    home_value_score,
    rent_value_score,
    -- COALESCE(ROUND((home_value_score * @home_value_weight), 2), ROUND((rent_value_score * @home_value_weight), 2)) AS weighted_home_value_score,
    -- COALESCE(ROUND((rent_value_score * @rent_value_weight), 2), ROUND((home_value_score * @rent_value_weight), 2)) AS weighted_rent_value_score,
    ROUND(
        (COALESCE((home_value_score * @home_value_weight), (rent_value_score * @home_value_weight)) +
        COALESCE((rent_value_score * @rent_value_weight), (home_value_score * @rent_value_weight)))
        , 2) AS final_weighted_housing_score
FROM
(SELECT
        zipcode,
        city,
        state,
        median_home_value,
        median_rent_value,
       (CASE WHEN @user_preference_home_value_high THEN (SELECT MAX(quintile) FROM home_value_quintile WHERE  median_home_value >= home_value)
        ELSE (6 - (SELECT MAX(quintile) FROM home_value_quintile WHERE  median_home_value >= home_value))
        END) AS home_value_score,
        (CASE WHEN @user_preference_rent_value_high THEN (SELECT MAX(quintile) FROM rent_value_quintile WHERE  median_rent_value >= rent_value)
        ELSE (6 - (SELECT MAX(quintile) FROM rent_value_quintile WHERE  median_rent_value >= rent_value))
        END) AS rent_value_score
FROM Zipcode
WHERE zipcode = @user_zipcode) a;
