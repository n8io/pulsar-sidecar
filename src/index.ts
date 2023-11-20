import express from 'express';
import { Client as PulsarClient } from 'pulsar-client';
import { schemaPublishRequest } from './models';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error'

const port = parseInt(process.env.PORT || '3500');
const serviceUrl = process.env.PULSAR_ENDPOINT || 'pulsar://pulsar:6650';
const client = new PulsarClient({ serviceUrl });
const app = express();

const log = (message: string, ...args: any[]) =>
  console.log(`${new Date().toISOString()} ${message}`, ...args)

app.use(express.json());

app.post('/publish', async (req, res) => {
  let request

  try {
    request = schemaPublishRequest.parse(req.body);
  } catch (error: unknown) {
    res.status(400).json({ error: fromZodError(error as ZodError) });

    return;
  }

  const { message, topic } = request;
  const producer = await client.createProducer({ topic });

  log('📤 Publishing message...', message);
  await producer.send({ data: Buffer.from(JSON.stringify(message)) })
  log('👍 Message published.');

  await producer.close();
  
  res.status(204).send();
});

app.listen(port, () => log(`🚀 pulsar-sidecar is running at http://localhost:${port}`));