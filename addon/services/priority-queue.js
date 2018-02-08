import EmberObject from '@ember/object';
import Service from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Service.extend({
  completeTasks: computed.readOnly('_completeTasks'),
  isRunning: computed.readOnly('_isRunning'),
  runningTasks: computed.readOnly('_runningTasks'),
  queuedTasks: computed.readOnly('_queuedTasks'),

  addItem({ priority, task }) {
    this.get('_allTasks').addObject(EmberObject.create({
      _addedAt: Date.now(),
      _isComplete: false,
      _isRunning: false,
      _isQueued: true,
      priority,
      task,
    }));
    this._fillQueue();
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
      this._fillQueue();
    }
  },

  _allTasks: computed(() =>  A([])),
  _completeTasks: computed.filterBy('_allTasks', '_isComplete', true),
  _isRunning: false,
  _maxConcurrentTasks: 3,
  _runningTasks: computed.filterBy('_allTasks', '_isRunning', true),
  _queuedTasks: computed.filterBy('_allTasks', '_isQueued', true),

  _fillQueue() {
    if (!this.get('_isRunning')) {
      return;
    }

    let maxConcurrentTasks = this.get('_maxConcurrentTasks');
    while(this.get('_runningTasks.length') < maxConcurrentTasks) {
      let nextTask = this.get('_queuedTasks.firstObject');
      if (!nextTask) {
        break; // queue is empty
      }
      this._runTask(nextTask);
    }
  },

  _runTask(task) {
    task.setProperties({
      _isRunning: true,
      _isQueued: false,
    });
    task.get('task')()
      .then(() => {
        task.setProperties({
          _isComplete: true,
          _isRunning: false,
        })
        this._fillQueue();
      });
  },

});
