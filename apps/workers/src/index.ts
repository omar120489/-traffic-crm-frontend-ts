import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Queues
export const leadScoringQueue = new Queue('lead-scoring', { connection });
export const enrichmentQueue = new Queue('enrichment', { connection });

// Note: QueueScheduler was removed in BullMQ v5
// Delayed jobs are now handled automatically by the Queue itself

// Workers
new Worker(
  'lead-scoring',
  async (job) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[lead-scoring] Processing job ${job.id} for lead ${job.data.leadId}`);
    }
    // TODO: scoring logic using job.data
    // - Email validation score
    // - Company size/industry match
    // - Engagement history
    // - UTM source quality
    const score = Math.floor(Math.random() * 100);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[lead-scoring] Lead ${job.data.leadId} scored: ${score}`);
    }
    return { score };
  },
  { connection }
);

new Worker(
  'enrichment',
  async (job) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[enrichment] Processing job ${job.id} for ${job.data.type} ${job.data.entityId}`);
    }
    // TODO: enrichment logic (e.g., Clearbit, social lookup)
    // - Company data (size, industry, location)
    // - Contact social profiles (LinkedIn, Twitter)
    // - Email verification
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[enrichment] Enriched ${job.data.type} ${job.data.entityId}`);
    }
    return { enriched: true };
  },
  { connection }
);

if (process.env.NODE_ENV !== 'test') {
  console.log('✅ Workers running. Queues: lead-scoring, enrichment');
  console.log('   Redis:', process.env.REDIS_URL || 'redis://localhost:6379');
}

