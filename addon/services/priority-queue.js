import Service from '@ember/service';
import PriorityQueue from 'ember-priority-queue/-private/priority-queue';
import { computed } from '@ember/object';

export default Service.extend({
  _queues: computed(() => ({})),
  getQueue(queueName) {
    let queues = this.get('_queues');
    let queue = queues[queueName];
    if (!queue) {
      queue = queues[queueName] = PriorityQueue.create();
    }
    return queue;
  },
});
