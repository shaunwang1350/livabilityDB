
USE ZIPCODE_DB;


SET @user_zipcode = 19104;

-- Example of User defined parameters
-- The user wants to evaluate Cinemas (Restaurants category may be used as well, ideally popular categories)
SET @labor_force_participation_weight:= 0.40; -- worth 80% of weighted score
SET @household_income_weight:= 0.40; -- worth 20% of weighted score
SET @poverty_rate_weight:= 0.20; -- worth 20% of weighted score



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



