"""
  Clean titanic data.
"""
import csv
import json

from os import listdir
from os.path import isfile, join

RAW_FILE = './raw_data/titanic_data.csv'
PROCESSED_FILE = './data/titanic_data.csv'
    
def clean_data(data):
  header_key_to_index = {}

  for i, row in enumerate(data):
    if i == 0:
      header_key_to_index = {k: v for v, k in enumerate(row)}
    else:
      map_age_to_bucket(row, header_key_to_index)
      map_ticket_fare_to_bucket(row, header_key_to_index)
      map_embarkment(row, header_key_to_index)
      map_pclass(row, header_key_to_index)

  return data

def map_age_to_bucket(row, header_key_to_index):
  try:
    age = int(row[header_key_to_index['Age']])
    
    if age < 18:
      age = '< 18'
    elif age <= 25:
      age = '18 - 25'
    elif age <= 35:
      age =  '26 - 35'
    elif age <= 45:
      age = '36 - 45'
    elif age <= 55:
      age = '46 - 55'
    else:
      age = '> 55'

    row[header_key_to_index['Age']] = age
  except: 
    row[header_key_to_index['Age']] = None

def map_ticket_fare_to_bucket(row, header_key_to_index):
  try:
    fare = float(row[header_key_to_index['Fare']])
    nearest_10th = round(fare) - (round(fare)%10)
    row[header_key_to_index['Fare']] = '{} - {}'\
                                        .format(int(nearest_10th), 
                                                int(nearest_10th) + 10)
  except: 
    row[header_key_to_index['Fare']] = None

def map_embarkment(row, header_key_to_index):
  embarkment = row[header_key_to_index['Embarked']]

  if embarkment == 'C':
    embarkment = 'Cherbourg' 
  elif embarkment == 'Q':
    embarkment = 'Queenstown'
  elif embarkment == 'S':
    embarkment = 'Southampton'
  else:
    embarkment = None
  
  row[header_key_to_index['Embarked']] = embarkment

def map_pclass(row, header_key_to_index):
  pclass = row[header_key_to_index['Pclass']]

  if pclass == '1':
    pclass = 'Upper' 
  elif pclass == '2':
    pclass = 'Middle'
  elif pclass == '3':
    pclass = 'Lower'
  else:
    pclass = None
  
  row[header_key_to_index['Pclass']] = pclass

def save_data(data, loc):
  with open(loc, 'wb') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"')

    for row in data:
      writer.writerow(row)

def get_data(loc):
  data = []

  with open(loc, 'rb') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    data = [row for row in reader]

  return data

def main():
  data = get_data(RAW_FILE)
  
  if len(data) == 0:
    print 'Error with {}'.format(RAW_FILE)

  data = clean_data(data)
  save_data(data, PROCESSED_FILE)


if __name__ == '__main__':
  main()