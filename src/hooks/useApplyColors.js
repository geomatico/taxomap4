import {PHYLUM_LEGEND, BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND} from '../config';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
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

const useApplyColors = field => {
  const palette = getPalette(field);

  return (values) => {
    const outputArray = new Float32Array(values.length * 3);

    for (let i = 0; i < values.length; ++i) {
      const value = values[i];
      const color = palette[value] || [0, 0, 0];
      outputArray[i * 3] = color[0];
      outputArray[i * 3 + 1] = color[1];
      outputArray[i * 3 + 2] = color[2];
    }

    return outputArray;
  };
};

export default useApplyColors;
