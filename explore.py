import collections
import json

PROCESSED_DATA = './data/processed.json'

# Return streamer.
def read_data():
  data = []

  with open(PROCESSED_DATA) as data_file:    
    data = json.load(data_file)
  
  return data

def main():
  data = read_data()
  sorte = {}
  key = 'Cancelled'
  for datum in data:
    year = datum['rollup_key'][0:4]
    if year not in sorte:
      sorte[year] = []

    try:
        float(datum[key])
        sorte[year].append(datum[key])
    except:
        continue

  sorte = collections.OrderedDict(sorted(sorte.items()))

  for year, values in sorte.iteritems():
    if len(values) > 0:
      print year
      print sum(values)/len(values)

if __name__ == '__main__':
  main()