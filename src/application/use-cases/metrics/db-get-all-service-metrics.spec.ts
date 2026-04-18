import { DbGetAllServiceMetrics } from '@/application/use-cases/db-get-all-service-metrics';
import { GetAllServiceMetricsRepository } from '@/application/protocols/db';

const makeRepository = (): GetAllServiceMetricsRepository => ({ getAll: jest.fn() });
const makeSut = () => {
  const repository = makeRepository();
  const sut = new DbGetAllServiceMetrics(repository);
  return { sut, repository };
};

describe('DbGetAllServiceMetrics', () => {
  const mockResult = [{ id: 'm-1', serviceId: 's-1', serviceName: 'Oil Change', totalExecutions: 10 }];

  it('should call repository', async () => {
    const { sut, repository } = makeSut();
    (repository.getAll as jest.Mock).mockResolvedValue(mockResult);
    await sut.getAll();
    expect(repository.getAll).toHaveBeenCalled();
  });

  it('should return all metrics', async () => {
    const { sut, repository } = makeSut();
    (repository.getAll as jest.Mock).mockResolvedValue(mockResult);
    const result = await sut.getAll();
    expect(result).toEqual(mockResult);
  });

  it('should throw if repository throws', async () => {
    const { sut, repository } = makeSut();
    (repository.getAll as jest.Mock).mockRejectedValue(new Error('err'));
    await expect(sut.getAll()).rejects.toThrow('err');
  });
});
