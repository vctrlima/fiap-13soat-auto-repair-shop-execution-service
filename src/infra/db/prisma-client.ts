import { PrismaClient } from '@prisma/client';
import { dbQueryDuration } from '@/infra/observability';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

prisma.$on('query', (e) => {
  dbQueryDuration.record(e.duration, { operation: 'prisma' });
});

export { prisma };
