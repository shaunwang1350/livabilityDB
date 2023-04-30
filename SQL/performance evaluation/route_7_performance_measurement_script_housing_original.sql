
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

SET @user_zipcode = 19104;
-- Example of User defined parameters
SET @user_preference_home_value_high:= FALSE;
SET @user_preference_rent_value_high:= FALSE;
SET @home_value_weight:= 0.80; -- worth 80% of weighted score
SET @rent_value_weight:= 0.20; -- worth 20% of weighted score

WHILE @counter <= @iterations DO

    -- Record start time
    SET @start_time = NOW(6);

    -- Run Query 1

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



WHILE @counter <= @iterations DO

    -- Record start time
    SET @start_time = NOW(6);

    -- Run Query 2

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

-- For this test run each query individually for simplicty.
-- Saved Results to view Outside of Procedure Scope
SELECT CONCAT('Query 1 Average Time: ', @query1_average, ' milliseconds') AS 'Query 1 Average Time';


-- SELECT CONCAT('Query 2 (Optimized) Average Time: ', @query2_average, ' milliseconds') AS 'Query 2 Average Time: ';
-- Due to Glitch in Script Calculate Q1 - Q2 manually and compute relative difference manually
-- SELECT CONCAT('Absolute Difference Query 1 - Query 2 Average Times: ', FORMAT((@query1_average - @query2_average), 4), ' milliseconds') AS 'Abs Difference Q1 - Q2'; -- if positive it means optimized Query 2 is faster than Query 1 by X milliseconds
-- SELECT CONCAT('Relative Difference (Absolute Difference/Query 1 Average Time: ', @performance_relative_difference_q1_q2 * 100, ' %') AS 'Relative Difference Abs/Q1 Time'; -- if positive it means optimized Query 2 is faster than Query 1 by X% of Query 1's original time








-- Raw Results no Strings
SELECT @query1_average;
SELECT @query2_average;
SELECT @performance_difference_q1_q2;
SELECT @performance_relative_difference_q1_q2;
