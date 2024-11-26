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

export enum SymbolizeBy {
  phylum = 'phylum',
  basisofrecord = 'basisofrecord',
  institutioncode = 'institutioncode'
}

export type GroupBy = FilterBy | SymbolizeBy;

export type HEXColor = `#${string}`;
export type RGBArrayColor = [number, number, number];
export type RGBAArrayColor = [number, number, number, number];

export type LegendItem = {
  id: number,
  labelKey: string,
  color: HEXColor
};

export type Legend = Array<LegendItem>;

export type TaxomapData = {
  length: number,
  attributes: {
    getPosition: {
      value: Float64Array,
      size: 2
    }
  },
  id: Int32Array,
  catalognumber: Array<string>
} & {
  [key in TaxonomicLevel]: Int32Array
} & {
  [key in FilterBy]: Int32Array
}

export type ChildCount = {
  id: TaxonId,
  name: string,
  count: number
};

export type SubtaxonVisibility = {
  subtaxonLevel: TaxonomicLevel,
  isVisible: Record<TaxonId, boolean>
};

/**
 * Min/max are inclusive
 */
export type Range = [number, number];

/**
 * CRS is EPSG:4326. [west, south, east, north] or [x0, y0, x1, y1].
 */
export type BBOX = [number, number, number, number];

export type DictionaryEntry = {
  id: FilterId | TaxonId,
  name: string,
  domain_id?: number,
  kingdom_id?: number,
  phylum_id?: number,
  class_id?: number,
  order_id?: number,
  family_id?: number,
  genus_id?: number,
  species_id?: number,
  subspecies_id?: number
}

export type Dictionary = Array<DictionaryEntry>;

export type Dictionaries = {
  [key in TaxonomicLevel]: Dictionary
} & {
  [FilterBy.institutioncode]: Dictionary,
  [FilterBy.basisofrecord]: Dictionary
}

export type SubtaxonCount = Record<TaxonId, number>;

export type Filters = {
  taxon: Taxon,
  // undefined means no filter (the only way to access features with null year).
  yearRange?: Range,
  // See `static/dictionaries/institutioncode.json`.
  institutionId?: number,
  // See `static/dictionaries/basisofrecord.json`.
  basisOfRecordId?: number,
  subtaxonVisibility?: SubtaxonVisibility,
  bbox?: BBOX
}

export enum MapType {
  discreteData = 'discreteData',
  heatMap = 'heatMap',
  aggregateData = 'aggregateData'
}