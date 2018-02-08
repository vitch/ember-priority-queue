import { module, test } from 'qunit';
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
});

