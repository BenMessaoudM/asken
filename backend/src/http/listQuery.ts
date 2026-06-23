import { z } from 'zod';

export interface ListQuery {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  filter?: string;
}

export function parseListQuery(
  query: Record<string, unknown>,
  allowedSortFields: readonly [string, ...string[]],
  defaultSort: string,
): ListQuery {
  const schema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(allowedSortFields).default(defaultSort),
    order: z.enum(['asc', 'desc']).default('asc'),
    filter: z.string().trim().min(1).max(200).optional(),
  });

  return schema.parse(query);
}
