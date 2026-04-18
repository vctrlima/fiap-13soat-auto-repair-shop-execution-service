import { DbGetNotificationsByWorkOrderId } from '@/application/use-cases/db-get-notifications';
import { GetNotificationsByWorkOrderIdRepository } from '@/application/protocols/db';

const makeRepository = (): GetNotificationsByWorkOrderIdRepository => ({ getByWorkOrderId: jest.fn() });
const makeSut = () => {
  const repository = makeRepository();
  const sut = new DbGetNotificationsByWorkOrderId(repository);
  return { sut, repository };
};

describe('DbGetNotificationsByWorkOrderId', () => {
  const mockResult = [{ id: 'n-1', workOrderId: 'wo-1', type: 'PAYMENT_COMPLETED', status: 'SENT' }];

  it('should call repository with correct params', async () => {
    const { sut, repository } = makeSut();
    (repository.getByWorkOrderId as jest.Mock).mockResolvedValue(mockResult);
    await sut.getByWorkOrderId({ workOrderId: 'wo-1' });
    expect(repository.getByWorkOrderId).toHaveBeenCalledWith({ workOrderId: 'wo-1' });
  });

  it('should return notifications', async () => {
    const { sut, repository } = makeSut();
    (repository.getByWorkOrderId as jest.Mock).mockResolvedValue(mockResult);
    const result = await sut.getByWorkOrderId({ workOrderId: 'wo-1' });
    expect(result).toEqual(mockResult);
  });

  it('should throw if repository throws', async () => {
    const { sut, repository } = makeSut();
    (repository.getByWorkOrderId as jest.Mock).mockRejectedValue(new Error('err'));
    await expect(sut.getByWorkOrderId({ workOrderId: 'wo-1' })).rejects.toThrow('err');
  });
});
