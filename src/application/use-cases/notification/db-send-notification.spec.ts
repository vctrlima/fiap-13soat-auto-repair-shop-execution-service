jest.mock('@/infra/observability', () => ({
  notificationSentCounter: { add: jest.fn() },
  notificationFailedCounter: { add: jest.fn() },
}));

import { DbSendNotification } from '@/application/use-cases/db-send-notification';
import { SendNotificationRepository } from '@/application/protocols/db';
import { EmailSender } from '@/application/protocols/messaging';

const makeRepository = (): SendNotificationRepository => ({ send: jest.fn() });
const makeEmailSender = (): EmailSender => ({ send: jest.fn() });
const makeSut = () => {
  const repository = makeRepository();
  const emailSender = makeEmailSender();
  const sut = new DbSendNotification(repository, emailSender);
  return { sut, repository, emailSender };
};

describe('DbSendNotification', () => {
  const params = { workOrderId: 'wo-1', customerId: 'c-1', type: 'PAYMENT_COMPLETED' as any, recipient: 'j@e.com', subject: 'Payment Confirmed', body: 'Your payment was confirmed.' };
  const mockResult = { id: 'n-1', ...params, channel: 'EMAIL', status: 'SENT', createdAt: new Date() };

  beforeEach(() => jest.clearAllMocks());

  it('should call repository and email sender', async () => {
    const { sut, repository, emailSender } = makeSut();
    (repository.send as jest.Mock).mockResolvedValue(mockResult);
    (emailSender.send as jest.Mock).mockResolvedValue(undefined);
    await sut.send(params);
    expect(repository.send).toHaveBeenCalledWith(params);
    expect(emailSender.send).toHaveBeenCalled();
  });

  it('should increment sentCounter on success', async () => {
    const { sut, repository, emailSender } = makeSut();
    const { notificationSentCounter } = require('@/infra/observability');
    (repository.send as jest.Mock).mockResolvedValue(mockResult);
    (emailSender.send as jest.Mock).mockResolvedValue(undefined);
    await sut.send(params);
    expect(notificationSentCounter.add).toHaveBeenCalled();
  });

  it('should increment failedCounter on email failure', async () => {
    const { sut, repository, emailSender } = makeSut();
    const { notificationFailedCounter } = require('@/infra/observability');
    (repository.send as jest.Mock).mockResolvedValue(mockResult);
    (emailSender.send as jest.Mock).mockRejectedValue(new Error('SMTP error'));
    await sut.send(params);
    expect(notificationFailedCounter.add).toHaveBeenCalled();
  });

  it('should throw if repository throws', async () => {
    const { sut, repository } = makeSut();
    (repository.send as jest.Mock).mockRejectedValue(new Error('err'));
    await expect(sut.send(params)).rejects.toThrow('err');
  });
});
