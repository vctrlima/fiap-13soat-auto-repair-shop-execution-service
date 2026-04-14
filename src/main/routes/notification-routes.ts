import { FastifyInstance } from 'fastify';
import { buildRoute } from '@/main/adapters';
import { makeGetNotificationsController } from '@/main/factories/controllers';
import { notificationLogResponseSchema, errorResponseSchema } from '@/main/docs/schemas';

export async function notificationRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/:workOrderId',
    {
      schema: {
        tags: ['notification'],
        summary: 'Get notifications by work order ID',
        params: { type: 'object', properties: { workOrderId: { type: 'string' } }, required: ['workOrderId'] },
        response: {
          200: { type: 'array', items: notificationLogResponseSchema },
          400: errorResponseSchema,
        },
      },
    },
    buildRoute(makeGetNotificationsController()),
  );
}
