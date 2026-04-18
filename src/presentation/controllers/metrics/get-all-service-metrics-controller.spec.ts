import { GetAllServiceMetricsController } from '@/presentation/controllers/get-all-service-metrics-controller';
import { GetAllServiceMetrics } from '@/domain/use-cases';

const makeUseCase = (): GetAllServiceMetrics => ({ getAll: jest.fn() });
const makeSut = () => {
  const useCase = makeUseCase();
  const sut = new GetAllServiceMetricsController(useCase);
  return { sut, useCase };
};

describe('GetAllServiceMetricsController', () => {
  it('should return 200 with all metrics', async () => {
    const { sut, useCase } = makeSut();
    const mockMetrics = [{ serviceId: 's-1', totalExecutions: 10 }];
    (useCase.getAll as jest.Mock).mockResolvedValue(mockMetrics);
    const result = await sut.handle();
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockMetrics);
  });

  it('should return 500 on error', async () => {
    const { sut, useCase } = makeSut();
    (useCase.getAll as jest.Mock).mockRejectedValue(new Error('err'));
    const result = await sut.handle();
    expect(result.statusCode).toBe(500);
  });
});
