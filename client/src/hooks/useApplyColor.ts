import {HEXColor, Legend, RGBAArrayColor, RGBArrayColor, SymbolizeBy} from '../commonTypes';
import {Legends} from '../domain/usecases/getLegends';

function hexToRgb(hex: HEXColor): RGBArrayColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

const otherPhylumColor = (legend: Legend) => hexToRgb(legend.find(({id}) => id === 0)?.color || '#000000');

const getPalette = (legends: Legends, field: SymbolizeBy) => {
  switch (field) {
  case SymbolizeBy.phylum:
    return legends.phylumLegend.reduce((acc, {id, color}) => {
      acc[id] = hexToRgb(color);
      return acc;
    }, {} as Record<number, RGBArrayColor>);
  case SymbolizeBy.basisofrecord:
    return legends.basisOfRecordLegend.reduce((acc, {id, color}) => {
      acc[id] = hexToRgb(color);
      return acc;
    }, {} as Record<number, RGBArrayColor>);
  case SymbolizeBy.institutioncode:
    return legends.institutionlegend.reduce((acc, {id, color}) => {
      acc[id] = hexToRgb(color);
      return acc;
    }, {} as Record<number, RGBArrayColor>);
  }
};

const useApplyColor = (legends: Legends, field: SymbolizeBy) => {
  const palette = getPalette(legends, field);
  return (value: number, target: RGBAArrayColor) => {
    const color: RGBArrayColor = palette && palette[value] || (field === SymbolizeBy.phylum ? otherPhylumColor(legends.phylumLegend) : [0, 0, 0]);
    target[0] = color[0];
    target[1] = color[1];
    target[2] = color[2];
    target[3] = color === undefined ? 0 : 255;
    return target;
  };
};

export default useApplyColor;
