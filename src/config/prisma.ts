import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient is instantiated once and shared across the application.
 * This prevents exhausting the database connection pool.
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
const prisma = new PrismaClient();

export default prisma;