import express from 'express'
import { Client as PulsarClient } from 'pulsar-client'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { schemaPublishRequest } from './models'

const port = parseInt(process.env.PORT || '3500')
const serviceUrl = process.env.PULSAR_ENDPOINT || 'pulsar://pulsar:6650'
const client = new PulsarClient({ operationTimeoutSeconds: 3, serviceUrl })
const app = express()

app.use(express.json())

const useProducerContext = async (topic: string) => {
  const producer = await client.createProducer({ sendTimeoutMs: 3_000, topic })

  return {
    producer,
    [Symbol.asyncDispose]: async () => {
      await producer.close()
    },
  }
}

app.post('/publish', async (req, res) => {
  let request

  try {
    request = schemaPublishRequest.parse(req.body)
  } catch (error: unknown) {
    res.status(400).json({ error: fromZodError(error as ZodError) })

    return
  }

  const { message, topic } = request
  
  await using ctx = await useProducerContext(topic)

  console.log(`📤 Publishing message on "${topic}" topic...`, message)
  await ctx.producer.send({ data: Buffer.from(JSON.stringify(message)) })
  console.log(`👍 Message published @ ${new Date().toISOString()}`)

  res.status(204).send()
})

app.listen(port, () => console.log(`🚀 pulsar-sidecar is running at http://localhost:${port}`))
