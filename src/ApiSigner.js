// Copyright (c) 2021 Freeverse.io <dev@freeverse.io>
// Library for creating and managing Living Assets

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const {
  createAssetOp, updateAssetOp, concatHash, createAssetOpForCollection,
} = require('./Utils');

const { AtomicAssetOps } = require('./AtomicAssetOps');

// Returns the digest to be signed to upload an image
function digestImageUpload({ fileHash, universeIdx }) {
  return concatHash(
    ['string', 'uint32'],
    [fileHash, universeIdx],
  );
}

// Returns the digest to be signed to query the list of available images in a universe
function digestListImages({ universeIdx }) {
  return concatHash(['uint32'], [universeIdx]);
}

// Returns the digest to be signed to set the drop priority of an asset in a universe
function digestDropPriority({ assetId, priority }) {
  return concatHash(
    ['uint32', 'string'],
    [priority, assetId],
  );
}

// Returns the digest to be signed to create a collection in a given universe
// The provided collectionId must increment the previous existing one by +1
// New collections start with nonce = 0
function digestCreateCollection({ universeId, collectionId }) {
  return concatHash(['uint32', 'uint32'], [universeId, collectionId]);
}

// Returns the digest to be signed to update an existing collection.
// The provided nonce must increment the previous existing one by +1
// New collections start with nonce = 0
function digestUpdateCollection(
  {
    universeId, collectionId, name, description, imageUrl, nonce,
  },
) {
  return concatHash(
    ['uint32', 'uint32', 'string', 'string', 'string', 'uint32'],
    [universeId, collectionId, name, description, imageUrl, nonce],
  );
}

// Returns the two main strings (ops and signature)
// to be used as inputs to Create Asset GraphQL mutation
// This function will be deprecated in future releases,
// please use the AtomicAssetOps class instead.
function createAssetMutationInputs(
  {
    universeOwnerAccount, newAssetOwnerId, userNonce, universeIdx, propsJSON, metadataJSON,
  },
) {
  /** *
    * This is the string that will be signed by the universe owner,
    * and registered with the underlying blockchain
    * `{
    *   "type":"create_asset",
    *   "msg":{
    *       "nonce":<userNonce>,
    *       "owner_id": "<newAssetOwnerId>",
    *       "props":"<assetProperties>",
    *       "metadata": "<assetMetadata>"
    *   }
    * }`
    */
  const opsString = createAssetOp({
    nonce: userNonce, ownerId: newAssetOwnerId, metadata: metadataJSON, props: propsJSON,
  });

  const tx = new AtomicAssetOps({ universeId: universeIdx });
  tx.push({ op: opsString });

  // sign the operations string using the Eth universe owner account
  const sigString = tx.sign({ web3Account: universeOwnerAccount });

  // add more escape characters to embed the ops string into the query
  // this is necessary for correct graphQL parsing
  const gqlOpsString = tx.gqlOpsString();
  return {
    ops: gqlOpsString,
    signature: sigString,
  };
}

function createAssetsForCollectionMutationInputs({
  universeOwnerAccount,
  newAssetOwnerId,
  userNonce, universeIdx,
  propsJSON,
  metadataJSON,
  collectionId,
  numAssets,
}) {
  const opsString = createAssetOpForCollection({
    nonce: userNonce,
    ownerId: newAssetOwnerId,
    metadata: metadataJSON,
    props: propsJSON,
    collectionId,
    numAssets,
  });

  const tx = new AtomicAssetOps({ universeId: universeIdx });
  tx.push({ op: opsString });

  const sigString = tx.sign({ web3Account: universeOwnerAccount });

  const gqlOpsString = tx.gqlOpsString();
  return {
    ops: gqlOpsString,
    signature: sigString,
  };
}

// Returns the two main strings (ops and signature)
// to be used as inputs to Create Asset GraphQL mutation
// This function will be deprecated in future releases,
// please use the AtomicAssetOps class instead.
function updateAssetMutationInputs(
  {
    universeOwnerAccount, assetId, assetNonce, universeIdx, propsJSON, metadataJSON,
  },
) {
  /** *
    * This is the string that will be signed by the universe owner,
    * and registered with the underlying blockchain
    * `{
    *   "type":"set_asset_props",
    *   "msg":{
    *       "nonce":<assetNonce>,
    *       "id": "<assetId>",
    *       "props":"<updatedAssetProperties>",
    *       "metadata": "<assetMetadata>"
    *   }
    * }`
    */
  const opsString = updateAssetOp({
    nonce: assetNonce, assetId, metadata: metadataJSON, props: propsJSON,
  });

  // sign the operations string using the Eth universe owner account
  const tx = new AtomicAssetOps({ universeId: universeIdx });
  tx.push({ op: opsString });

  const sigString = tx.sign({ web3Account: universeOwnerAccount });

  // add more escape characters to embed the ops string into the query
  // this is necessary for correct graphQL parsing
  const gqlOpsString = tx.gqlOpsString();
  return {
    ops: gqlOpsString,
    signature: sigString,
  };
}

// Returns the digest of a receipt
// receipts have the following form:
// receipt = {
//     results: []string    an array with the unique Ids of the assets created
//     ops: []string        an array with the operations applied
//     universe: uint32     the universe Id where the ops are applied
//     signature: string    the signature provided as input to the query
//     verse: uint32        the verse at which ops will be synchronized with the Layer 1
// }
function receiptDigest({ receipt }) {
  let resultsStr = '';
  receipt.results.forEach((result) => { resultsStr += result; });
  let opsStr = '';
  receipt.ops.forEach((op) => { opsStr += op; });

  const digest = concatHash(
    ['string', 'string', 'uint32', 'string', 'uint32'],
    [resultsStr, opsStr, receipt.universe, receipt.signature, receipt.verse],
  );
  return digest;
}

// Example of signing function
// Any web3 compatible wallet/method can be used instead
function sign({ digest, web3Account }) {
  return web3Account.sign(digest).signature;
}

module.exports = {
  sign,
  digestImageUpload,
  digestListImages,
  digestCreateCollection,
  digestUpdateCollection,
  digestDropPriority,
  receiptDigest,
  createAssetMutationInputs,
  createAssetsForCollectionMutationInputs,
  updateAssetMutationInputs,
};
