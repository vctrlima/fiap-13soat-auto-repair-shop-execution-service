import { GetNotificationsByWorkOrderId } from '@/domain/use-cases';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class GetNotificationsController implements Controller {
  constructor(private readonly getNotifications: GetNotificationsByWorkOrderId) {}

  async handle(params: Request): Promise<Response> {
    try {
      const workOrderId = params.params?.workOrderId;
      if (!workOrderId) return badRequest(new MissingParamError('workOrderId'));
      const notifications = await this.getNotifications.getByWorkOrderId({ workOrderId });
      return ok(notifications);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

type Request = HttpRequest;
type Response = HttpResponse<GetNotificationsByWorkOrderId.Result>;
