import { GetNotificationsController } from '@/presentation/controllers/get-notifications-controller';
import { GetNotificationsByWorkOrderId } from '@/domain/use-cases';

const makeUseCase = (): GetNotificationsByWorkOrderId => ({ getByWorkOrderId: jest.fn() });
const makeSut = () => {
  const useCase = makeUseCase();
  const sut = new GetNotificationsController(useCase);
  return { sut, useCase };
};

describe('GetNotificationsController', () => {
  it('should return 400 if no workOrderId', async () => {
    const { sut } = makeSut();
    const result = await sut.handle({ params: {} } as any);
    expect(result.statusCode).toBe(400);
  });

  it('should return 200 with notifications', async () => {
    const { sut, useCase } = makeSut();
    const mockNotifications = [{ id: 'n-1', workOrderId: 'wo-1', type: 'PAYMENT_COMPLETED' }];
    (useCase.getByWorkOrderId as jest.Mock).mockResolvedValue(mockNotifications);
    const result = await sut.handle({ params: { workOrderId: 'wo-1' } });
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockNotifications);
  });

  it('should return 500 on error', async () => {
    const { sut, useCase } = makeSut();
    (useCase.getByWorkOrderId as jest.Mock).mockRejectedValue(new Error('err'));
    const result = await sut.handle({ params: { workOrderId: 'wo-1' } });
    expect(result.statusCode).toBe(500);
  });
});
