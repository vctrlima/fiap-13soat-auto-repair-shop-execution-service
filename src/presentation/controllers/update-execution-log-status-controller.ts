import { UpdateExecutionLogStatus } from '@/domain/use-cases';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class UpdateExecutionLogStatusController implements Controller {
  constructor(private readonly updateStatus: UpdateExecutionLogStatus) {}

  async handle(params: Request): Promise<Response> {
    try {
      const id = params.params?.id;
      if (!id) return badRequest(new MissingParamError('id'));
      const { status, failureReason } = params.body ?? {};
      if (!status) return badRequest(new MissingParamError('status'));
      const log = await this.updateStatus.updateStatus({ id, status, failureReason });
      return ok(log);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

type Request = HttpRequest;
type Response = HttpResponse<UpdateExecutionLogStatus.Result>;
