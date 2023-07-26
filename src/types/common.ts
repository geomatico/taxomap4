export type MapStyle = {
  id: string,
  label: string,
  thumbnail: string
}

export type Viewport = {
  latitude: number,
  longitude: number,
  zoom: number,
  bearing: number,
  pitch: number
}

export enum TaxonomicLevel {
  domain = 'domain',
  kingdom = 'kingdom',
  phylum = 'phylum',
  class = 'class',
  order = 'order',
  family = 'family',
  genus = 'genus',
  species = 'species',
  subspecies = 'subspecies'
}

export type TaxonId = number;

export type Taxon = {
  level: TaxonomicLevel,
  id: TaxonId
};

export type FilterId = number;

export enum FilterBy {
  basisofrecord = 'basisofrecord',
  institutioncode = 'institutioncode',
  year = 'year'
}

export type TaxomapData = {
  length: number,
  attributes: {
    getPosition: {
      value: Float64Array,
      size: 2
    }
  },
  id: Array<string>
} & {
  [key in TaxonomicLevel]: Int32Array
} & {
  [key in FilterBy]: Int32Array
}

export type ChildCount = {
  id: TaxonId,
  kingdom_id: TaxonId,
  name: string,
  count: number
};

export type ChildrenVisibility = Record<TaxonId, boolean>;

export type YearRange = [number, number];

export type BBOX = [number, number, number, number];

export type DictionaryEntry = {
  id: FilterId | TaxonId,
  name: string
}

export type Dictionary = Array<DictionaryEntry>;

export type Dictionaries = {
  [key in TaxonomicLevel]: Dictionary
} & {
  [FilterBy.institutioncode]: Dictionary,
  [FilterBy.basisofrecord]: Dictionary
}
