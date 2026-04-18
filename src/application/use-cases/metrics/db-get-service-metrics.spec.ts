import { DbGetServiceMetrics } from '@/application/use-cases/db-get-service-metrics';
import { GetServiceMetricsRepository } from '@/application/protocols/db';

const makeRepository = (): GetServiceMetricsRepository => ({ getMetrics: jest.fn() });
const makeSut = () => {
  const repository = makeRepository();
  const sut = new DbGetServiceMetrics(repository);
  return { sut, repository };
};

describe('DbGetServiceMetrics', () => {
  const mockResult = { id: 'm-1', serviceId: 's-1', serviceName: 'Oil Change', totalExecutions: 10, successRate: 0.9 };

  it('should call repository with correct params', async () => {
    const { sut, repository } = makeSut();
    (repository.getMetrics as jest.Mock).mockResolvedValue(mockResult);
    await sut.getMetrics({ serviceId: 's-1' });
    expect(repository.getMetrics).toHaveBeenCalledWith({ serviceId: 's-1' });
  });

  it('should return metrics', async () => {
    const { sut, repository } = makeSut();
    (repository.getMetrics as jest.Mock).mockResolvedValue(mockResult);
    const result = await sut.getMetrics({ serviceId: 's-1' });
    expect(result).toEqual(mockResult);
  });

  it('should return null if not found', async () => {
    const { sut, repository } = makeSut();
    (repository.getMetrics as jest.Mock).mockResolvedValue(null);
    const result = await sut.getMetrics({ serviceId: 's-1' });
    expect(result).toBeNull();
  });

  it('should throw if repository throws', async () => {
    const { sut, repository } = makeSut();
    (repository.getMetrics as jest.Mock).mockRejectedValue(new Error('err'));
    await expect(sut.getMetrics({ serviceId: 's-1' })).rejects.toThrow('err');
  });
});
