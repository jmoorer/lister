import { z } from 'zod';

export const tickerDataMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('trade'),
    data: z.array(
      z.object({
        p: z.number(),
        s: z.string(),
        t: z.number(),
        v: z.number(),
      }),
    ),
  }),
  z.object({
    type: z.literal('ping'),
  }),
]);

export type TickerDataMessage = z.infer<typeof tickerDataMessageSchema>;

export const symbolEntrySchema = z.object({
  description: z.string(),
  displaySymbol: z.string(),
  symbol: z.string(),
  type: z.string(),
});

export type SymbolEntry = z.infer<typeof symbolEntrySchema>;

export const searchResultsSchema = z.object({
  count: z.number(),
  result: z.array(symbolEntrySchema),
});

export type SearchResults = z.infer<typeof searchResultsSchema>;

export const quoteResponseSchema = z.object({
  c: z.number(),
  d: z.number(),
  dp: z.number(),
  h: z.number(),
  l: z.number(),
  o: z.number(),
  pc: z.number(),
  t: z.number(),
});

export type QuoteResponse = z.infer<typeof quoteResponseSchema>;

export const marketStatusSchema = z.object({
  exchange: z.string(),
  holiday: z.string().nullable(),
  isOpen: z.boolean(),
  session: z.string().nullable(),
  timezone: z.string(),
  t: z.number(),
});

export type MarketStatus = z.infer<typeof marketStatusSchema>;
