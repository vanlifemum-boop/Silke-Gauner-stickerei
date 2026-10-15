import test from 'node:test';
import assert from 'node:assert/strict';
import {createCartStorage, STORAGE_KEY, CONSENT_KEY, REMEMBER_DURATION_MS} from '../cart-storage.js';

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  const writes = [];
  return {
    values, writes,
    getItem: key => values.get(key) ?? null,
    setItem(key, value) { writes.push(key); values.set(key, String(value)); },
    removeItem: key => values.delete(key)
  };
}
const example = () => [{productId:'club-forster-755', qty:2, options:{color:'navy'}, note:'Team Anna'}];

test('Fresh visits do not write storage and adding a selection uses the session only', () => {
  const session = storage(), local = storage();
  const api = createCartStorage({session, local});
  assert.deepEqual(api.load(), []);
  assert.equal(api.isRemembered(), false);
  assert.deepEqual(session.writes, []);
  assert.deepEqual(local.writes, []);
  api.save(example());
  assert.deepEqual(JSON.parse(session.getItem(STORAGE_KEY)), example());
  assert.equal(local.values.size, 0);
  assert.deepEqual(createCartStorage({session, local}).load(), example());
  assert.deepEqual(createCartStorage({session:storage(), local}).load(), []);
});

test('Remembering is explicit, persists for 30 days, and ordinary saves do not extend expiry', () => {
  let time = 1000;
  const session = storage(), local = storage();
  const api = createCartStorage({session, local, now:() => time});
  api.save(example());
  assert.equal(api.setRemember(true), true);
  const expiry = 1000 + REMEMBER_DURATION_MS;
  assert.deepEqual(JSON.parse(local.getItem(CONSENT_KEY)), {version:1, expiresAt:expiry});
  assert.deepEqual(createCartStorage({session:storage(), local, now:() => time}).load(), example());
  time += 1000;
  api.save([{...example()[0], qty:3}]);
  assert.equal(JSON.parse(local.getItem(CONSENT_KEY)).expiresAt, expiry);
  time = expiry;
  assert.equal(api.isRemembered(), false);
  assert.equal(local.values.size, 0);
  assert.equal(api.load()[0].qty, 3);
  assert.equal(JSON.parse(session.getItem(STORAGE_KEY))[0].qty, 3);
});

test('Expired consent deletes the persistent selection and retains an existing session', () => {
  const local = storage({[STORAGE_KEY]:JSON.stringify(example()), [CONSENT_KEY]:JSON.stringify({version:1, expiresAt:50})});
  const current = [{productId:'masshemd', qty:1}];
  const session = storage({[STORAGE_KEY]:JSON.stringify(current)});
  const api = createCartStorage({session, local, now:() => 50});
  assert.deepEqual(api.load(), current);
  assert.equal(api.isRemembered(), false);
  assert.equal(local.values.size, 0);
  assert.deepEqual(createCartStorage({session:storage(), local, now:() => 50}).load(), []);
});

test('Legacy persistent carts migrate once to the session without creating consent', () => {
  const local = storage({[STORAGE_KEY]:JSON.stringify(example())});
  const session = storage();
  const api = createCartStorage({session, local});
  assert.deepEqual(api.load(), example());
  assert.deepEqual(JSON.parse(session.getItem(STORAGE_KEY)), example());
  assert.equal(local.values.size, 0);
  assert.equal(api.isRemembered(), false);
  assert.deepEqual(createCartStorage({session:storage(), local}).load(), []);
  assert.deepEqual(createCartStorage({session, local}).load(), example());
});

test('A current session takes priority over a legacy selection, and malformed consent is not treated as legacy', () => {
  const current = [{productId:'massbluse', qty:1}];
  const session = storage({[STORAGE_KEY]:JSON.stringify(current)});
  const local = storage({[STORAGE_KEY]:JSON.stringify(example())});
  assert.deepEqual(createCartStorage({session, local}).load(), current);
  assert.equal(local.values.size, 0);
  const invalid = storage({[STORAGE_KEY]:JSON.stringify(example()), [CONSENT_KEY]:'invalid'});
  assert.deepEqual(createCartStorage({session:storage(), local:invalid}).load(), []);
  assert.equal(invalid.values.size, 0);
});

