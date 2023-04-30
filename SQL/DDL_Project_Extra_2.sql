
-- Use this file only once base Zipcode and Business data inserted into DB
USE ZIPCODE_DB;

-- Index Creation for Optimization
-- Index and Unique constraint created on Category name
ALTER TABLE Category ADD CONSTRAINT name UNIQUE(name);

ALTER TABLE Category DROP INDEX name;

-- CREATE INDEX idx_zipcode ON Business(zipcode);
-- ALTER TABLE Business DROP INDEX idx_zipcode;


-- DDL Additions for Socio-Demographic Scoring
-- Extra Data for Education Scoring
CREATE TABLE Temp (
zipcode char(5) PRIMARY KEY,
hs_grad_rate DECIMAL(4,1),
bachelor_grad_rate DECIMAL(4,1),
combined_bachelor_hs_rate DECIMAL(4, 1)
);

-- After creating this Temp Table:
-- Upload "Education Grad Rates Zipcode.xlsx" directly into this Temp using DataGrip

-- Add new high school graduation rate column to main Zipcode Table
ALTER TABLE Zipcode
ADD hs_grad_rate DECIMAL(4,1) AFTER pop_with_bachelor;

-- Add new bachelor's degree rate column to main Zipcode Table
ALTER TABLE Zipcode
ADD bachelor_grad_rate DECIMAL(4,1) AFTER hs_grad_rate;

-- Add new combined high school graduation and bachelor's degree rate column to main Zipcode Table
ALTER TABLE Zipcode
ADD combined_bachelor_hs_rate DECIMAL(4,1) AFTER bachelor_grad_rate;

-- Upload high school graduation rate data into hs_grad_rate column of main Zipcode Table
UPDATE Zipcode
SET hs_grad_rate = (SELECT hs_grad_rate FROM Temp WHERE Zipcode.zipcode = Temp.zipcode);

-- Upload bachelor's degree rate data into bachelor_grad_rate column of main Zipcode Table
UPDATE Zipcode
SET bachelor_grad_rate = (SELECT bachelor_grad_rate FROM Temp WHERE Zipcode.zipcode = Temp.zipcode);

-- Upload combined high school graduation and bachelor's degree and rate data into combined_bachelor_hs_rate  column of main Zipcode Table
UPDATE Zipcode
SET combined_bachelor_hs_rate = (SELECT combined_bachelor_hs_rate FROM Temp WHERE Zipcode.zipcode = Temp.zipcode);

-- Delete temporary table
DROP TABLE Temp;



-- Creating Additional Age Ranges for Age Scoring
-- Creating age range columns that are less specific and more relevant to overall age categories

-- Adding 20-34 Age Range (Young Adult) Column
ALTER TABLE Zipcode
ADD age_range_20_34 DECIMAL(4,1) AFTER age_over_21;

-- Adding Data for 20-34 Age Range (Young Adult) Column based on more specific age ranges data
UPDATE Zipcode
SET age_range_20_34  = (age_20_to_24 + age_25_to_34);

-- Adding 35-64 Age Range (Middle-Aged Adult) Column
ALTER TABLE Zipcode
ADD age_range_35_64 DECIMAL(4,1) AFTER age_range_20_34;

-- Adding Data for 35-64 Age Range (Middle-Aged Adult) Column based on more specific age ranges data
UPDATE Zipcode
SET age_range_35_64  = (age_35_to_44 + age_45_to_54 + age_55_to_59 + age_60_to_64);




-- Creating Quintile Tables related to Economic Score
CREATE TABLE labor_force_quintile(
    quintile SMALLINT,
    labor_force_participation DECIMAL(4,1)
);

INSERT INTO labor_force_quintile(quintile, labor_force_participation)
   SELECT quintile, MIN(labor_force_participation_rate) AS labor_force_participation
    FROM (
    SELECT zipcode,
       labor_force_participation_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE labor_force_participation_rate IS NOT NULL
    WINDOW w AS (ORDER BY labor_force_participation_rate)) a
    GROUP BY quintile;


CREATE TABLE household_income_quintile(
    quintile SMALLINT,
    average_household_income MEDIUMINT
);

INSERT INTO household_income_quintile(quintile, average_household_income)
    SELECT quintile, MIN(average_household_income) AS average_household_income
    FROM (
    SELECT zipcode,
       average_household_income,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE average_household_income IS NOT NULL
    WINDOW w AS (ORDER BY average_household_income)) a
    GROUP BY quintile;

CREATE TABLE poverty_rate_quintile(
    quintile SMALLINT,
    poverty_rate DECIMAL(4, 1)
);

INSERT INTO poverty_rate_quintile(quintile, poverty_rate)
    SELECT quintile, MIN(poverty_rate) AS poverty_rate
    FROM (
    SELECT zipcode,
       poverty_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE poverty_rate IS NOT NULL
    WINDOW w AS (ORDER BY poverty_rate)) a
    GROUP BY quintile;



