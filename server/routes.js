const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/***************
 * CORE ROUTES *
 ***************/

// Route 1: GET /zipcode/:zipcode
const zipcode = async function(req, res) {
  connection.query(`
    SELECT * 
    FROM Zipcode 
    WHERE zipcode = ${req.params.zipcode}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 2: GET /business/:zipcode
const business = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(`
      SELECT B.id, B.name, B.address, B.review_stars, B.review_count, GROUP_CONCAT(C.name ORDER BY C.name SEPARATOR ', ') AS business_category_list
      FROM Business B
      JOIN Business_Category BC ON B.id = BC.business_id
      JOIN Category C ON BC.category_id = C.id
      WHERE B.zipcode = ${req.params.zipcode}
      GROUP BY B.id, B.name, B.address, B.review_stars, B.review_count
      ORDER BY B.name
      LIMIT ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    connection.query(`
      SELECT B.id, B.name, B.address, B.review_stars, B.review_count, GROUP_CONCAT(C.name ORDER BY C.name SEPARATOR ', ') AS business_category_list
      FROM Business B
      JOIN Business_Category BC ON B.id = BC.business_id
      JOIN Category C ON BC.category_id = C.id
      WHERE B.zipcode = ${req.params.zipcode}
      GROUP BY B.id, B.name, B.address, B.review_stars, B.review_count
      ORDER BY B.name
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 3: GET /search
const search = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  // Default parameters are determined by analyzing the data in the database
  const medianHomeValueHigh = req.query.median_home_value_high ?? 2000000;
  const medianHomeValueLow = req.query.median_home_value_low ?? 10000;
  const medianRentValueHigh = req.query.median_rent_value_high ?? 3500;
  const medianRentValueLow = req.query.median_rent_value_low ?? 100;
  const averageHouseholdIncomedHigh = req.query.average_household_income_high ?? 250000;
  const averagehouseholdIncomeLow = req.query.average_household_income_low ?? 2500;
  const ageUnder18High = req.query.age_under_18_high ?? 100;
  const ageUnder18Low = req.query.age_under_18_low ?? 0;
  const ageRange20_34High = req.query.age_range_20_34_high ?? 100;
  const ageRange20_34Low = req.query.age_range_20_34_low ?? 0;
  const ageRange35_64High = req.query.age_range_35_64_high ?? 100;
  const ageRange35_64Low = req.query.age_range_35_64_low ?? 0;
  const ageOver65High = req.query.age_over_65_high ?? 100;
  const ageOver65Low = req.query.age_over_65_low ?? 0;
  const bachelorGradRateHigh = req.query.bachelor_grad_rate_high ?? 100;
  const bachelorGradRateLow = req.query.bachelor_grad_rate_low ?? 0;
  const hsGradRateHigh = req.query.hs_grad_rate_high ?? 100;
  const hsGradRateLow = req.query.hs_grad_rate_low ?? 0;

  if (!page) {
    connection.query(`
      SELECT *
      FROM Zipcode
      WHERE (median_home_value < ${medianHomeValueHigh} AND median_home_value > ${medianHomeValueLow}) AND
            (median_rent_value < ${medianRentValueHigh} AND median_rent_value > ${medianRentValueLow}) AND
            (average_household_income < ${averageHouseholdIncomedHigh} AND average_household_income > ${averagehouseholdIncomeLow}) AND
            (age_under_18 < ${ageUnder18High} AND age_under_18 > ${ageUnder18Low}) AND
            (age_range_20_34 < ${ageRange20_34High} AND age_range_20_34 > ${ageRange20_34Low}) AND
            (age_range_35_64 < ${ageRange35_64High} AND age_range_35_64 > ${ageRange35_64Low}) AND
            (age_over_65 < ${ageOver65High} AND age_over_65 > ${ageOver65Low}) AND
            (bachelor_grad_rate < ${bachelorGradRateHigh} AND bachelor_grad_rate > ${bachelorGradRateLow}) AND
            (hs_grad_rate < ${hsGradRateHigh} AND hs_grad_rate > ${hsGradRateLow})
      ORDER BY zipcode
      LIMIT ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    connection.query(`
      SELECT *
      FROM Zipcode
      WHERE (median_home_value < ${medianHomeValueHigh} AND median_home_value > ${medianHomeValueLow}) AND
            (median_rent_value < ${medianRentValueHigh} AND median_rent_value > ${medianRentValueLow}) AND
            (average_household_income < ${averageHouseholdIncomedHigh} AND average_household_income > ${averagehouseholdIncomeLow}) AND
            (age_under_18 < ${ageUnder18High} AND age_under_18 > ${ageUnder18Low}) AND
            (age_range_20_34 < ${ageRange20_34High} AND age_range_20_34 > ${ageRange20_34Low}) AND
            (age_range_35_64 < ${ageRange35_64High} AND age_range_35_64 > ${ageRange35_64Low}) AND
            (age_over_65 < ${ageOver65High} AND age_over_65 > ${ageOver65Low}) AND
            (bachelor_grad_rate < ${bachelorGradRateHigh} AND bachelor_grad_rate > ${bachelorGradRateLow}) AND
            (hs_grad_rate < ${hsGradRateHigh} AND hs_grad_rate > ${hsGradRateLow})
      ORDER BY zipcode
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 4: GET /top_business_zipcode/:category
const top_business_zipcode = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(`
      SELECT Z.zipcode,
        Z.city,
        Z.state,
        AVG(B.review_stars) AS avg_review_star,
        COUNT(*) AS num_business
      FROM Zipcode Z
      JOIN (
        SELECT review_stars, zipcode
        FROM Business b
        JOIN Business_Category BC ON b.id = BC.business_id
        JOIN Category C ON BC.category_id = C.id
        WHERE C.name = '${req.params.category}'
      ) B ON Z.zipcode = B.zipcode
      GROUP BY Z.zipcode, Z.city, Z.state
      ORDER BY avg_review_star DESC, num_business DESC
      LIMIT ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    connection.query(`
      SELECT Z.zipcode,
        Z.city,
        Z.state,
        AVG(B.review_stars) AS avg_review_star,
        COUNT(*) AS num_business
      FROM Zipcode Z
      JOIN (
        SELECT review_stars, zipcode
        FROM Business b
        JOIN Business_Category BC ON b.id = BC.business_id
        JOIN Category C ON BC.category_id = C.id
        WHERE C.name = '${req.params.category}'
      ) B ON Z.zipcode = B.zipcode
      GROUP BY Z.zipcode, Z.city, Z.state
      ORDER BY avg_review_star DESC, num_business DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 5: GET /us_statistics
const us_statistics = async function(req, res) {
  connection.query(`
    SELECT * FROM US_Statistics;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

/******************
 * SCORING ROUTES *
 ******************/

// Route 6: GET /business_score/:category
const business_score = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  const reviewWeight = req.query.score_weight ?? 0.5;
  const countWeight = req.query.count_weight ?? 0.5;

  if (!page) {
    connection.query(`
      WITH bus_cat_review_star_quintile AS (
        SELECT quintile, MIN(review_stars) AS review_stars
        FROM (
          SELECT bus.zipcode, bus.review_stars, NTILE(5) OVER w AS quintile
          FROM Business bus
          JOIN (
              SELECT BC.business_id
              FROM Business_Category BC
              JOIN Category C ON BC.category_id = C.id
              WHERE C.name = '${req.params.category}'
          ) relevant_businesses ON bus.id = relevant_businesses.business_id
          WINDOW w AS (ORDER BY review_stars)) a
        GROUP BY quintile
      ), bus_cat_count_quintile AS (
        SELECT quintile, MIN(zipcode_category_count) AS zipcode_bus_category_count
        FROM (
          SELECT zipcode, zipcode_category_count, NTILE(5) OVER w AS quintile
          FROM (
              SELECT B.zipcode, COUNT(B.id) AS zipcode_category_count
              FROM Business B
              JOIN Business_Category BC ON B.id = BC.business_id
              JOIN Category C ON BC.category_id = C.id
              WHERE C.name = '${req.params.category}'
              GROUP BY zipcode
          ) category_count
          WINDOW w AS (ORDER BY zipcode_category_count)) a
        GROUP BY quintile
      )
      SELECT final.zipcode,
        city,
        state,
        cat_avg_stars,
        category_count,
        review_score,
        cat_count_score,
        ROUND(((review_score * ${reviewWeight}) + (cat_count_score * ${countWeight})), 2) AS final_weighted_score
      FROM (
        SELECT zipcode,
          cat_avg_stars,
          category_count,
          (SELECT MAX(quintile) FROM bus_cat_review_star_quintile WHERE cat_avg_stars >=  bus_cat_review_star_quintile.review_stars) AS review_score,
          (SELECT MAX(quintile) FROM bus_cat_count_quintile WHERE category_count >= bus_cat_count_quintile.zipcode_bus_category_count) AS cat_count_score
        FROM (
          SELECT B.zipcode,
            AVG(B.review_stars) AS cat_avg_stars,
            COUNT(B.id) AS category_count
          FROM Business B
          JOIN Business_Category BC ON B.id = BC.business_id
          JOIN Category C ON BC.category_id = C.id
          WHERE C.name = '${req.params.category}'
          GROUP BY zipcode
        ) a) final
      JOIN Zipcode ON Zipcode.zipcode = final.zipcode
      ORDER BY final_weighted_score DESC
      LIMIT ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    connection.query(`
      WITH bus_cat_review_star_quintile AS (
        SELECT quintile, MIN(review_stars) AS review_stars
        FROM (
          SELECT bus.zipcode, bus.review_stars, NTILE(5) OVER w AS quintile
          FROM Business bus
          JOIN (
              SELECT BC.business_id
              FROM Business_Category BC
              JOIN Category C ON BC.category_id = C.id
              WHERE C.name = '${req.params.category}'
          ) relevant_businesses ON bus.id = relevant_businesses.business_id
          WINDOW w AS (ORDER BY review_stars)) a
        GROUP BY quintile
      ), bus_cat_count_quintile AS (
        SELECT quintile, MIN(zipcode_category_count) AS zipcode_bus_category_count
        FROM (
          SELECT zipcode, zipcode_category_count, NTILE(5) OVER w AS quintile
          FROM (
              SELECT B.zipcode, COUNT(B.id) AS zipcode_category_count
              FROM Business B
              JOIN Business_Category BC ON B.id = BC.business_id
              JOIN Category C ON BC.category_id = C.id
              WHERE C.name = '${req.params.category}'
              GROUP BY zipcode
          ) category_count
          WINDOW w AS (ORDER BY zipcode_category_count)) a
        GROUP BY quintile
      )
      SELECT final.zipcode,
        city,
        state,
        cat_avg_stars,
        category_count,
        review_score,
        cat_count_score,
        ROUND(((review_score * ${reviewWeight}) + (cat_count_score * ${countWeight})), 2) AS final_weighted_score
      FROM (
        SELECT zipcode,
          cat_avg_stars,
          category_count,
          (SELECT MAX(quintile) FROM bus_cat_review_star_quintile WHERE cat_avg_stars >=  bus_cat_review_star_quintile.review_stars) AS review_score,
          (SELECT MAX(quintile) FROM bus_cat_count_quintile WHERE category_count >= bus_cat_count_quintile.zipcode_bus_category_count) AS cat_count_score
        FROM (
          SELECT B.zipcode,
            AVG(B.review_stars) AS cat_avg_stars,
            COUNT(B.id) AS category_count
          FROM Business B
          JOIN Business_Category BC ON B.id = BC.business_id
          JOIN Category C ON BC.category_id = C.id
          WHERE C.name = '${req.params.category}'
          GROUP BY zipcode
        ) a) final
      JOIN Zipcode ON Zipcode.zipcode = final.zipcode
      ORDER BY final_weighted_score DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 7: GET /housing_score
const housing_score = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  const houseWeight = req.query.house_weight ?? 0.5;
  const rentWeight = req.query.rent_weight ?? 0.5;
  const homeValueHigh = req.home_value_high ?? true;
  const rentValueHigh = req.rent_value_high ?? true;

  if (!page) {
    connection.query(`
      SELECT zipcode,
        city,
        state,
        median_home_value,
        median_rent_value,
        home_value_score,
        rent_value_score,
        ROUND((COALESCE(home_value_score * ${houseWeight}, 0) + COALESCE(rent_value_score * ${rentWeight}, 0)), 2) AS final_weighted_housing_score
      FROM (
        SELECT zipcode,
          city,
          state,
          median_home_value,
          median_rent_value,
          (CASE WHEN ${homeValueHigh} THEN (SELECT MAX(quintile) FROM home_value_quintile WHERE median_home_value >= home_value)
          ELSE (6 - (SELECT MAX(quintile) FROM home_value_quintile WHERE  median_home_value >= home_value))
          END) AS home_value_score,
          (CASE WHEN ${rentValueHigh} THEN (SELECT MAX(quintile) FROM rent_value_quintile WHERE  median_rent_value >= rent_value)
          ELSE (6 - (SELECT MAX(quintile) FROM rent_value_quintile WHERE  median_rent_value >= rent_value))
          END) AS rent_value_score
        FROM Zipcode
        WHERE (median_home_value IS NOT NULL OR median_rent_value IS NOT NULL)) a
      ORDER BY final_weighted_housing_score DESC
      LIMIT ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    connection.query(`
      SELECT zipcode,
        city,
        state,
        median_home_value,
        median_rent_value,
        home_value_score,
        rent_value_score,
        ROUND((COALESCE(home_value_score * ${houseWeight}, 0) + COALESCE(rent_value_score * ${rentWeight}, 0)), 2) AS final_weighted_housing_score
      FROM (
        SELECT zipcode,
          city,
          state,
          median_home_value,
          median_rent_value,
          (CASE WHEN ${homeValueHigh} THEN (SELECT MAX(quintile) FROM home_value_quintile WHERE median_home_value >= home_value)
          ELSE (6 - (SELECT MAX(quintile) FROM home_value_quintile WHERE  median_home_value >= home_value))
          END) AS home_value_score,
          (CASE WHEN ${rentValueHigh} THEN (SELECT MAX(quintile) FROM rent_value_quintile WHERE  median_rent_value >= rent_value)
          ELSE (6 - (SELECT MAX(quintile) FROM rent_value_quintile WHERE  median_rent_value >= rent_value))
          END) AS rent_value_score
        FROM Zipcode
        WHERE (median_home_value IS NOT NULL OR median_rent_value IS NOT NULL)) a
      ORDER BY final_weighted_housing_score DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 8: GET /economics_score
const economics_score = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  const lFRateWeight = req.query.lf_rate_weight ?? 0.33;
  const householdIncomeWeight = req.query.household_income_weight ?? 0.33;
  const povertyRateWeight = req.query.poverty_rate_weight ?? 0.33;

  if (!page) {
    connection.query(`
      SELECT zipcode,
        city,
        state,
        labor_force_participation_rate,
        average_household_income,
        poverty_rate,
        labor_force_score,
        household_income_score,
        poverty_rate_score,
        ROUND((labor_force_score * ${lFRateWeight}) + (household_income_score * ${householdIncomeWeight}) + (poverty_rate_score * ${povertyRateWeight}), 2) AS final_economic_weighted_score
      FROM (
        SELECT zipcode,
          city,
          state,
          labor_force_participation_rate,
          average_household_income,
          poverty_rate,
          (SELECT MAX(quintile) FROM labor_force_quintile WHERE  labor_force_participation_rate >= labor_force_participation ) AS labor_force_score,
          (SELECT MAX(quintile) FROM household_income_quintile WHERE  Zipcode.average_household_income >= household_income_quintile.average_household_income) AS household_income_score,
          (6 - (SELECT MAX(quintile) FROM poverty_rate_quintile WHERE  Zipcode.poverty_rate >= poverty_rate_quintile.poverty_rate)) AS poverty_rate_score
        FROM Zipcode
        WHERE (labor_force_participation_rate IS NOT NULL AND average_household_income IS NOT NULL AND poverty_rate IS NOT NULL)) a
      ORDER BY final_economic_weighted_score DESC
      LIMIT ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    connection.query(`
      SELECT zipcode,
        city,
        state,
        labor_force_participation_rate,
        average_household_income,
        poverty_rate,
        labor_force_score,
        household_income_score,
        poverty_rate_score,
        ROUND((labor_force_score * ${lFRateWeight}) + (household_income_score * ${householdIncomeWeight}) + (poverty_rate_score * ${povertyRateWeight}), 2) AS final_economic_weighted_score
      FROM (
        SELECT zipcode,
          city,
          state,
          labor_force_participation_rate,
          average_household_income,
          poverty_rate,
          (SELECT MAX(quintile) FROM labor_force_quintile WHERE  labor_force_participation_rate >= labor_force_participation ) AS labor_force_score,
          (SELECT MAX(quintile) FROM household_income_quintile WHERE  Zipcode.average_household_income >= household_income_quintile.average_household_income) AS household_income_score,
          (6 - (SELECT MAX(quintile) FROM poverty_rate_quintile WHERE  Zipcode.poverty_rate >= poverty_rate_quintile.poverty_rate)) AS poverty_rate_score
        FROM Zipcode
        WHERE (labor_force_participation_rate IS NOT NULL AND average_household_income IS NOT NULL AND poverty_rate IS NOT NULL)) a
      ORDER BY final_economic_weighted_score DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 9: GET /socio_demographics_score
const socio_demographics_score = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  const educationWeight = req.query.education_weight ?? 0.33;
  const ageWeight = req.query.age_weight ?? 0.33;

  const highEducationalAttainment = req.high_educational_attainment ?? 3;
  const agePreference = req.high_age_preference ?? 2;
  
  if (!page) {
    connection.query(`
      SELECT zipcode,
        city,
        state,
        education_rate,
        age_range_rate,
        education_score,
        age_score,
        ROUND((education_score * ${educationWeight}) + (age_score * ${ageWeight}), 2) AS final_weighted_socio_demographic_score
      FROM (
        SELECT zipcode,
          city,
          state,
          (CASE
            WHEN ${highEducationalAttainment} = 1 THEN bachelor_grad_rate
            WHEN ${highEducationalAttainment} = 2 THEN hs_grad_rate
            WHEN ${highEducationalAttainment} = 3 THEN combined_bachelor_hs_rate
          END) AS education_rate,
          (CASE
            WHEN ${agePreference} = 1 THEN age_under_18
            WHEN ${agePreference} = 2 THEN age_range_20_34
            WHEN ${agePreference} = 3 THEN age_range_35_64
            WHEN ${agePreference} = 4 THEN age_over_65
          END) AS age_range_rate,
          (CASE
            WHEN ${highEducationalAttainment} = 1 THEN (SELECT MAX(quintile) FROM bachelor_grad_rate_quintile WHERE Zipcode.bachelor_grad_rate >= bachelor_grad_rate_quintile.bachelor_grad_rate )
            WHEN ${highEducationalAttainment} = 2 THEN (SELECT MAX(quintile) FROM hs_grad_rate_quintile WHERE Zipcode.hs_grad_rate >= hs_grad_rate_quintile.hs_grad_rate)
            WHEN ${highEducationalAttainment} = 3 THEN (SELECT MAX(quintile) FROM combined_bachelor_hs_rate_quintile WHERE Zipcode.combined_bachelor_hs_rate >= combined_bachelor_hs_rate_quintile.combined_bachelor_hs_rate)
          END) AS education_score,
          (CASE
            WHEN ${agePreference} = 1 THEN (SELECT MAX(quintile) FROM age_under_18_quintile WHERE  Zipcode.age_under_18 >= age_under_18_quintile.age_under_18)
            WHEN ${agePreference} = 2 THEN (SELECT MAX(quintile) FROM age_range_20_34_quintile WHERE  Zipcode.age_range_20_34 >= age_range_20_34_quintile.age_range_20_34)
            WHEN ${agePreference} = 3 THEN (SELECT MAX(quintile) FROM age_range_35_64_quintile WHERE  Zipcode.age_range_35_64 >= age_range_35_64_quintile.age_range_35_64)
            WHEN ${agePreference} = 4 THEN (SELECT MAX(quintile) FROM age_over_65_quintile WHERE  Zipcode.age_over_65 >= age_over_65_quintile.age_over_65)
          END) AS age_score
        FROM Zipcode) a
      WHERE education_rate IS NOT NULL AND age_range_rate IS NOT NULL
      ORDER BY final_weighted_socio_demographic_score DESC
      LIMIT ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    connection.query(`
      SELECT zipcode,
        city,
        state,
        education_rate,
        age_range_rate,
        education_score,
        age_score,
        ROUND((education_score * ${educationWeight}) + (age_score * ${ageWeight}), 2) AS final_weighted_socio_demographic_score
      FROM (
        SELECT zipcode,
          city,
          state,
          (CASE
            WHEN ${highEducationalAttainment} = 1 THEN bachelor_grad_rate
            WHEN ${highEducationalAttainment} = 2 THEN hs_grad_rate
            WHEN ${highEducationalAttainment} = 3 THEN combined_bachelor_hs_rate
          END) AS education_rate,
          (CASE
            WHEN ${agePreference} = 1 THEN age_under_18
            WHEN ${agePreference} = 2 THEN age_range_20_34
            WHEN ${agePreference} = 3 THEN age_range_35_64
            WHEN ${agePreference} = 4 THEN age_over_65
          END) AS age_range_rate,
          (CASE
            WHEN ${highEducationalAttainment} = 1 THEN (SELECT MAX(quintile) FROM bachelor_grad_rate_quintile WHERE Zipcode.bachelor_grad_rate >= bachelor_grad_rate_quintile.bachelor_grad_rate )
            WHEN ${highEducationalAttainment} = 2 THEN (SELECT MAX(quintile) FROM hs_grad_rate_quintile WHERE Zipcode.hs_grad_rate >= hs_grad_rate_quintile.hs_grad_rate)
            WHEN ${highEducationalAttainment} = 3 THEN (SELECT MAX(quintile) FROM combined_bachelor_hs_rate_quintile WHERE Zipcode.combined_bachelor_hs_rate >= combined_bachelor_hs_rate_quintile.combined_bachelor_hs_rate)
          END) AS education_score,
          (CASE
            WHEN ${agePreference} = 1 THEN (SELECT MAX(quintile) FROM age_under_18_quintile WHERE  Zipcode.age_under_18 >= age_under_18_quintile.age_under_18)
            WHEN ${agePreference} = 2 THEN (SELECT MAX(quintile) FROM age_range_20_34_quintile WHERE  Zipcode.age_range_20_34 >= age_range_20_34_quintile.age_range_20_34)
            WHEN ${agePreference} = 3 THEN (SELECT MAX(quintile) FROM age_range_35_64_quintile WHERE  Zipcode.age_range_35_64 >= age_range_35_64_quintile.age_range_35_64)
            WHEN ${agePreference} = 4 THEN (SELECT MAX(quintile) FROM age_over_65_quintile WHERE  Zipcode.age_over_65 >= age_over_65_quintile.age_over_65)
          END) AS age_score
        FROM Zipcode) a
      WHERE education_rate IS NOT NULL AND age_range_rate IS NOT NULL
      ORDER BY final_weighted_socio_demographic_score DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

module.exports = {
  zipcode,
  business,
  search,
  top_business_zipcode,
  us_statistics,
  business_score,
  housing_score,
  economics_score,
  socio_demographics_score,
}
