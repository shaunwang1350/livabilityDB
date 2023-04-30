USE ZIPCODE_DB;

SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;
SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;
SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;
SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;
SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;
SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;
SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;
SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;
SET @medianHomeValueHig = 100000; SET @medianHomeValueLow = 1000;

SELECT zipcode,
       city,
       state,
       median_age,
       median_home_value,
       median_rent_value,
       combined_bachelor_hs_rate,
       average_household_income,
       unemployment_rate
FROM Zipcode
WHERE (median_home_value < @medianHomeValueHigh AND median_home_value > @medianHomeValueLow)
  AND (median_rent_value < @medianRentValueHigh AND median_rent_value > @medianRentValueLow)
  AND (average_household_income < @avgHouseholdIncomedHigh AND average_household_income > @avghouseholdIncomeLow)
  AND (age_under_18 < @ageUnder18High AND age_under_18 > @ageUnder18Low)
  AND (age_range_20_34 < @ageRange20_34High AND age_range_20_34 > @ageRange20_34Low)
  AND (age_range_35_64 < @ageRange35_64High AND age_range_35_64 > @ageRange35_64Low)
  AND (age_over_65 < @ageOver65High AND age_over_65 > @ageOver65Low)
  AND (bachelor_grad_rate < @bachelorGradRateHigh AND bachelor_grad_rate > @bachelorGradRateLow)
  AND (hs_grad_rate < @hsGradRateHigh AND hs_grad_rate > @hsGradRateLow)
ORDER BY zipcode;

