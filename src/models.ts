import { z } from 'zod'

const schemaString = z.string().min(1).trim()
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

const schemaJson: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(schemaJson), z.record(schemaJson)])
);

const schemaPulsarMessage = z.object({
  data: schemaJson,
  messageDispatchedAt: z.number().optional(),
  messageId: schemaString.optional(),
  messageType: schemaString,
}).passthrough()

const schemaPublishRequest = z.object({
  message: schemaPulsarMessage,
  topic: schemaString,
})

type PublishRequest = z.infer<typeof schemaPublishRequest>

export type { PublishRequest }
export { schemaPublishRequest }