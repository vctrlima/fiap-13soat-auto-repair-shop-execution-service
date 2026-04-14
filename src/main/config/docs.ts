import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

export const docs: FastifyDynamicSwaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Execution & Notification Service',
      description: 'API documentation for the Execution & Notification microservice',
      version: '1.0.0',
    },
    servers: [{ url: '/', description: 'Current server' }],
    tags: [
      { name: 'execution', description: 'Execution log end-points' },
      { name: 'notification', description: 'Notification log end-points' },
      { name: 'metrics', description: 'Service metrics end-points' },
    ],
  },
};
