import { SendNotificationRepository } from '@/application/protocols/db';
import { EmailSender } from '@/application/protocols/messaging';
import { SendNotification } from '@/domain/use-cases';
import { notificationSentCounter, notificationFailedCounter } from '@/infra/observability';

export class DbSendNotification implements SendNotification {
  constructor(
    private readonly repository: SendNotificationRepository,
    private readonly emailSender: EmailSender,
  ) {}

  async send(params: SendNotification.Params): Promise<SendNotification.Result> {
    const log = await this.repository.send(params);

    try {
      await this.emailSender.send({
        to: params.recipient,
        subject: params.subject,
        body: params.body,
      });
      notificationSentCounter.add(1, { type: params.type });
    } catch (error) {
      notificationFailedCounter.add(1, { type: params.type });
      console.error(`[Notification] Failed to send email for WO ${params.workOrderId}:`, error);
    }

    return log;
  }
}
