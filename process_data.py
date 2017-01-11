import csv
import json

from os import listdir
from os.path import isfile, join

RAW_DATA_DIR = './raw_data'
PROCESSED_DATA_DIR = './data'
YEAR_TO_ANALYZE = ''

# Return streamer.
def convert_file_to_stream(file_loc):
  all_rows = []
  
  try:
    csv_file = open(file_loc)
    return csv.DictReader(csv_file, delimiter=',')
  except:
    return None

def save_data(data):
  with open(PROCESSED_DATA_DIR + '/processed.json', 'wb') as f:
    dict_writer = f.write(json.dumps(data))
    f.close()

def get_files():
  only_files = []
  for f in listdir(RAW_DATA_DIR):
    # Ignore hidden files.
    if isfile(join(RAW_DATA_DIR, f)) and f[0] != '.' and \
       (not YEAR_TO_ANALYZE or f.find(YEAR_TO_ANALYZE) != -1):
      only_files.append(join(RAW_DATA_DIR, f))
  
  return only_files

def group_data_by(reader, keys_to_group_by, measures, rollup_func):

  rollup_dict = {}
  rollup_list = []

  for row in reader:
    hash = '|'.join([row[key] for key in keys_to_group_by])
    if hash not in rollup_dict:
      rollup_dict[hash] = {}

    for measure in measures:

      if measure not in rollup_dict[hash]:
        rollup_dict[hash][measure] = []

      if is_number(row[measure]):
        rollup_dict[hash][measure].append(float(row[measure]))

  for hash, values in rollup_dict.iteritems():
    temp_rollup = {
      'rollup_key': hash
    }
    for key, value in values.iteritems():
      temp_rollup[key] = rollup_func(value)
    rollup_list.append(temp_rollup)

  return rollup_list

def is_number(s):
    try:
        float(s)
        return True
    except:
        return False

def mean(list):
  if len(list) == 0:
    return None
  return sum(list)/len(list)

def main():
  data_files = get_files()
  rollup_data = []

  measures = [
    'DepDelay',
    'ArrDelay',
    'Distance',
    'TaxiOut',
    'Cancelled',
    'Diverted',
    'CarrierDelay',
    'WeatherDelay',
    'NASDelay',
    'SecurityDelay',
    'LateAircraftDelay'
  ]

  for data_file in data_files:
    reader = convert_file_to_stream(data_file)

    if reader is None:
      print 'Error with {}'.format(data_file)
      continue

    print 'Done Getting stream'
    rollup_list = group_data_by(reader, ['Year', 'Month', 'UniqueCarrier'], \
                                measures, mean)
    rollup_data += rollup_list
    print len(rollup_list)
    print 'Done with {}'.format(data_file)

  save_data(rollup_data)


if __name__ == '__main__':
  main()