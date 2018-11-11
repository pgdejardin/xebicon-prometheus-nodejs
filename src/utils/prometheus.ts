import {
  collectDefaultMetrics,
  Counter,
  CounterConfiguration, Gauge, GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  register,
  Registry, Summary, SummaryConfiguration,
} from 'prom-client';

class PrometheusClient {

  private namespace: string = '';
  private readonly metricsInterval: number;
  private readonly registry: Registry;

  constructor(namespace: string, registry: Registry = new Registry()) {
    this.namespace = namespace;
    this.registry = registry;
    this.metricsInterval = collectDefaultMetrics({ register: this.registry });
  }

  /**
   * Return the id of the metrics interval (useful to clearInterval)
   * @returns metricsInterval {number}
   */
  public getMetricsInterval() {
    return this.metricsInterval;
  }

  /**
   * apply labels to every metric emitted by a registry
   * @param labels
   */
  public setDefaultLabels(labels: object) {
    this.registry.setDefaultLabels(labels)
  }

  /**
   * Pipe function to add the namespace
   * @param ns {string}
   */
  public withNamespace(ns: string) {
    this.namespace = ns;
    return this;
  }

  /**
   * Sets a namespace for all the metrics created after its call
   * @param ns {string}
   */
  public setNamespace(ns: string) {
    this.namespace = ns;
  }

  /**
   * What to expose in /metrics in your server
   * @returns metrics {string}
   */
  public getMetrics(): string {
    const mergedRegistries = Registry.merge([this.registry, register]);
    return mergedRegistries.metrics();
  }

  /**
   * Create an Histogram and set the registry
   * @param config
   * @returns {Histogram}
   */
  public createHistogram(config: HistogramConfiguration): Histogram {
    const histogramConfig: HistogramConfiguration = {
      ...config,
      registers: [this.registry],
    };
    return new Histogram(histogramConfig);
  }

  /**
   * Create a Counter and set the registry
   * @param {CounterConfiguration} config
   * @returns {Counter}
   */
  public createCounter(config: CounterConfiguration): Counter {
    const counterConfig: CounterConfiguration = {
      ...config,
      registers: [this.registry],
    };
    return new Counter(counterConfig);
  }

  /**
   * Create a Gauge and set the registry
   * @param {GaugeConfiguration} config
   * @returns {Gauge}
   */
  public createGauge(config: GaugeConfiguration): Gauge {
    const gaugeConfig: GaugeConfiguration = {
      ...config,
      registers: [this.registry],
    };
    return new Gauge(gaugeConfig);
  }

  /**
   * Create a Summary and set the registry
   * @param {SummaryConfiguration} config
   * @returns {Summary}
   */
  public createSummary(config: SummaryConfiguration): Summary {
    const summaryConfig: SummaryConfiguration = {
      ...config,
      registers: [this.registry],
    };
    return new Summary(summaryConfig);
  }
}

export default PrometheusClient;