-- Creating Quintile Tables related to Housing Score
CREATE TABLE home_value_quintile(
    quintile SMALLINT,
    home_value MEDIUMINT
);

INSERT INTO home_value_quintile(quintile, home_value)
    SELECT quintile, MIN(median_home_value) AS home_value
    FROM (
    SELECT zipcode,
       median_home_value,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE median_home_value IS NOT NULL
    WINDOW w AS (ORDER BY median_home_value)) a
    GROUP BY quintile;

CREATE TABLE rent_value_quintile(
    quintile SMALLINT,
    rent_value MEDIUMINT
);

INSERT INTO rent_value_quintile(quintile, rent_value)
    SELECT quintile, MIN(median_rent_value) AS rent_value
    FROM (
    SELECT zipcode,
       median_rent_value,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE median_rent_value IS NOT NULL
    WINDOW w AS (ORDER BY median_rent_value)) a
    GROUP BY quintile;




-- Creating Quintile Tables related to Socio-Demographic Score (Age and Education)
CREATE TABLE age_under_18_quintile(
    quintile SMALLINT,
    age_under_18 DECIMAL(4,1)
);

INSERT INTO age_under_18_quintile(quintile, age_under_18)
    SELECT quintile, MIN(age_under_18) AS age_under_18
    FROM (
    SELECT zipcode,
       age_under_18,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE age_under_18 IS NOT NULL
    WINDOW w AS (ORDER BY age_under_18)) a
    GROUP BY quintile;

CREATE TABLE age_range_20_34_quintile(
    quintile SMALLINT,
    age_range_20_34 DECIMAL(4,1)
);

INSERT INTO age_range_20_34_quintile(quintile, age_range_20_34)
    SELECT quintile, MIN(age_range_20_34) AS age_range_20_34
    FROM (
    SELECT zipcode,
       age_range_20_34,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE age_range_20_34 IS NOT NULL
    WINDOW w AS (ORDER BY age_range_20_34)) a
    GROUP BY quintile;

CREATE TABLE age_range_35_64_quintile(
    quintile SMALLINT,
    age_range_35_64 DECIMAL(4,1)
);

INSERT INTO age_range_35_64_quintile(quintile, age_range_35_64)
    SELECT quintile, MIN(age_range_35_64) AS age_range_35_64
    FROM (
    SELECT zipcode,
       age_range_35_64,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE age_range_35_64 IS NOT NULL
    WINDOW w AS (ORDER BY age_range_35_64)) a
    GROUP BY quintile;
SELECT * FROM Zipcode WHERE age_range_35_64 = 0;

CREATE TABLE age_over_65_quintile(
    quintile SMALLINT,
    age_over_65 DECIMAL(4,1)
);

INSERT INTO age_over_65_quintile(quintile, age_over_65)
    SELECT quintile, MIN(age_over_65) AS age_over_65
    FROM (
    SELECT zipcode,
       age_over_65,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE age_over_65 IS NOT NULL
    WINDOW w AS (ORDER BY age_over_65)) a
    GROUP BY quintile;

CREATE TABLE bachelor_grad_rate_quintile(
    quintile SMALLINT,
    bachelor_grad_rate DECIMAL(4,1)
);

INSERT INTO bachelor_grad_rate_quintile(quintile, bachelor_grad_rate)
    SELECT quintile, MIN(bachelor_grad_rate) AS bachelor_grad_rate
    FROM (
    SELECT zipcode,
       bachelor_grad_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE bachelor_grad_rate IS NOT NULL
    WINDOW w AS (ORDER BY bachelor_grad_rate)) a
    GROUP BY quintile;

CREATE TABLE hs_grad_rate_quintile(
    quintile SMALLINT,
    hs_grad_rate DECIMAL(4,1)
);

INSERT INTO hs_grad_rate_quintile(quintile, hs_grad_rate)
    SELECT quintile, MIN(hs_grad_rate) AS hs_grad_rate
    FROM (
    SELECT zipcode,
       hs_grad_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE hs_grad_rate IS NOT NULL
    WINDOW w AS (ORDER BY hs_grad_rate)) a
    GROUP BY quintile;

CREATE TABLE combined_bachelor_hs_rate_quintile(
    quintile SMALLINT,
    combined_bachelor_hs_rate DECIMAL(4,1)
);

INSERT INTO combined_bachelor_hs_rate_quintile(quintile, combined_bachelor_hs_rate)
    SELECT quintile, MIN(combined_bachelor_hs_rate) AS combined_bachelor_hs_rate
    FROM (
    SELECT zipcode,
       combined_bachelor_hs_rate,
       NTILE(5) OVER w AS quintile
    FROM Zipcode
    WHERE combined_bachelor_hs_rate IS NOT NULL
    WINDOW w AS (ORDER BY combined_bachelor_hs_rate)) a
    GROUP BY quintile;

