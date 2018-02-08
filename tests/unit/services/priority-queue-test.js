import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | priority queue', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let Factory = this.owner.factoryFor('service:priority-queue');
    let subject = Factory.create({ });

    assert.ok(subject);

  });
});

