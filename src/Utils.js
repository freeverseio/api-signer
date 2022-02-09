const Utils = require('web3-utils');
const Abi = require('web3-eth-abi');

// Concats values in vals array, interpreting them as defined by the types array
// and hashes the result using keccak256
function concatHash(types, vals) {
  return Utils.keccak256(Abi.encodeParameters(types, vals));
}

// Converts a JSON object to a string, cleans spaces and escapes required characters
function jsonToCleanString(inputJSON) {
  let jsonString = JSON.stringify(inputJSON);
  jsonString = jsonString.replace(/(\r\n|\n|\r)/gm, '').replace(/"/g, '\\"');
  return jsonString;
}

// Cleans ops string ready for GQL
function cleanOpsStringForGQL(opsString) {
  return opsString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// insert escape characters into metadata and props strings. This is necessary
// for correct parsing of the properties and metadata
const createAssetString = ({
  nonce, ownerId, metadata, props,
}) => (`{"type":"create_asset","msg":{"nonce":${nonce},"owner_id":"${ownerId}","props":"${jsonToCleanString(props)}","metadata":"${jsonToCleanString(metadata)}"}}`);

// insert escape characters into metadata and props strings. This is necessary
// for correct parsing of the properties and metadata
const updateAssetString = ({
  nonce, assetId, metadata, props,
}) => (`{"type":"set_asset_props","msg":{"nonce":${nonce},"id":"${assetId}","props":"${jsonToCleanString(props)}","metadata":"${jsonToCleanString(metadata)}"}}`);

function signExecuteMutation({ web3Account, universeIdx, opsStr }) {
  const digest = concatHash(
    ['uint32', 'string'],
    [universeIdx, opsStr],
  );
  const digestSignature = web3Account.sign(digest);
  return digestSignature;
}
module.exports = {
  createAssetString,
  updateAssetString,
  cleanOpsStringForGQL,
  concatHash,
  signExecuteMutation,
};