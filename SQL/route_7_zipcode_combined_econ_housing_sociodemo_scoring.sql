

USE ZIPCODE_DB;


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







