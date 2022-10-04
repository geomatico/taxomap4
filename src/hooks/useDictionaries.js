import {useEffect, useState} from 'react';

const fields = [
  'basisofrecord', 'institutioncode',
  'domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'subspecies' // The 9 levels of taxonomic tree
];

const emptyDicts = fields.reduce((acc, field) => ({...acc, [field]: []}), {}); // An empty array for each field

const useDictionaries = () => {
  const [dictionaries, setDictionaries] = useState(emptyDicts);
  useEffect(() => {
    const promises = fields.map(field => fetch(`data/dictionaries/${field}.json`).then(response => response.json()));
    Promise.all(promises).then(responses => {
      const fullDicts = responses.reduce((acc, response, i) => {
        acc[fields[i]] = response;
        return acc;
      }, {});
      setDictionaries(fullDicts);
    });
  }, []);
  return dictionaries;
};

export default useDictionaries;
