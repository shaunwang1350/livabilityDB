# -*- coding: utf-8 -*-
"""
Created on Sun Mar 12 13:29:51 2023

@title: Data Cleansing of DPO5ACS 2021 5-Y Survey Data for Zip code Age, Race and Sex Data

@author: Julien Desautels
"""

# Data Cleansing of DPO5ACS 2021 5-Y Survey Data

import pandas as pd
import numpy as np


# Load Data
raw_data = pd.read_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\DP05ACS DEMOGRAPHIC AND HOUSING ESTIMATES\\ACSDP5Y2021.DP05-Data.csv",
                       na_values=['-', '(X)', '**', '*****', '1-'], skiprows=1)
# Since after observing data NULL values were often invalid String characters in numeric columns
# It was easier in Pandas to correct these to nan upon loading the Data at the outset
# using na_values=['-', '(X)', '**', '*****', '1-'] for all invalid characters

# After manual filtering of columns, this list keeps the retained column names
columns_keep = [ 
                "Geographic Area Name", 
                "Estimate!!SEX AND AGE!!Total population",
                "Estimate!!SEX AND AGE!!Total population!!Median age (years)",
                "Percent!!SEX AND AGE!!Total population!!Under 5 years",
                "Percent!!SEX AND AGE!!Total population!!5 to 9 years",
                "Percent!!SEX AND AGE!!Total population!!10 to 14 years",
                "Percent!!SEX AND AGE!!Total population!!15 to 19 years",
                "Percent!!SEX AND AGE!!Total population!!20 to 24 years",
                "Percent!!SEX AND AGE!!Total population!!25 to 34 years",
                "Percent!!SEX AND AGE!!Total population!!35 to 44 years",
                "Percent!!SEX AND AGE!!Total population!!45 to 54 years",
                "Percent!!SEX AND AGE!!Total population!!55 to 59 years",
                "Percent!!SEX AND AGE!!Total population!!60 to 64 years",
                "Percent!!SEX AND AGE!!Total population!!65 to 74 years",
                "Percent!!SEX AND AGE!!Total population!!75 to 84 years",
                "Percent!!SEX AND AGE!!Total population!!85 years and over",
                "Percent!!SEX AND AGE!!Total population!!16 years and over", 
                "Percent!!SEX AND AGE!!Total population!!18 years and over",
                "Percent!!SEX AND AGE!!Total population!!Under 18 years", 
                "Percent!!SEX AND AGE!!Total population!!21 years and over",
                "Percent!!SEX AND AGE!!Total population!!65 years and over",
                "Estimate!!SEX AND AGE!!Total population!!Sex ratio (males per 100 females)",
                "Estimate!!SEX AND AGE!!Total population!!18 years and over!!Sex ratio (males per 100 females)",
                "Percent!!RACE!!Total population!!One race!!White",
                "Percent!!RACE!!Total population!!One race!!Black or African American",
                "Percent!!RACE!!Total population!!One race!!American Indian and Alaska Native",
                "Percent!!RACE!!Total population!!One race!!Asian",
                "Percent!!RACE!!Total population!!One race!!Asian!!Asian Indian", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Chinese", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Japanese", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Korean", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Vietnamese", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Filipino", 
                "Percent!!RACE!!Total population!!One race!!Native Hawaiian and Other Pacific Islander",
                "Percent!!RACE!!Total population!!One race!!Some other race",
                "Percent!!HISPANIC OR LATINO AND RACE!!Total population!!Hispanic or Latino (of any race)"
   
]

# Apply columns to retain on raw data
filtered_data = raw_data[columns_keep]

# Keep only Zipcode and get rid of Prefixes like'ZCTA5 '
filtered_data["Geographic Area Name"] = filtered_data["Geographic Area Name"].str[-5:]

# Ensure no duplicates of primary key Zip code
print(filtered_data["Geographic Area Name"].nunique()) # All unique Good

