const { assert } = require('chai');
const {
  createAssetOp,
  updateAssetOp,
} = require('../src/Utils');

describe('create asset', () => {
  it('props empty json object', () => {
    const op = createAssetOp({
      nonce: 0,
      ownerId: '',
      metadata: '',
      props: {},
    });
    assert.equal(op, '{"type":"create_asset","msg":{"nonce":0,"owner_id":"","props":"{}","metadata":"\\"\\""}}');
  });
  it('props empty json object', () => {
    const op = createAssetOp({
      nonce: 0,
      ownerId: '',
      metadata: '',
      props: { key: 'value' },
    });
    assert.equal(op, '{"type":"create_asset","msg":{"nonce":0,"owner_id":"","props":"{\\"key\\":\\"value\\"}","metadata":"\\"\\""}}');
  });
  it('props is nested struct', () => {
    const op = createAssetOp({
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
    const op = updateAssetOp({
      nonce: 0,
      assetId: '',
      metadata: '',
      props: {},
    });
    assert.equal(op, '{"type":"set_asset_props","msg":{"nonce":0,"id":"","props":"{}","metadata":"\\"\\""}}');
  });
  it('props empty json object', () => {
    const op = updateAssetOp({
      nonce: 0,
      assetId: '',
      metadata: '',
      props: { key: 'value' },
    });
    assert.equal(op, '{"type":"set_asset_props","msg":{"nonce":0,"id":"","props":"{\\"key\\":\\"value\\"}","metadata":"\\"\\""}}');
  });
  it('props is nested struct', () => {
    const op = updateAssetOp({
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
