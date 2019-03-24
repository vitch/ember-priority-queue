import Component from '@ember/component';
import RSVP from 'rsvp';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import layout from '../templates/components/queue-demo';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';

function getColor(task) {
  if (task._isRunning) {
    return {1: '#f00', 2: '#f60', 10: '#06f', 20: '#0ff'}[task.priority];
  }
  if (task._isComplete) {
    return '#eee';
  }
  if (task._isQueued) {
    return '#eee';
  }
}

export default Component.extend({
  layout,

  priorityQueue: service('priority-queue'),

  demoQueue: computed(function() {
    return this.get('priorityQueue').getQueue('demo-queue');
  }),

  availableItems: computed(() => [
    { duration: 1000, name: 'Item 1', priority: 1 },
    { duration: 2000, name: 'Item 2', priority: 10 },
    { duration: 3000, name: 'Item 3', priority: 2 },
    { duration: 4000, name: 'Item 4', priority: 20 },
  ]),

  didInsertElement() {
    let updateTaskRepresentationInterval = window.setInterval(() => this._updateTaskRepresentation(), 500);
    this.set('_updateTaskRepresentationInterval', updateTaskRepresentationInterval);
  },

  willRemoveElement() {
    window.clearIntervel(this.get('_updateTaskRepresentationInterval'));
  },

  _updateTaskRepresentation() {
    this.get('_taskStory').addObject(

      this.get('demoQueue.__allTasks').map((task) => ({
        style: htmlSafe(`background: ${getColor(task)}`),
      }))
    );
    if (this.get('_taskStory.length') > 50) {
      this.get('_taskStory').splice(0, 1);
    }
  },

  _taskStory: computed(() => A([])),

  actions: {
    addItem(item) {
      let task = () => {
        let waiter = RSVP.defer();
        run.later(() => {
          waiter.resolve(item.name);
        }, item.duration)
        return waiter.promise;
      };
      this.get('demoQueue').addItem({ priority: item.priority, task });
    },

    clearQueue() {
      this.get('demoQueue').clear();
    },

    pauseQueue() {
      this.get('demoQueue').pause();
    },

    startQueue() {
      this.get('demoQueue').start();
    },
  },
});
