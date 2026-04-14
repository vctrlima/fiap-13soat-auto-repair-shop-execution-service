import { ServiceMetrics } from '@/domain/entities';

export interface GetServiceMetrics {
  getMetrics(params: GetServiceMetrics.Params): Promise<GetServiceMetrics.Result>;
}

export namespace GetServiceMetrics {
  export type Params = { serviceId: string };
  export type Result = ServiceMetrics | null;
}

export interface GetAllServiceMetrics {
  getAll(): Promise<GetAllServiceMetrics.Result>;
}

export namespace GetAllServiceMetrics {
  export type Result = ServiceMetrics[];
}
