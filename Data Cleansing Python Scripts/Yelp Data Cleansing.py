# -*- coding: utf-8 -*-
"""
Created on Wed Feb  8 18:19:50 2023

@author: Julien Desautels
"""

# Python Script Yelp Data

import pandas as pd
import json
import numpy as np


# Replace path
business_json_path = "C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\Yelp Businesses.json"
original_data = pd.read_json(business_json_path, lines=True)

cleaned_data = pd.read_json(business_json_path, lines=True)

# 1 = open, 0 = closed
cleaned_data = cleaned_data[cleaned_data['is_open']==1]

# Drop any irrelevant columns (Must keep business_id to merge with reviews if review data used)
drop_columns = ['hours','is_open'] # 'review_count'
cleaned_data = cleaned_data.drop(drop_columns, axis=1)

cleaned_data = cleaned_data [~(cleaned_data ['postal_code'].str.len() > 5)]

cleaned_data = cleaned_data [(cleaned_data['postal_code'].values != '')]

cleaned_data = cleaned_data [~(cleaned_data ['postal_code'].str.len() < 5)]

# Null Values or Empty String Counts
cleaned_data.isnull().sum()
(cleaned_data['business_id'].values ==  '').sum()  
(cleaned_data['name'].values == '').sum()  
(cleaned_data['address'].values == '').sum() # 4643 Empty
(cleaned_data['address'].values == '').sum()
(cleaned_data['city'].values == '').sum()  
(cleaned_data['state'].values == '').sum()  
(cleaned_data['postal_code'].values == '').sum() # 40 Empty
(cleaned_data['attributes'].values == '').sum()    
(cleaned_data['categories'].values == '').sum()  

renamed_columns_yelp = {
                "business_id" : "id",
                "stars" : "review_stars",
                "postal_code" : "zipcode",            
}

cleaned_data_yelp = cleaned_data.rename(columns=renamed_columns_yelp)

keep_columns_yelp = ["id", "name", "zipcode", "address", "review_stars", "review_count"]

cleaned_data_yelp  = cleaned_data_yelp[keep_columns_yelp]

cleaned_data_yelp.dtypes

cleaned_data_yelp.to_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\DP05ACS DEMOGRAPHIC AND HOUSING ESTIMATES\\businesses_yelp_data_2021_preprocessed.csv", index = False)

# Spot check: Make sure the business ids are unique
len(cleaned_data_yelp["id"].unique())



# We can use the explode function in pandas v0.25 to split the categories into a row per each business and associated category
businesses_with_categories = cleaned_data.assign(categories = cleaned_data.categories.str.split(', ')).explode('categories')

# Unique Business Category Name List for Category Table
business_categories = pd.DataFrame({"category_name": businesses_with_categories.iloc[:, 11].unique()}).sort_values(by = "category_name")

# Auto-generated "index" PK for each unique Category Name
index_business_categories = np.arange(0, len(business_categories))
# Associate Index to Business Category Name in Category table
business_categories['category_id'] = index_business_categories

# Business_Category table
business_categories = business_categories.iloc[:,[1,0]] # reorder columns
business_categories.to_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\DP05ACS DEMOGRAPHIC AND HOUSING ESTIMATES\\business_category_yelp_2021_preprocessed.csv", index = False)


# Attach category_id primary key to businesses_with_categories for Business_Category table
businesses_with_categories_and_ID = pd.merge(businesses_with_categories, business_categories, 
                                             how = "inner", left_on = "categories", right_on = "category_name",
                                             validate = "m:1") # sort = False not working...

# Afterwards we drop whichever columns in businesses_with_categories_and_ID we no longer need, including Category Name
# Columns for Business_Category table
keep_columns_bus_category_yelp = ["business_id", "category_id"]

# Business _Category Table
businesses_with_categories_and_ID  = businesses_with_categories_and_ID[keep_columns_bus_category_yelp]
businesses_with_categories_and_ID.to_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\DP05ACS DEMOGRAPHIC AND HOUSING ESTIMATES\\businesses_with_categories_yelp_2021_preprocessed.csv", index = False)










# Business category Summary Statistics
summary_stats_categories = businesses_with_categories.iloc[:, 11].describe() # Restaurants most common

# Count of individual distinct business categories
print('Total Number of Categories: ', len(businesses_with_categories.categories.value_counts())) # 1302

# Individual distinct categories and their counts
businesses_categories_count = businesses_with_categories.categories.value_counts()

# Top 10 Categories
top10_categories_count = businesses_with_categories.categories.value_counts()[:10]


# Examples of stats using Specific Business Categories
# Quickly count specific businesses with Vietnamese categories
businesses_with_categories[businesses_with_categories.categories.str.contains('Vietnamese', case=False,na=False)].categories.value_counts() # 517

# For this example, we are only interested in businesses that have Vietnamese or Restaurant as categories
business_viet_rest = businesses_with_categories[businesses_with_categories['categories'].str.contains('Restaurants|Vietnamese',case=False, na=False)]          
business_viet_rest.iloc[:,0].unique().size # 34 987 unique restaurants out of 35 556 total



# Summary Stats - Numeric
summary_all_numeric = cleaned_data.describe()
# Summary Stats - String
summary_all_string = cleaned_data.iloc[:,:6].describe(include=['object'])
# Summary Stats - Combined
summary_all = cleaned_data.iloc[:,:10].describe(include='all')
# Datatypes
column_types = cleaned_data.dtypes
# Null Values
nan_count = cleaned_data.isna().sum()
# Get Top Address that's besides empty String
cleaned_data[cleaned_data['address'] != ''].loc[:,['address']].describe()






(businesses_with_categories['categories'].values == '').sum()  
businesses_with_categories

#.str.contains('|'.join(['Restaurants', 'Vietnamese']))]
#.pivot
#.melt() .explode





