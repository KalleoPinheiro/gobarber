import BeeQueue from 'bee-queue';
import CacellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CacellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new BeeQueue(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, error) {
    console.log(`Queue ${job.queue.name}: FAILED`, error);
  }
}

export default new Queue();
