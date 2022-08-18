const Utils = require('web3-utils');
const Abi = require('web3-eth-abi');

// Concats values in vals array, interpreting them as defined by the types array
// and hashes the result using keccak256
function concatHash(types, vals) {
  return Utils.keccak256(Abi.encodeParameters(types, vals));
}

// Removes '0x' from the start of a string, in case it exists
function remove0x(str) {
  if (str.substring(0, 2) === '0x') return str.substring(2);
  return str;
}

// Converts a JSON object to a string, cleans spaces and escapes required characters
function jsonToCleanString(inputJSON) {
  let jsonString = JSON.stringify(inputJSON);
  if (!inputJSON) return jsonString.replace(/"/g, '\\"');

  jsonString = jsonString.replace(/(\r\n|\n|\r)/gm, '').replace(/\\"/g, '\\\\\\"');
  const matches = jsonString.match(/[^\\]"/g);
  if (matches && matches.length) {
    matches.forEach((match) => {
      jsonString = jsonString.replace(match, `${match.charAt(0)}\\"`);
    });
  }
  return jsonString;
}

// Cleans ops string ready for GQL
function cleanOpsStringForGQL(opsString) {
  return opsString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// Returns the string that corresponds to a CreateAsset operation.
// It inserts escape characters that are necessary for correct parsing.
const createAssetOp = ({
  nonce, ownerId, metadata, props,
}) => (`{"type":"create_asset","msg":{"nonce":${nonce},"owner_id":"${ownerId}","props":"${jsonToCleanString(props)}","metadata":"${jsonToCleanString(metadata)}"}}`);

// Returns the string that corresponds to an UpdateAsset operation.
// It inserts escape characters that are necessary for correct parsing.
const updateAssetOp = ({
  nonce, assetId, metadata, props,
}) => (`{"type":"set_asset_props","msg":{"nonce":${nonce},"id":"${assetId}","props":"${jsonToCleanString(props)}","metadata":"${jsonToCleanString(metadata)}"}}`);

// Returns the signature of the digest of a set of operations.
function signExecuteMutation({ web3Account, universeIdx, opsStr }) {
  const digest = concatHash(
    ['uint32', 'string'],
    [universeIdx, opsStr],
  );
  const digestSignature = web3Account.sign(digest);
  return digestSignature;
}

module.exports = {
  createAssetOp,
  updateAssetOp,
  cleanOpsStringForGQL,
  concatHash,
  signExecuteMutation,
  remove0x,
  jsonToCleanString,
};
