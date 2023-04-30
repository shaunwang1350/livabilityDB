

USE ZIPCODE_DB;

SET @user_zipcode = 19104;
-- Set params
SET @high_educational_attainment := 3; -- Chooses whether bachelors rate or highschool grad rate is used
SET @age_preference := 1; -- 1: neighbourhoods with more children (0-18); 2: Young Adults: 20-34; 3 Middle-Aged Adults: 35-64; 4: Neighbourhood with more old people (over 65)
SET @age_weight := 0.30 ;
SET @education_weight:= 0.70;


-- Get summary metrics for these parameters to use in scoring
WITH age_under_18_quintile AS (
    SELECT quintile, MIN(age_under_18) AS age_under_18
    FROM (
    SELECT zipcode,
       age_under_18,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE age_under_18 IS NOT NULL
    WINDOW w AS (ORDER BY age_under_18)) a
    GROUP BY quintile
), age_range_20_34_quintile AS (
    SELECT quintile, MIN(age_range_20_34) AS age_range_20_34
    FROM (
    SELECT zipcode,
       age_range_20_34,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE age_range_20_34 IS NOT NULL
    WINDOW w AS (ORDER BY age_range_20_34)) a
    GROUP BY quintile
), age_range_35_64_quintile AS (
    SELECT quintile, MIN(age_range_35_64) AS age_range_35_64
    FROM (
    SELECT zipcode,
       age_range_35_64,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE age_range_35_64 IS NOT NULL
    WINDOW w AS (ORDER BY age_range_35_64)) a
    GROUP BY quintile
), age_over_65_quintile AS (
    SELECT quintile, MIN(age_over_65) AS age_over_65
    FROM (
    SELECT zipcode,
       age_over_65,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE age_over_65 IS NOT NULL
    WINDOW w AS (ORDER BY age_over_65)) a
    GROUP BY quintile
), bachelor_grad_rate_quintile AS (
    SELECT quintile, MIN(bachelor_grad_rate) AS bachelor_grad_rate
    FROM (
    SELECT zipcode,
       bachelor_grad_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE bachelor_grad_rate IS NOT NULL
    WINDOW w AS (ORDER BY bachelor_grad_rate)) a
    GROUP BY quintile
), hs_grad_rate_quintile AS (
    SELECT quintile, MIN(hs_grad_rate) AS hs_grad_rate
    FROM (
    SELECT zipcode,
       hs_grad_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE hs_grad_rate IS NOT NULL
    WINDOW w AS (ORDER BY hs_grad_rate)) a
    GROUP BY quintile
), combined_bachelor_hs_rate_quintile AS (
    SELECT quintile, MIN(combined_bachelor_hs_rate) AS combined_bachelor_hs_rate
    FROM (
    SELECT zipcode,
       combined_bachelor_hs_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE combined_bachelor_hs_rate IS NOT NULL
    WINDOW w AS (ORDER BY combined_bachelor_hs_rate)) a
    GROUP BY quintile
)

-- Scoring System
SELECT
    zipcode,
    city,
    state,
    education_rate,
    age_range_rate,
    education_score,
    age_score,
    -- ROUND(education_score * @education_weight, 2) AS weighted_education_score,
    -- ROUND(age_score * @age_weight, 2) AS weighted_age_score,
    ROUND((education_score * @education_weight) + (age_score * @age_weight), 2) AS final_weighted_socio_demographic_score
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
        END) AS age_score
FROM Zipcode
WHERE zipcode = @user_zipcode) a;




