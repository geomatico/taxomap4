import React, {FC} from 'react';
import {VegaLite, VisualizationSpec} from 'react-vega';
import {HEXColor} from '../commonTypes';

type ChartItem = {
  color: HEXColor,
  label: string,
  id: number,
  percentage: number,
}

export type ChartData = Array<ChartItem>

export interface PieChartProps {
  data: ChartData
}

const PieChart: FC<PieChartProps> = ({data}) => {

  const specArc: VisualizationSpec = {
    '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
    'width': 180,
    'height': 180,
    'autosize': 'pad',
    'signals': [
      {
        'name': 'startAngle',
        'value': 0
      },
      {
        'name': 'endAngle',
        'value': 6.29,
      },
      {
        'name': 'padAngle',
        'value': 0
      },
      {
        'name': 'sort',
        'value': true
      },
      {
        'name': 'strokeWidth',
        'value': 2
      },
      {
        'name': 'selected',
        'value': '',
        'on': [{
          'events': 'mouseover',
          'update': 'datum'
        }]
      }
    ],
    'data': [
      {
        'name': 'table',
        'values': data,
        'transform': [
          {
            'type': 'pie',
            'field': 'percentage',
            'startAngle': {'signal': 'startAngle'},
            'endAngle': {'signal': 'endAngle'},
            'sort': {'signal': 'sort'}
          }
        ]
      },
    ],

    'scales': [
      {
        'name': 'color',
        'type': 'ordinal',
        'range': {'scheme': 'category20'}
      }
    ],
    'marks': [
      {
        'type': 'arc',
        'from': {'data': 'table'},
        'encode': {
          'enter': {
            'tooltip': {'signal': 'format(datum["percentage"]/100, ".0%")'}, // tooltip de porcentajes
            'fill': {
              'field': 'color' // le meto el color de los datos
            },
            'x': {'signal': 'width / 2'},
            'y': {'signal': 'height / 2'}
          },
          'update': {
            'startAngle': {'field': 'startAngle'},
            'endAngle': {'field': 'endAngle'},
            'padAngle': {
              'signal': 'if(selected && selected.label == datum.label, 0.015, 0.015)'
            },
            'innerRadius': {
              'signal': 'if(selected && selected.label == datum.label, if(width >= height, height, width) / 2 * 0.45, if(width >= height, height, width) / 2 * 0.5)'
            },
            'outerRadius': {
              'signal': 'if(selected && selected.label == datum.label, if(width >= height, height, width) / 2 * 1.05 * 0.8, if(width >= height, height, width) / 2 * 0.8)'
            },
            'opacity': {
              'signal': 'if(selected && selected.label !== datum.label, 1, 1)'
            },
            'stroke': {
              'signal': 'datum.color' // color de borde
            },
            'strokeWidth': {'signal': 'strokeWidth'},
            'fillOpacity': {
              'signal': 'if(selected && selected.label == datum.label, 0.8, 0.8)' // aqui se modifica la opacidad
            }
          }
        }
      },
      {
        'type': 'text',
        'encode': {
          'enter': {
            'fill': {'value': '#525252'},
            'text': {'value': ''}
          },
          'update': {
            'opacity': {'value': 1},
            'x': {'signal': 'width / 2'},
            'y': {'signal': 'height / 2'},
            'align': {'value': 'center'},
            'baseline': {'value': 'middle'},
            'fontSize': {'signal': 'if(width >= height, height, width) * 0.05'},
            'text': {'value': ''} //aqui podemos meter string en el centro del donut
          }
        }
      },
      {
        'name': 'mark_percentage',
        'type': 'text',
        'from': {'data': 'table'},
        'encode': {
          'enter': {
            'text': {
              'signal': 'if(datum["endAngle"] - datum["startAngle"] < 0.3, "", format(datum["percentage"]/100, ".0%"))'
            },
            'x': {'signal': 'if(width >= height, height, width) / 2'},
            'y': {'signal': 'if(width >= height, height, width) / 2'},
            'radius': {
              'signal': 'if(selected && selected.label == datum.label, if(width >= height, height, width) / 2 * 1.05 * 0.65, if(width >= height, height, width) / 2 * 0.65)'
            },
            'theta': {'signal': '(datum["startAngle"] + datum["endAngle"])/2'},
            'fill': {'value': '#FFFFFF'},
            'fontSize': {'value': 12},
            'align': {'value': 'center'},
            'baseline': {'value': 'middle'}
          }
        }
      }
    ]
  };

  return <VegaLite spec={specArc} actions={false}/>;
};

export default PieChart;