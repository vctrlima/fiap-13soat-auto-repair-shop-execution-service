import { GetServiceMetricsController } from '@/presentation/controllers/get-service-metrics-controller';
import { GetServiceMetrics } from '@/domain/use-cases';

const makeUseCase = (): GetServiceMetrics => ({ getMetrics: jest.fn() });
const makeSut = () => {
  const useCase = makeUseCase();
  const sut = new GetServiceMetricsController(useCase);
  return { sut, useCase };
};

describe('GetServiceMetricsController', () => {
  it('should return 400 if no serviceId', async () => {
    const { sut } = makeSut();
    const result = await sut.handle({ params: {} } as any);
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if null', async () => {
    const { sut, useCase } = makeSut();
    (useCase.getMetrics as jest.Mock).mockResolvedValue(null);
    const result = await sut.handle({ params: { serviceId: 's-1' } });
    expect(result.statusCode).toBe(404);
  });

  it('should return 200 with metrics', async () => {
    const { sut, useCase } = makeSut();
    const mockMetrics = { serviceId: 's-1', totalExecutions: 10 };
    (useCase.getMetrics as jest.Mock).mockResolvedValue(mockMetrics);
    const result = await sut.handle({ params: { serviceId: 's-1' } });
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockMetrics);
  });

  it('should return 500 on error', async () => {
    const { sut, useCase } = makeSut();
    (useCase.getMetrics as jest.Mock).mockRejectedValue(new Error('err'));
    const result = await sut.handle({ params: { serviceId: 's-1' } });
    expect(result.statusCode).toBe(500);
  });
});