# Rename Columns
renamed_columns = {
                "Geographic Area Name" : "zipcode", 
                "Estimate!!SEX AND AGE!!Total population" : "total_population",
                "Estimate!!SEX AND AGE!!Total population!!Median age (years)" : "median_age",
                "Percent!!SEX AND AGE!!Total population!!Under 5 years" : "age_under_5",
                "Percent!!SEX AND AGE!!Total population!!5 to 9 years"  : "age_5_to_9",
                "Percent!!SEX AND AGE!!Total population!!10 to 14 years" : "age_10_to_14",
                "Percent!!SEX AND AGE!!Total population!!15 to 19 years" : "age_15_to_19",
                "Percent!!SEX AND AGE!!Total population!!20 to 24 years" : "age_20_to_24",
                "Percent!!SEX AND AGE!!Total population!!25 to 34 years" : "age_25_to_34",
                "Percent!!SEX AND AGE!!Total population!!35 to 44 years" : "age_35_to_44",
                "Percent!!SEX AND AGE!!Total population!!45 to 54 years" : "age_45_to_54",
                "Percent!!SEX AND AGE!!Total population!!55 to 59 years" : "age_55_to_59",
                "Percent!!SEX AND AGE!!Total population!!60 to 64 years" : "age_60_to_64",
                "Percent!!SEX AND AGE!!Total population!!65 to 74 years" : "age_65_to_74",
                "Percent!!SEX AND AGE!!Total population!!75 to 84 years" : "age_75_to_84",
                "Percent!!SEX AND AGE!!Total population!!85 years and over" : "age_over_85",
                "Percent!!SEX AND AGE!!Total population!!16 years and over" : "age_over_16", 
                "Percent!!SEX AND AGE!!Total population!!18 years and over" : "age_over_18",
                "Percent!!SEX AND AGE!!Total population!!Under 18 years": "age_under_18", 
                "Percent!!SEX AND AGE!!Total population!!21 years and over" : "age_over_21",
                "Percent!!SEX AND AGE!!Total population!!65 years and over" : "age_over_65",
                "Estimate!!SEX AND AGE!!Total population!!Sex ratio (males per 100 females)" : "male_female_sex_ratio",
                "Estimate!!SEX AND AGE!!Total population!!18 years and over!!Sex ratio (males per 100 females)" : "male_female_sex_ratio_over_18", # New add to schema
                "Percent!!RACE!!Total population!!One race!!White" : "race_white",
                "Percent!!RACE!!Total population!!One race!!Black or African American" : "race_black",
                "Percent!!RACE!!Total population!!One race!!American Indian and Alaska Native" : "race_native_american",
                "Percent!!RACE!!Total population!!One race!!Asian" : "race_asian", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Asian Indian" : "race_asian_indian", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Chinese" : "race_asian_chinese", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Japanese" : "race_asian_japanese", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Korean" : "race_asian_korean", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Vietnamese" : "race_asian_vietnamese", 
                "Percent!!RACE!!Total population!!One race!!Asian!!Filipino": "race_asian_filipino", 
                "Percent!!RACE!!Total population!!One race!!Native Hawaiian and Other Pacific Islander" : "race_pacific_islander",
                "Percent!!RACE!!Total population!!One race!!Some other race" : "race_other",
                "Percent!!HISPANIC OR LATINO AND RACE!!Total population!!Hispanic or Latino (of any race)" : "hispanic_any_race"

    }

# Rename Columns
filtered_data = filtered_data.rename(columns=renamed_columns)

# Reduce race categories to either single, or two and more or unknown.
filtered_data["race_total"] = filtered_data["race_white"] + filtered_data["race_black"] + filtered_data["race_native_american"]  + filtered_data["race_asian"] + filtered_data["race_pacific_islander"] + filtered_data["race_other"]
# Calculate new column race_two_or_more_or_unknown and prevent sum of race data not at 100%
filtered_data["race_two_or_more_or_unknown"] = np.round((100.00 - filtered_data["race_total"]), 1)
filtered_data = filtered_data.drop(["race_total"], axis=1)

filtered_data.dtypes
# Ensure all Columns Numeric
filtered_data.iloc[:,1:].apply(pd.to_numeric)

# Check for NULL values
filtered_data.isnull().sum() # 0 Null Values in retained columns all Good
filtered_data.isna().sum() # 0 Null Values in retained columns all Good

# Create CSV of preprocessed data
filtered_data.to_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\DP05ACS DEMOGRAPHIC AND HOUSING ESTIMATES\\2021.DP05_zipcode_age_sex_race_cleaned_data.csv", index = False)

