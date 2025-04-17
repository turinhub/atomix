declare module 'kepler.gl' {
  import { Component } from 'react';
  
  export default class KeplerGl extends Component<any> {
    static reducers: {
      keplerGlReducer: (state: any, action: any) => any;
    };
  }
}

declare module 'kepler.gl/actions' {
  export function addDataToMap(data: any): any;
}

declare module 'kepler.gl/processors' {
  export function processCsvData(data: any): any;
  export function processGeojson(data: any): any;
} 