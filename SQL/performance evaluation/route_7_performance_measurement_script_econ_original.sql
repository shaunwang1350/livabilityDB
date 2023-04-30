
USE ZIPCODE_DB;

SET @query1_average = 0;
SET @query2_average = 0;
SET @performance_difference_q1_q2 = 0;
SET @performance_relative_difference_q1_q2 = 0;

DROP PROCEDURE IF EXISTS testPerformanceComparisonQueryOptimization;


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

SET @labor_force_participation_weight:= 0.40; -- worth 80% of weighted score
SET @household_income_weight:= 0.40; -- worth 20% of weighted score
SET @poverty_rate_weight:= 0.20; -- worth 20% of weighted score

WHILE @counter <= @iterations DO


    -- Record start time
    SET @start_time = NOW(6);

    -- Run Query 1

-- Get summary metrics for these parameters to use in scoring
WITH labor_force_quintile AS (
    SELECT quintile, MIN(labor_force_participation_rate) AS labor_force_participation
    FROM (
    SELECT zipcode,
       labor_force_participation_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE labor_force_participation_rate IS NOT NULL
    WINDOW w AS (ORDER BY labor_force_participation_rate)) a
    GROUP BY quintile
), household_income_quintile AS (
    SELECT quintile, MIN(average_household_income) AS average_household_income
    FROM (
    SELECT zipcode,
       average_household_income,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE average_household_income IS NOT NULL
    WINDOW w AS (ORDER BY average_household_income)) a
    GROUP BY quintile
), poverty_rate_quintile AS (
    SELECT quintile, MIN(poverty_rate) AS poverty_rate
    FROM (
    SELECT zipcode,
       poverty_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE poverty_rate IS NOT NULL
    WINDOW w AS (ORDER BY poverty_rate)) a
    GROUP BY quintile
)

-- Scoring System
SELECT
    zipcode,
    city,
    state,
    labor_force_participation_rate,
    average_household_income,
    poverty_rate,
    labor_force_score,
    household_income_score,
    poverty_rate_score,
    ROUND((labor_force_score * @labor_force_participation_weight) + (household_income_score * @household_income_weight) + (poverty_rate_score * @poverty_rate_weight), 2) AS final_economic_weighted_score
FROM
(SELECT
        zipcode,
        city,
        state,
        labor_force_participation_rate,
        average_household_income,
        poverty_rate,
       (SELECT MAX(quintile) FROM labor_force_quintile WHERE  labor_force_participation_rate >= labor_force_participation ) AS labor_force_score,
       (SELECT MAX(quintile) FROM household_income_quintile WHERE  Zipcode.average_household_income >= household_income_quintile.average_household_income) AS household_income_score,
       (6 - (SELECT MAX(quintile) FROM poverty_rate_quintile WHERE  Zipcode.poverty_rate >= poverty_rate_quintile.poverty_rate)) AS poverty_rate_score
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
