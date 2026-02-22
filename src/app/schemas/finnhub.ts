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

export const newsSchema = z.object({
  category: z.string(),
  datetime: z.number(),
  headline: z.string(),
  id: z.number(),
  image: z.string().nullable(),
  related: z.string().nullable(),
  source: z.string(),
  summary: z.string(),
  url: z.string(),
});

export type News = z.infer<typeof newsSchema>;
export const newsResponseSchema = newsSchema.array();
export type NewsResponse = z.infer<typeof newsResponseSchema>;

export const companyProfileSchema = z.object({
  country: z.string(),
  currency: z.string(),
  exchange: z.string(),
  finnhubIndustry: z.string(),
  ipo: z.string(),
  logo: z.string(),
  marketCapitalization: z.number(),
  name: z.string(),
  phone: z.string(),
  shareOutstanding: z.number(),
  ticker: z.string(),
  weburl: z.string(),
});

export type CompanyProfile = z.infer<typeof companyProfileSchema>;
