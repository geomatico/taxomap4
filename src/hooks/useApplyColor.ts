import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND, PHYLUM_LEGEND} from '../config';
import {HEXColor, RGBAArrayColor, RGBArrayColor, SymbolizeBy} from '../commonTypes';

function hexToRgb(hex: HEXColor): RGBArrayColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

const getPalette = (field: SymbolizeBy) => {
  switch (field) {
  case SymbolizeBy.phylum:
    return PHYLUM_LEGEND.reduce((acc, {color, values}) => {
      values?.map(value => acc[value] = color);
      return acc;
    }, [] as Array<HEXColor>).map(hexToRgb);
  case SymbolizeBy.basisofrecord:
    return BASIS_OF_RECORD_LEGEND.reduce((acc, {id, color}) => {
      acc[id] = color;
      return acc;
    }, [] as Array<HEXColor>).map(hexToRgb);
  case SymbolizeBy.institutioncode:
    return INSTITUTION_LEGEND.reduce((acc, {id, color}) => {
      acc[id] = color;
      return acc;
    }, [] as Array<HEXColor>).map(hexToRgb);
  }
};

const useApplyColor = (field: SymbolizeBy) => {
  const palette = getPalette(field);
  return (value: number, target: RGBAArrayColor) => {
    const color: RGBArrayColor = palette[value] || [0, 0, 0];
    target[0] = color[0];
    target[1] = color[1];
    target[2] = color[2];
    target[3] = 255;
    return target;
  };
};

export default useApplyColor;
