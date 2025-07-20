declare module 'react-plotly.js' {
  import Plotly from 'plotly.js-dist';
  import { Component } from 'react';

  interface PlotParams {
    data: Partial<Plotly.PlotData>[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    onInitialized?: (figure: Readonly<Plotly.Figure>, graphDiv: HTMLDivElement) => void;
    onUpdate?: (figure: Readonly<Plotly.Figure>, graphDiv: HTMLDivElement) => void;
    onPurge?: (graphDiv: HTMLDivElement) => void;
    onError?: (err: Error) => void;
    debug?: boolean;
  }

  export default class Plot extends Component<PlotParams> {}
}
