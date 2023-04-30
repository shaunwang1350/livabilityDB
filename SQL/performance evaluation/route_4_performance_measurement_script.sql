
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

SET @category := 'Restaurants';

WHILE @counter <= @iterations DO

    -- Record start time
    SET @start_time = NOW(6);

    -- Run Query 1
    SELECT
       B.zipcode,
       Z.city,
       Z.state,
       AVG(review_stars) AS avg_review_star,
       COUNT(*) AS num_business
    FROM Business B
    JOIN Zipcode Z
       ON B.zipcode = Z.zipcode
    WHERE B.id IN
      (SELECT business_id
       FROM Business_Category BC
       JOIN Category C ON BC.category_id = C.id
       WHERE LOWER(C.name) LIKE CONCAT('%', @category, '%'))
    GROUP BY B.zipcode, Z.city, Z.state
    ORDER BY avg_review_star DESC, num_business DESC;

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

SET @category := 'Restaurants';

WHILE @counter <= @iterations DO

    -- Record start time
    SET @start_time = NOW(6);

    -- Run Query 2

    SELECT
       Z.zipcode,
       Z.city,
       Z.state,
       AVG(review_stars) AS avg_review_star,
       COUNT(*) AS num_business
    FROM Zipcode Z
    JOIN
      (SELECT review_stars, zipcode
       FROM Business b -- (SELECT id, review_stars, zipcode FROM Business) b -- Business b --
        JOIN Business_Category BC ON b.id = BC.business_id
       JOIN Category C ON BC.category_id = C.id
       WHERE C.name = @category) businesses
    ON Z.zipcode = businesses.zipcode
    GROUP BY Z.zipcode, Z.city, Z.state
    ORDER BY avg_review_star DESC, num_business DESC;

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
-- Calculate Q1 - Q2 manually and compute relative difference manually if Glitch in Script where avg Q1 - avg Q1 gives wrong result
SELECT CONCAT('Absolute Difference Query 1 - Query 2 Average Times: ', @performance_difference_q1_q2, ' milliseconds') AS 'Abs Difference Q1 - Q2'; -- if positive it means optimized Query 2 is faster than Query 1 by X milliseconds
SELECT CONCAT('Relative Difference (Absolute Difference/Query 1 Average Time: ', @performance_relative_difference_q1_q2 * 100, ' %') AS 'Relative Difference Abs/Q1 Time'; -- if positive it means optimized Query 2 is faster than Query 1 by X% of Query 1's original time








-- Raw Results no Strings
SELECT @query1_average;
SELECT @query2_average;
SELECT @performance_difference_q1_q2;
SELECT @performance_relative_difference_q1_q2;
