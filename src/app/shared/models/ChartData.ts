export interface Chart {
  caption?: string;
  subCaption?: string;
  showValues?: string;
  showPercentInTooltip?: string;
  showPercentValues?: string;
  numberPrefix?: string;
  enableMultiSlicing?: string;
  theme?: string;
  defaultcenterlabel?: string;
}

export interface Datum {
  label: string;
  value: string;
}

export class ChartData {
  chart: any;
  data: Datum[];
  constructor(chart: any, data: Datum[]) {
    this.chart = chart;
    this.data = data;
  }
}
