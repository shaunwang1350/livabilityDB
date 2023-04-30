# -*- coding: utf-8 -*-
"""
Created on Sun Mar 26 17:18:06 2023

@author: Julien Desautels
"""

import pandas as pd
import numpy as np


# Load all datasets
zipcode_base = pd.read_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\zipcode_team\\preprocessed_zipcode.csv",
                           converters={'zipcode': str})
zipcode_base.dtypes


housing_data = pd.read_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\zipcode_team\\preprocessed_housing.csv",
                           converters={'zipcode': str})
housing_data.dtypes


employment_data = pd.read_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\zipcode_team\\Employment_Preprocessing.csv",
                              converters={'zipcode': str})
employment_data.dtypes


economic_data = pd.read_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\zipcode_team\\Economics_Preprocessing.csv",
                             converters={'zipcode': str})
economic_data.dtypes


age_sex_race_data = pd.read_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\zipcode_team\\age_sex_race_data_preprocessed.csv",
                                 converters={'zipcode': str})
age_sex_race_data.dtypes


# Merge datasets one-by-one based on ID zipcode (inner join) starting with geographic data
zipcode_merged = pd.merge(zipcode_base, housing_data, 
                                             how = "inner", left_on = "zipcode", right_on = "zipcode",
                                             validate = "1:1") 

zipcode_merged = pd.merge(zipcode_merged, employment_data, 
                                             how = "inner", left_on = "zipcode", right_on = "zipcode",
                                             validate = "1:1") 


zipcode_merged = pd.merge(zipcode_merged, economic_data, 
                                             how = "inner", left_on = "zipcode", right_on = "zipcode",
                                             validate = "1:1") 


zipcode_merged = pd.merge(zipcode_merged, age_sex_race_data, 
                                             how = "inner", left_on = "zipcode", right_on = "zipcode",
                                             validate = "1:1") 

# Produce combined file that represents the large Zipcode table and entity 
zipcode_merged.to_csv("C:\\Users\\Z97M\\Documents\\CIS 550 Project Datasets\\zipcode_team\\zipcode_data_merged.csv", index = False)

