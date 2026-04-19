import { DomainEvent, WorkOrderEventData, PaymentEventData, ExecutionEventData } from '@/domain/events';
import { NotificationType } from '@/domain/entities';
import { SendNotification } from '@/domain/use-cases';
import { logger } from '@/infra/observability';

const EVENT_TO_NOTIFICATION: Partial<Record<string, { type: NotificationType; subject: string; bodyFn: (data: any) => string }>> = {
  WorkOrderApproved: {
    type: 'WORK_ORDER_APPROVED',
    subject: 'Work Order Approved',
    bodyFn: (d: WorkOrderEventData) => `Your work order ${d.workOrderId} has been approved with a budget of $${d.budget ?? 0}. Payment is required to proceed.`,
  },
  PaymentCompleted: {
    type: 'PAYMENT_COMPLETED',
    subject: 'Payment Confirmed',
    bodyFn: (d: PaymentEventData) => `Payment of $${d.amount} for work order ${d.workOrderId} has been confirmed. Execution will begin shortly.`,
  },
  PaymentFailed: {
    type: 'PAYMENT_FAILED',
    subject: 'Payment Failed',
    bodyFn: (d: PaymentEventData) => `Payment for work order ${d.workOrderId} has failed. Reason: ${d.failureReason ?? 'Unknown'}. Please try again.`,
  },
  ExecutionCompleted: {
    type: 'EXECUTION_COMPLETED',
    subject: 'Service Execution Completed',
    bodyFn: (d: ExecutionEventData) => `All services for work order ${d.workOrderId} have been completed. Your vehicle is ready for pickup.`,
  },
  ExecutionFailed: {
    type: 'EXECUTION_FAILED',
    subject: 'Service Execution Issue',
    bodyFn: (d: ExecutionEventData) => `An issue occurred during execution of work order ${d.workOrderId}. Reason: ${d.failureReason ?? 'Unknown'}. We will contact you shortly.`,
  },
  WorkOrderCanceled: {
    type: 'WORK_ORDER_CANCELED',
    subject: 'Work Order Canceled',
    bodyFn: (d: WorkOrderEventData) => `Your work order ${d.workOrderId} has been canceled.`,
  },
  RefundCompleted: {
    type: 'REFUND_COMPLETED',
    subject: 'Refund Processed',
    bodyFn: (d: PaymentEventData) => `A refund of $${d.amount} for work order ${d.workOrderId} has been processed.`,
  },
};

export class NotificationEventHandler {
  constructor(private readonly sendNotification: SendNotification) {}

  async handle(event: DomainEvent): Promise<void> {
    const config = EVENT_TO_NOTIFICATION[event.eventType];
    if (!config) {
      logger.info({ eventType: event.eventType }, 'No notification configured for event');
      return;
    }

    const recipient = event.data.customerEmail;
    if (!recipient) {
      logger.info({ eventType: event.eventType, workOrderId: event.data.workOrderId }, 'No customerEmail in event, skipping notification');
      return;
    }

    logger.info({ type: config.type, recipient, workOrderId: event.data.workOrderId }, 'Sending notification');

    await this.sendNotification.send({
      workOrderId: event.data.workOrderId,
      customerId: event.data.customerId ?? 'unknown',
      type: config.type,
      recipient,
      subject: config.subject,
      body: config.bodyFn(event.data),
    });
  }
}
