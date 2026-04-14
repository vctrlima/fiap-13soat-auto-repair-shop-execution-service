import { GetServiceMetrics, GetAllServiceMetrics } from '@/domain/use-cases';

export interface GetServiceMetricsRepository {
  getMetrics(params: GetServiceMetricsRepository.Params): Promise<GetServiceMetricsRepository.Result>;
}
export namespace GetServiceMetricsRepository {
  export type Params = GetServiceMetrics.Params;
  export type Result = GetServiceMetrics.Result;
}

export interface GetAllServiceMetricsRepository {
  getAll(): Promise<GetAllServiceMetricsRepository.Result>;
}
export namespace GetAllServiceMetricsRepository {
  export type Result = GetAllServiceMetrics.Result;
}
