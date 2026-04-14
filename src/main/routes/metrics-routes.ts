import { FastifyInstance } from 'fastify';
import { buildRoute } from '@/main/adapters';
import {
  makeGetServiceMetricsController,
  makeGetAllServiceMetricsController,
} from '@/main/factories/controllers';
import { serviceMetricsResponseSchema, errorResponseSchema } from '@/main/docs/schemas';

export async function metricsRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['metrics'],
        summary: 'Get all service metrics',
        response: {
          200: { type: 'array', items: serviceMetricsResponseSchema },
        },
      },
    },
    buildRoute(makeGetAllServiceMetricsController()),
  );

  fastify.get(
    '/:serviceId',
    {
      schema: {
        tags: ['metrics'],
        summary: 'Get metrics for a specific service',
        params: { type: 'object', properties: { serviceId: { type: 'string' } }, required: ['serviceId'] },
        response: { 200: serviceMetricsResponseSchema, 404: errorResponseSchema },
      },
    },
    buildRoute(makeGetServiceMetricsController()),
  );
}
