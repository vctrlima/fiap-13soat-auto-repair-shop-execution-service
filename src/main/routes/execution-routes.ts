import { FastifyInstance } from 'fastify';
import { buildRoute } from '@/main/adapters';
import {
  makeGetExecutionLogsController,
  makeUpdateExecutionLogStatusController,
} from '@/main/factories/controllers';
import { makeCompleteWorkOrderExecution } from '@/main/factories/use-cases';
import { executionLogResponseSchema, errorResponseSchema } from '@/main/docs/schemas';

export async function executionRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/:workOrderId',
    {
      schema: {
        tags: ['execution'],
        summary: 'Get execution logs by work order ID',
        params: { type: 'object', properties: { workOrderId: { type: 'string' } }, required: ['workOrderId'] },
        response: {
          200: { type: 'array', items: executionLogResponseSchema },
          400: errorResponseSchema,
        },
      },
    },
    buildRoute(makeGetExecutionLogsController()),
  );

  fastify.patch(
    '/logs/:id',
    {
      schema: {
        tags: ['execution'],
        summary: 'Update execution log status',
        params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
        body: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELED'] },
            failureReason: { type: 'string' },
          },
        },
        response: { 200: executionLogResponseSchema, 400: errorResponseSchema },
      },
    },
    buildRoute(makeUpdateExecutionLogStatusController()),
  );

  fastify.post(
    '/:workOrderId/complete',
    {
      schema: {
        tags: ['execution'],
        summary: 'Check and complete work order execution',
        params: { type: 'object', properties: { workOrderId: { type: 'string' } }, required: ['workOrderId'] },
        response: {
          200: {
            type: 'object',
            properties: {
              workOrderId: { type: 'string' },
              allCompleted: { type: 'boolean' },
              completedServices: { type: 'array', items: { type: 'string' } },
            },
          },
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const completeExecution = makeCompleteWorkOrderExecution();
        const result = await completeExecution.complete({
          workOrderId: (request.params as any).workOrderId,
        });
        reply.status(200).send(result);
      } catch (error: any) {
        reply.status(400).send({ error: error.message });
      }
    },
  );
}
