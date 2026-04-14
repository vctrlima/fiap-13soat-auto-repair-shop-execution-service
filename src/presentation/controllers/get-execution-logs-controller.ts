import { GetExecutionLogsByWorkOrderId } from '@/domain/use-cases';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class GetExecutionLogsController implements Controller {
  constructor(private readonly getExecutionLogs: GetExecutionLogsByWorkOrderId) {}

  async handle(params: Request): Promise<Response> {
    try {
      const workOrderId = params.params?.workOrderId;
      if (!workOrderId) return badRequest(new MissingParamError('workOrderId'));
      const logs = await this.getExecutionLogs.getByWorkOrderId({ workOrderId });
      return ok(logs);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

type Request = HttpRequest;
type Response = HttpResponse<GetExecutionLogsByWorkOrderId.Result>;
