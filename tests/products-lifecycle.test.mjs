import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/admin/pages/ProductsCrud.jsx', import.meta.url), 'utf8');
function setup(isEditing = false) {
  let resolve, reject, timeout;
  const write = new Promise((ok, fail) => { resolve = ok; reject = fail; });
  const state = { showModal: true };
  let calls = 0;
  const context = {
    operation: { current: null }, modalVersion: { current: 1 }, isEditing,
    editingProduct: isEditing ? { id: 'existing' } : null,
    addProduct: () => { calls++; return write; },
    editProduct: (id) => { assert.equal(id, 'existing'); calls++; return write; },
    setTimeout: (callback) => { timeout = callback; return 1; },
    clearTimeout: () => {}, console: { error() {} },
  };
  for (const key of ['Saving', 'Pending', 'SaveMessage', 'ShowModal', 'EditingProduct']) {
    context['set' + key] = (value) => { state[key[0].toLowerCase() + key.slice(1)] = value; };
  }
  vm.createContext(context);
  const handlers = source.slice(source.indexOf('  const handleSave ='), source.indexOf('  // ── Handlers Eliminar'));
  vm.runInContext(handlers + '\nglobalThis.save = handleSave; globalThis.close = handleCloseModal;', context);
  return { context, state, resolve, reject, timeout: () => timeout(), calls: () => calls };
}

for (const editing of [false, true]) test(`confirmed ${editing ? 'edit' : 'create'} closes and clears state`, async () => {
  const s = setup(editing);
  const result = s.context.save({ title: 'Producto' });
  assert.equal(s.state.saving, true);
  s.resolve('id');
  await result;
  assert.equal(s.state.showModal, false);
  assert.equal(s.state.saving, false);
  assert.equal(s.state.pending, false);
});

test('pending write allows closing, prevents duplicate submit and never reports success', async () => {
  const s = setup();
  const result = s.context.save({});
  s.timeout();
  assert.equal(s.state.saving, false);
  assert.equal(s.state.pending, true);
  assert.match(s.state.saveMessage, /pendiente/);
  await s.context.save({});
  assert.equal(s.calls(), 1);
  s.context.close();
  assert.equal(s.state.showModal, false);
  // Simulate opening another form before the previous write confirms.
  s.context.modalVersion.current++;
  s.state.showModal = true;
  s.resolve('id');
  await result;
  assert.equal(s.state.showModal, true);
  assert.equal(s.state.pending, false);
});

test('rejected write preserves form and permits retry', async () => {
  const s = setup();
  const result = s.context.save({});
  s.reject(new Error('permission-denied'));
  await result;
  assert.equal(s.state.showModal, true);
  assert.equal(s.state.pending, false);
  assert.equal(s.state.saving, false);
  assert.equal(s.state.saveMessage, 'permission-denied');
  assert.equal(s.context.operation.current, null);
});

test('product hook owns one listener, mutations do not subscribe, cleanup releases it', async () => {
  const hook = readFileSync(new URL('../src/admin/hooks/useProducts.js', import.meta.url), 'utf8')
    .replace(/import[\s\S]*?from\s+"[^"]+";/g, '')
    .replace('export default function', 'function');
  let active = 0, subscriptions = 0, cleanup;
  const context = {
    useState: (initial) => [initial, () => {}],
    useEffect: (effect) => { cleanup = effect(); },
    subscribeProducts: (onData) => {
      active++; subscriptions++; onData([]);
      return () => { active--; };
    },
    createProduct: async () => 'id', updateProduct: async () => true,
    deleteProduct: async () => true, console: { log() {} },
  };
  vm.createContext(context);
  vm.runInContext(hook + '\nglobalThis.hook = useProducts;', context);
  const products = context.hook();
  for (let i = 0; i < 3; i++) {
    await products.addProduct({}); await products.editProduct('id', {}); await products.removeProduct('id');
  }
  assert.equal(active, 1);
  assert.equal(subscriptions, 1);
  cleanup();
  assert.equal(active, 0);
  context.hook(); cleanup();
  assert.equal(active, 0);
});
