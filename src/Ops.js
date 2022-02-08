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

class AtomicAssetOps {
  constructor({ universeId }) {
    this.universe = universeId;
    this.ops = [];
  }

  push(op) {
    this.ops.push(op);
  }

  digest() {
    let ops = '';
    for (let i = 0; i < this.ops.length; i += 1) {
      ops += this.ops[i];
    }
    return concatHash(['uint32', 'string'], [this.universe, ops]);
  }

  sign(web3Account) {
    // remove the initial "0x" from the signature
    return web3Account.sign(this.digest()).signature.substring(2);
  }

  gqlOpsString() {
    let s = '';
    this.ops.forEach((op) => { s += `"${cleanOpsStringForGQL(op)}",`; });
    // remove the last ","
    return s.slice(0, -1);
  }

  mutation(web3Account) {
    const gqlOps = this.gqlOpsString();

    return `mutation {
    execute(
      input: {
        ops: [${gqlOps}],
        signature: "${this.sign(web3Account)}",
        universe: ${this.universe},
      }
    )
    {
      results
    }
  }`;
  }
}

module.exports = {
  AtomicAssetOps,
  createAssetString,
  updateAssetString,
  concatHash,
};
