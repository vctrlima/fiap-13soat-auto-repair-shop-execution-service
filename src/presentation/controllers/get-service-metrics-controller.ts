import { GetServiceMetrics } from '@/domain/use-cases';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class GetServiceMetricsController implements Controller {
  constructor(private readonly getMetrics: GetServiceMetrics) {}

  async handle(params: Request): Promise<Response> {
    try {
      const serviceId = params.params?.serviceId;
      if (!serviceId) return badRequest(new MissingParamError('serviceId'));
      const metrics = await this.getMetrics.getMetrics({ serviceId });
      if (!metrics) return notFound(new Error(`Metrics for service ${serviceId} not found`));
      return ok(metrics);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

type Request = HttpRequest;
type Response = HttpResponse<GetServiceMetrics.Result>;
