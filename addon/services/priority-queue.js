import Service from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Service.extend({
  completeTasks: computed.readOnly('_completeTasks'),
  isRunning: computed.readOnly('_isRunning'),
  runningTasks: computed.readOnly('_runningTasks'),
  queuedTasks: computed.readOnly('_queuedTasks'),

  addItem({ priority, task }) {
    this.get('_allTasks').addObject({
      _addedAt: Date.now(),
      _isComplete: false,
      _isRunning: false,
      _isQueued: true,
      priority,
      task,
    });
  },

  clear() {

  },

  pause() {
    if (this.get('_isRunning')) {
      this.set('_isRunning', false);
    }
  },

  start() {
    if (!this.get('_isRunning')) {
      this.set('_isRunning', true);
    }
  },

  _allTasks: computed(() =>  A([])),
  _completeTasks: computed.filterBy('_allTasks', '_isComplete', true),
  _isRunning: false,
  _runningTasks: computed.filterBy('_allTasks', '_isRunning', true),
  _queuedTasks: computed.filterBy('_allTasks', '_isQueued', true),

});
