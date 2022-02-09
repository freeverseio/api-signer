const Accounts = require('web3-eth-accounts');
const { assert } = require('chai');
const {
  createAssetString,
  updateAssetString,
} = require('../src/Utils');
const { AtomicAssetOps } = require('../src/AtomicAssetOps');

describe('create asset', () => {
  it('props empty json object', () => {
    const op = createAssetString({
      nonce: 0,
      ownerId: '',
      metadata: '',
      props: {},
    });
    assert.equal(op, '{"type":"create_asset","msg":{"nonce":0,"owner_id":"","props":"{}","metadata":"\\"\\""}}');
  });
  it('props empty json object', () => {
    const op = createAssetString({
      nonce: 0,
      ownerId: '',
      metadata: '',
      props: { key: 'value' },
    });
    assert.equal(op, '{"type":"create_asset","msg":{"nonce":0,"owner_id":"","props":"{\\"key\\":\\"value\\"}","metadata":"\\"\\""}}');
  });
  it('props is nested struct', () => {
    const op = createAssetString({
      nonce: 0,
      ownerId: '',
      metadata: '',
      props: {
        key: { key: { key: 'value' } },
      },
    });
    assert.equal(op, '{"type":"create_asset","msg":{"nonce":0,"owner_id":"","props":"{\\"key\\":{\\"key\\":{\\"key\\":\\"value\\"}}}","metadata":"\\"\\""}}');
  });
});

describe('update asset', () => {
  it('props empty json object', () => {
    const op = updateAssetString({
      nonce: 0,
      assetId: '',
      metadata: '',
      props: {},
    });
    assert.equal(op, '{"type":"set_asset_props","msg":{"nonce":0,"id":"","props":"{}","metadata":"\\"\\""}}');
  });
  it('props empty json object', () => {
    const op = updateAssetString({
      nonce: 0,
      assetId: '',
      metadata: '',
      props: { key: 'value' },
    });
    assert.equal(op, '{"type":"set_asset_props","msg":{"nonce":0,"id":"","props":"{\\"key\\":\\"value\\"}","metadata":"\\"\\""}}');
  });
  it('props is nested struct', () => {
    const op = updateAssetString({
      nonce: 0,
      assetId: '',
      metadata: '',
      props: {
        key: { key: { key: 'value' } },
      },
    });
    assert.equal(op, '{"type":"set_asset_props","msg":{"nonce":0,"id":"","props":"{\\"key\\":{\\"key\\":{\\"key\\":\\"value\\"}}}","metadata":"\\"\\""}}');
  });
});

describe('AtomicAssetOps', () => {
  const pvk = '0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54';
  const account = new Accounts().privateKeyToAccount(pvk);

  describe('digest', () => {
    it('Universe: 0, Ops: []', () => {
      const tx = new AtomicAssetOps({ universeId: 0 });
      const digest = tx.digest();
      assert.equal(digest, '0xbc773c7d3e6e60a7ccaa29208f2ef3aa86fe273271dec70f60866a6c8c908762');
    });

    it('Universe: 0, Ops: ["{}"]', () => {
      const tx = new AtomicAssetOps({ universeId: 0 });
      tx.push({ op: '{}' });
      const digest = tx.digest();
      assert.equal(digest, '0x45c34096da2ccbe384880c7a4c9eba448696fbd41476e7f9d8a15275ef99565d');
    });

    it('Universe: 1, Ops: ["{}"]', () => {
      const tx = new AtomicAssetOps({ universeId: 1 });
      tx.push({ op: '{}' });
      const digest = tx.digest();
      assert.equal(digest, '0x43c340b66afd13155d9854b01fcf294286a196e7fe40c81752d0d929d9e468ba');
    });

    it('Universe: 1, Ops: ["{}", "{2}"]', () => {
      const tx = new AtomicAssetOps({ universeId: 1 });
      tx.push({ op: '{}' });
      tx.push({ op: '{2}' });
      const digest = tx.digest();
      assert.equal(digest, '0x2e4459146d6c58233bfeac1c3bff11d147b0bb90cd4f4eb1a286e5efbbe5bffe');
    });
  });
  describe('sign', () => {
    it('Universe: 0, Ops: []', () => {
      const tx = new AtomicAssetOps({ universeId: 0 });
      const sign = tx.sign({ web3Account: account });
      assert.equal(sign, '07a077de7b4dc56c5e8a686b081c269ee71da3bdd148e67f3be3f146b46617b54248c0ca51a4b9def97de763d28ad61736ef100bd8f03a0bac22e22ac74660241c');
    });

    it('Universe: 1, Ops: ["{}", "{2}"]', () => {
      const tx = new AtomicAssetOps({ universeId: 1 });
      tx.push({ op: '{}' });
      tx.push({ op: '{2}' });
      const sign = tx.sign({ web3Account: account });
      assert.equal(sign, '608f77d5e99d9ef47100532001d59da5e755aef402a9c939f265f98a01603fd57f6aa7b51b41eee1e3fe16862bbb822f4d80a982f077274d78967a652254f5391c');
    });
  });
  describe('gqlOpsString', () => {
    it('Universe: 0, Ops: []', () => {
      const tx = new AtomicAssetOps({ universeId: 0 });
      const opsStr = tx.gqlOpsString();
      assert.equal(opsStr, '');
    });

    it('Universe: 1, Ops: ["{}", "{2}"]', () => {
      const tx = new AtomicAssetOps({ universeId: 1 });
      tx.push({ op: '{}' });
      tx.push({ op: '{2}' });
      const opsStr = tx.gqlOpsString();
      assert.equal(opsStr, '"{}","{2}"');
    });
  });
});
