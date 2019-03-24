import PriorityQueue from 'ember-priority-queue/-private/priority-queue';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | priority queue', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    let Factory = this.owner.factoryFor('service:priority-queue');
    this.subject = Factory.create({ });
  });

  test('it provides access to a PriorityQueue', function(assert) {
    assert.strictEqual(this.subject.getQueue('testQueue') instanceof PriorityQueue, true);
  });

  test('the instances returned are tied to the name passed', function(assert) {
    let testQueue1 = this.subject.getQueue('testQueue');
    let testQueue2 = this.subject.getQueue('testQueue');
    let testQueue3 = this.subject.getQueue('foo');
    assert.strictEqual(testQueue1, testQueue2);
    assert.notStrictEqual(testQueue1, testQueue3);
  });
});

