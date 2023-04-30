

CREATE DATABASE ZIPCODE_DB;

USE ZIPCODE_DB;


CREATE TABLE Zipcode(
	zipcode CHAR(5),
	city VARCHAR(255),
	state CHAR(2),
    country CHAR(2),
    timezone VARCHAR(255),
	latitude DECIMAL(4, 2),
	longitude DECIMAL(5, 2),
	total_house_units MEDIUMINT UNSIGNED,
	occupied_house_units MEDIUMINT UNSIGNED,
	owner_occupied_units MEDIUMINT UNSIGNED,
	renter_occupied_units MEDIUMINT UNSIGNED,
	median_home_value MEDIUMINT UNSIGNED,
	median_rent_value MEDIUMINT UNSIGNED,
	working_age_pop_over_16 MEDIUMINT UNSIGNED,
	pop_with_high_school MEDIUMINT UNSIGNED,
	pop_with_bachelor MEDIUMINT UNSIGNED,
	labor_force_participation_rate DECIMAL(4,1),
	unemployment_rate DECIMAL(4,1),
	average_household_income MEDIUMINT UNSIGNED,
	rate_of_civilian_with_insurance MEDIUMINT UNSIGNED,
	poverty_rate DECIMAL(4,1),
	total_population MEDIUMINT UNSIGNED,
	median_age  MEDIUMINT UNSIGNED,
	age_under_5  DECIMAL(4, 1),
	age_5_to_9 DECIMAL(4, 1),
	age_10_to_14 DECIMAL(4, 1),
    age_15_to_19 DECIMAL(4, 1),
	age_20_to_24 DECIMAL(4, 1),
	age_25_to_34 DECIMAL(4, 1),
	age_35_to_44 DECIMAL(4, 1),
	age_45_to_54 DECIMAL(4, 1),
	age_55_to_59 DECIMAL(4, 1),
	age_60_to_64 DECIMAL(4, 1),
	age_65_to_74 DECIMAL(4, 1),
	age_75_to_84 DECIMAL(4, 1),
	age_over_85 DECIMAL(4, 1),
    age_over_16 DECIMAL(4, 1),
	age_over_18 DECIMAL(4, 1),
    age_under_18 DECIMAL(4, 1),
    age_over_21 DECIMAL(4, 1),
    age_over_65 DECIMAL(4, 1),
    male_female_sex_ratio DECIMAL(7, 1),
    male_female_sex_ratio_over_18 DECIMAL(7, 1),
	race_white DECIMAL(4, 1),
	race_black DECIMAL(4, 1),
	race_native_american DECIMAL(4, 1),
	race_asian DECIMAL(4, 1),
    race_asian_indian DECIMAL(4, 1),
    race_asian_chinese DECIMAL(4, 1),
    race_asian_japanese DECIMAL(4, 1),
    race_asian_korean DECIMAL(4, 1),
    race_asian_vietnamese DECIMAL(4, 1),
    race_asian_filipino DECIMAL(4, 1),
	race_pacific_islander DECIMAL(4, 1),
	race_other DECIMAL(4, 1),
    hispanic_any_race DECIMAL(4, 1),
	race_two_or_more_or_unknown DECIMAL(4, 1),
	PRIMARY KEY (zipcode)
);


-- Table for different businesses
CREATE TABLE Business(
	id CHAR(22),
	name VARCHAR(255),
	zipcode CHAR(5),
	address VARCHAR(255),
	review_stars DECIMAL(2, 1),
	review_count SMALLINT UNSIGNED,
	PRIMARY KEY (id),
	FOREIGN KEY (zipcode) REFERENCES Zipcode(zipcode)
);


-- Table for Categories
CREATE TABLE Category(
	id INT UNSIGNED,
	name VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY (id)
);


-- Table for Business Category
CREATE TABLE Business_Category(
	business_id CHAR(22),
	category_id INT UNSIGNED,
	PRIMARY KEY(business_id, category_id),
	FOREIGN KEY (business_id) REFERENCES Business(id),
	FOREIGN KEY (category_id) REFERENCES Category(id)
);