test('Opting out retains the current selection in the session and removes persistent consent', () => {
  const local = storage(), session = storage();
  const api = createCartStorage({session, local});
  api.save(example());
  api.setRemember(true);
  const nextSession = storage();
  const restored = createCartStorage({session:nextSession, local});
  assert.equal(restored.setRemember(false), false);
  assert.equal(local.values.size, 0);
  assert.deepEqual(JSON.parse(nextSession.getItem(STORAGE_KEY)), example());
  assert.deepEqual(restored.load(), example());
});

test('Another tab revoking or renewing consent is respected before persistent writes', () => {
  let time = 1000;
  const local = storage(), firstSession = storage(), secondSession = storage();
  const first = createCartStorage({session:firstSession, local, now:() => time});
  first.save(example());
  first.setRemember(true);
  const second = createCartStorage({session:secondSession, local, now:() => time});
  assert.deepEqual(second.load(), example());
  assert.deepEqual(JSON.parse(secondSession.getItem(STORAGE_KEY)), example());

  // The first tab renews consent: the second must not delete that newer record
  // when its originally cached expiry passes.
  time += 1000;
  first.setRemember(true);
  const renewedExpiry = time + REMEMBER_DURATION_MS;
  time = 1000 + REMEMBER_DURATION_MS;
  assert.equal(second.isRemembered(), true);
  assert.equal(JSON.parse(local.getItem(CONSENT_KEY)).expiresAt, renewedExpiry);

  first.setRemember(false);
  const changed = [{...example()[0], qty:4}];
  second.save(changed);
  assert.equal(second.isRemembered(), false);
  assert.equal(local.values.size, 0);
  assert.deepEqual(JSON.parse(secondSession.getItem(STORAGE_KEY)), changed);
  assert.deepEqual(createCartStorage({session:storage(), local, now:() => time}).load(), []);

  second.setRemember(true);
  const third = createCartStorage({session:storage(), local, now:() => time});
  third.load();
  second.clear();
  third.save(example());
  assert.equal(third.isRemembered(), false);
  assert.equal(local.values.size, 0);
});

test('A restored persistent cart remains in its current session after consent expires', () => {
  const local = storage({[STORAGE_KEY]:JSON.stringify(example()), [CONSENT_KEY]:JSON.stringify({version:1, expiresAt:100})});
  const session = storage();
  let time = 50;
  const api = createCartStorage({session, local, now:() => time});
  assert.deepEqual(api.load(), example());
  time = 100;
  assert.equal(api.isRemembered(), false);
  assert.equal(local.values.size, 0);
  assert.deepEqual(createCartStorage({session, local, now:() => time}).load(), example());
});

test('Clear removes both storage keys from both locations and cannot revive the in-memory cart', () => {
  const local = storage(), session = storage({[CONSENT_KEY]:'legacy-extra'});
  const api = createCartStorage({session, local});
  api.save(example());
  api.setRemember(true);
  api.clear();
  assert.equal(local.values.size, 0);
  assert.equal(session.values.size, 0);
  assert.deepEqual(api.load(), []);
  assert.equal(api.isRemembered(), false);
});

test('Unavailable storage falls back to memory without falsely reporting persistence', () => {
  const unavailable = {getItem(){throw Error('blocked');}, setItem(){throw Error('blocked');}, removeItem(){throw Error('blocked');}};
  for (const unavailableStorage of [unavailable, undefined]) {
    const api = createCartStorage({session:unavailableStorage, local:unavailableStorage});
    assert.deepEqual(api.load(), []);
    api.save(example());
    assert.deepEqual(api.load(), example());
    assert.equal(api.setRemember(true), false);
    assert.equal(api.isRemembered(), false);
    assert.deepEqual(api.load(), example());
    api.clear();
    assert.deepEqual(api.load(), []);
  }
});

test('Caller-owned selections and restored selections cannot mutate the stored cart', () => {
  const api = createCartStorage({session:storage(), local:storage()});
  const input = example();
  api.save(input);
  input[0].options.color = 'red';
  input.push({productId:'other'});
  assert.deepEqual(api.load(), example());
  const result = api.load();
  result[0].options.color = 'green';
  result.length = 0;
  assert.deepEqual(api.load(), example());
});
