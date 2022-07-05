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
  createAssetOp, updateAssetOp, concatHash,
} = require('./Utils');

const { AtomicAssetOps } = require('./AtomicAssetOps');

// Creates the digest to upload an image and returns the signature of the digest.
function signImageUpload({ web3Account, fileHash, universeIdx }) {
  const digest = concatHash(
    ['string', 'uint32'],
    [fileHash, universeIdx],
  );
  const digestSignature = web3Account.sign(digest);
  return digestSignature;
}

// Creates the digest to query the list of available images in a universe,
// and returns the signature of the digest.
function signListImages({ web3Account, universeIdx }) {
  const digest = concatHash(['uint32'], [universeIdx]);
  const digestSignature = web3Account.sign(digest);
  return digestSignature;
}

function signDropPriority({ web3Account, assetId, priority }) {
  const digest = concatHash(
    ['uint32', 'string'],
    [priority, assetId],
  );
  const digestSignature = web3Account.sign(digest);
  return digestSignature;
}

function signCreateCollection({ web3account, name }) {
  const digest = concatHash(['string'], [name]);
  const digestSignature = web3account.sign(digest);
  return digestSignature;
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

module.exports = {
  signImageUpload,
  signListImages,
  signCreateCollection,
  createAssetMutationInputs,
  updateAssetMutationInputs,
  signDropPriority,
};
