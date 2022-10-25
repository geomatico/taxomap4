import {PHYLUM_LEGEND, BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND} from '../config';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

const getPalette = field => {
  switch (field) {
  case 'phylum':
    return PHYLUM_LEGEND.reduce((acc, {color, values}) => {
      values.map(value => acc[value] = color);
      return acc;
    }, []).map(hexToRgb);
  case 'basisofrecord':
    return BASIS_OF_RECORD_LEGEND.reduce((acc, {id, color}) => {
      acc[id] = color;
      return acc;
    }, []).map(hexToRgb);
  case 'institutioncode':
    return INSTITUTION_LEGEND.reduce((acc, {id, color}) => {
      acc[id] = color;
      return acc;
    }, []).map(hexToRgb);
  }
};

const useApplyColor = field => {
  const palette = getPalette(field);
  return (value, target) => {
    const color = palette[value] || [0, 0, 0];
    target[0] = color[0];
    target[1] = color[1];
    target[2] = color[2];
    target[3] = 255;
    return target;
  };
};

export default useApplyColor;
