import { A } from '@ember/array';
import RSVP from 'rsvp';
import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';

module('Unit | Service | priority queue', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    let Factory = this.owner.factoryFor('service:priority-queue');
    this.subject = Factory.create({ });
  });

  test('it starts paused', function(assert) {
    assert.strictEqual(this.subject.get('isRunning'), false);
  });

  test('you can start it', function(assert) {
    this.subject.start();
    assert.strictEqual(this.subject.get('isRunning'), true);
  });

  test('you can pause it again', function(assert) {
    this.subject.start();
    assert.strictEqual(this.subject.get('isRunning'), true);
    this.subject.pause();
    assert.strictEqual(this.subject.get('isRunning'), false);
  });

  test('added items are queued in priority order', function(assert) {
    this.subject.addItem({ priority: 10, task: 'A' });
    this.subject.addItem({ priority: 1, task: 'B' });
    this.subject.addItem({ priority: 5, task: 'C' });
    assert.deepEqual(this.subject.get('queuedTasks').mapBy('task'), ['B', 'C', 'A']);
  });

  test('added items are run in priority order', function(assert) {
    this.subject.addItem({ priority: 10, task: () => new RSVP.Promise(() => {} ) });
    this.subject.addItem({ priority: 1, task: () => new RSVP.Promise(() => {} ) });
    this.subject.addItem({ priority: 5, task: () => new RSVP.Promise(() => {} ) });
    this.subject.addItem({ priority: 5, task: () => new RSVP.Promise(() => {} ) });
    this.subject.start();
    assert.strictEqual(this.subject.get('runningTasks.length'), 3);
    assert.deepEqual(this.subject.get('queuedTasks').mapBy('priority'), [10], 'The lowest priority task is not running');
  });

  test('maxConcurrentTasks updates the number of concurrent tasks', function(assert) {
    this.subject.addItem({ priority: 10, task: () => new RSVP.Promise(() => {} ) });
    this.subject.addItem({ priority: 2, task: () => new RSVP.Promise(() => {} ) });
    this.subject.addItem({ priority: 4, task: () => new RSVP.Promise(() => {} ) });
    this.subject.addItem({ priority: 11, task: () => new RSVP.Promise(() => {} ) });
    this.subject.addItem({ priority: 6, task: () => new RSVP.Promise(() => {} ) });
    this.subject.start();
    assert.strictEqual(this.subject.get('runningTasks.length'), 3, 'Expected num runningTasks');
    assert.strictEqual(this.subject.get('queuedTasks.length'), 2, 'Expected num queuedTasks');
    assert.strictEqual(this.subject.get('completeTasks.length'), 0, 'Expected num completeTasks');
    this.subject.set('maxConcurrentTasks', 4);
    assert.strictEqual(this.subject.get('runningTasks.length'), 4, 'Expected num runningTasks');
    assert.strictEqual(this.subject.get('queuedTasks.length'), 1, 'Expected num runningTasks');
    assert.strictEqual(this.subject.get('completeTasks.length'), 0, 'Expected num completeTasks');
  });

  test('all tasks end up resolved in the expected order', function(assert) {
    let itemsToAdd = [
      { priority: 1, result: 'a' },
      { priority: 4, result: 'd' },
      { priority: 5, result: 'e' },
      { priority: 2, result: 'b' },
      { priority: 6, result: 'f' },
      { priority: 3, result: 'c' },
    ];
    let calledItems = A([]);
    itemsToAdd.forEach((item) => {
      let resolve = RSVP.resolve();
      this.subject.addItem({
        priority: item.priority,
        task() {
          calledItems.push({
            resolve,
            result: item.result,
          });
          return resolve;
        },
      });
    });
    this.subject.start();
    return RSVP.all(calledItems.mapBy('resolve'))
      .then(() => {
        run.next(() => {
          assert.deepEqual(calledItems.mapBy('result'), ['a', 'b', 'c', 'd', 'e', 'f'], 'Expected call order');
          assert.strictEqual(this.subject.get('runningTasks.length'), 0, 'Expected num runningTasks');
          assert.strictEqual(this.subject.get('queuedTasks.length'), 0, 'Expected num runningTasks');
          assert.strictEqual(this.subject.get('completeTasks.length'), 6, 'Expected num completeTasks');
        });
      });
  });
});

