import { GetAllServiceMetrics } from '@/domain/use-cases';
import { ok, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

export class GetAllServiceMetricsController implements Controller {
  constructor(private readonly getAllMetrics: GetAllServiceMetrics) {}

  async handle(): Promise<Response> {
    try {
      const metrics = await this.getAllMetrics.getAll();
      return ok(metrics);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

type Response = HttpResponse<GetAllServiceMetrics.Result>;
