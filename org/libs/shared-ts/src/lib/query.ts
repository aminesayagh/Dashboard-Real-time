import { z } from 'zod';

export const zodPagination = z.object({
    filter: z.object({}).optional(),
    limit: z.number().int().positive().default(10),
    page: z.number().int().positive().default(1),
});

export type PaginationBody = z.infer<typeof zodPagination>;
