import Component from '@ember/component';
import RSVP from 'rsvp';
import { computed } from '@ember/object';
import layout from '../templates/components/queue-demo';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  priorityQueue: service('priority-queue'),

  availablaItems: computed(() => [
    { duration: 1000, name: 'Item 1', priority: 1 },
    { duration: 2000, name: 'Item 2', priority: 10 },
    { duration: 3000, name: 'Item 3', priority: 2 },
    { duration: 4000, name: 'Item 4', priority: 20 },
  ]),

  actions: {
    addItem(item) {
      let task = () => {
        let waiter = RSVP.defer();
        run.later(() => {
          waiter.resolve(item.name);
        }, item.duration)
        return waiter.promise;
      };
      this.get('priorityQueue').addItem({ priority: item.priority, task });
    },

    clearQueue() {
      this.get('priorityQueue').clear();
    },

    pauseQueue() {
      this.get('priorityQueue').pause();
    },

    startQueue() {
      this.get('priorityQueue').start();
    },
  },
});
