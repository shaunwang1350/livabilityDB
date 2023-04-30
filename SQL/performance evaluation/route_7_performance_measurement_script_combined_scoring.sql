
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

WHILE @counter <= @iterations DO

    -- Record start time
    SET @start_time = NOW(6);

    -- Run Query 1
SET @user_zipcode = 19104;

SET @socio_demographic_weight = 0.25;
SET @housing_weight = 0.25;
SET @socio_demographic_weight = 0.25;

-- Set demographic params
SET @high_educational_attainment := 3; -- Chooses whether bachelors rate or highschool grad rate is used
SET @age_preference := 1; -- 1: neighbourhoods with more children (0-18); 2: Young Adults: 20-34; 3 Middle-Aged Adults: 35-64; 4: Neighbourhood with more old people (over 65)
SET @age_weight := 0.30 ;
SET @education_weight:= 0.70;

-- Set housing params
SET @user_preference_home_value_high:= FALSE;
SET @user_preference_rent_value_high:= FALSE;
SET @home_value_weight:= 0.80; -- worth 80% of weighted score
SET @rent_value_weight:= 0.20; -- worth 20% of weighted score

-- Set economic params
SET @labor_force_participation_weight:= 0.40; -- worth 80% of weighted score
SET @household_income_weight:= 0.40; -- worth 20% of weighted score
SET @poverty_rate_weight:= 0.20; -- worth 20% of weighted score

-- Scoring System
    SELECT
        zipcode,
        city,
        state,
        education_rate,
        age_range_rate,
        education_score,
        age_score,
        ROUND((education_score * @education_weight) + (age_score * @age_weight), 2) AS final_weighted_socio_demographic_score,
        median_home_value,
        median_rent_value,
        home_value_score,
        rent_value_score,
        ROUND(
        (COALESCE((home_value_score * @home_value_weight), (rent_value_score * @home_value_weight)) +
        COALESCE((rent_value_score * @rent_value_weight), (home_value_score * @rent_value_weight)))
        , 2) AS final_weighted_housing_score,
        labor_force_participation_rate,
        average_household_income,
        poverty_rate,
        labor_force_score,
        household_income_score,
        poverty_rate_score,
        ROUND((labor_force_score * @labor_force_participation_weight) +
              (household_income_score * @household_income_weight) + (poverty_rate_score * @poverty_rate_weight), 2) AS final_economic_weighted_score
    FROM
    (SELECT
            zipcode,
            city,
            state,
            (CASE
                WHEN @high_educational_attainment = 1 THEN bachelor_grad_rate
                WHEN @high_educational_attainment = 2 THEN hs_grad_rate
                WHEN @high_educational_attainment = 3 THEN combined_bachelor_hs_rate
            END) AS education_rate,
            (CASE
                WHEN @age_preference = 1 THEN age_under_18
                WHEN @age_preference = 2 THEN age_range_20_34
                WHEN @age_preference = 3 THEN age_range_35_64
                WHEN @age_preference = 4 THEN age_over_65
            END) AS age_range_rate,
           (CASE
               WHEN @high_educational_attainment = 1 THEN (SELECT MAX(quintile) FROM bachelor_grad_rate_quintile WHERE Zipcode.bachelor_grad_rate >= bachelor_grad_rate_quintile.bachelor_grad_rate )
               WHEN @high_educational_attainment = 2 THEN (SELECT MAX(quintile) FROM hs_grad_rate_quintile WHERE Zipcode.hs_grad_rate >= hs_grad_rate_quintile.hs_grad_rate)
               WHEN @high_educational_attainment = 3 THEN (SELECT MAX(quintile) FROM combined_bachelor_hs_rate_quintile WHERE Zipcode.combined_bachelor_hs_rate >= combined_bachelor_hs_rate_quintile.combined_bachelor_hs_rate)
            END) AS education_score,
            (CASE
                WHEN @age_preference = 1 THEN (SELECT MAX(quintile) FROM age_under_18_quintile WHERE  Zipcode.age_under_18 >= age_under_18_quintile.age_under_18)
                WHEN @age_preference = 2 THEN (SELECT MAX(quintile) FROM age_range_20_34_quintile WHERE  Zipcode.age_range_20_34 >= age_range_20_34_quintile.age_range_20_34)
                WHEN @age_preference = 3 THEN (SELECT MAX(quintile) FROM age_range_35_64_quintile WHERE  Zipcode.age_range_35_64 >= age_range_35_64_quintile.age_range_35_64)
                WHEN @age_preference = 4 THEN (SELECT MAX(quintile) FROM age_over_65_quintile WHERE  Zipcode.age_over_65 >= age_over_65_quintile.age_over_65)
            END) AS age_score,
            median_home_value,
            median_rent_value,
            (CASE WHEN @user_preference_home_value_high THEN (SELECT MAX(quintile) FROM home_value_quintile WHERE  median_home_value >= home_value)
            ELSE (6 - (SELECT MAX(quintile) FROM home_value_quintile WHERE  median_home_value >= home_value))
            END) AS home_value_score,
            (CASE WHEN @user_preference_rent_value_high THEN (SELECT MAX(quintile) FROM rent_value_quintile WHERE  median_rent_value >= rent_value)
            ELSE (6 - (SELECT MAX(quintile) FROM rent_value_quintile WHERE  median_rent_value >= rent_value))
            END) AS rent_value_score,
            labor_force_participation_rate,
            average_household_income,
            poverty_rate,
           (SELECT MAX(quintile) FROM labor_force_quintile WHERE  labor_force_participation_rate >= labor_force_participation ) AS labor_force_score,
           (SELECT MAX(quintile) FROM household_income_quintile WHERE  Zipcode.average_household_income >= household_income_quintile.average_household_income) AS household_income_score,
           (6 - (SELECT MAX(quintile) FROM poverty_rate_quintile WHERE  Zipcode.poverty_rate >= poverty_rate_quintile.poverty_rate)) AS poverty_rate_score
    FROM Zipcode
    WHERE zipcode = @user_zipcode
    ) a;
-- Set params

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

-- For this test run each query individually for simplicity.
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
