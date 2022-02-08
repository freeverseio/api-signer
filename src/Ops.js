const Utils = require('web3-utils');
const Abi = require('web3-eth-abi');

function jsonToCleanString(inputJSON) {
  let jsonString = JSON.stringify(inputJSON);
  jsonString = jsonString.replace(/(\r\n|\n|\r)/gm, '').replace(/"/g, '\\"');
  return jsonString;
}

// Cleans ops string ready for GQL
function cleanOpsStringForGQL(opsString) {
  return opsString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const createAsset = ({
  nonce, ownerId, metadata, props,
}) => (`{"type":"create_asset","msg":{"nonce":${nonce},"owner_id":"${ownerId}","metadata":"${jsonToCleanString(metadata)}","props":"${jsonToCleanString(props)}"}}`);

class Tx {
  constructor(universeId) {
    this.universe = universeId;
    this.ops = [];
  }

  push(op) {
    this.ops.push(op);
  }

  hash() {
    let ops = '';
    for (let i = 0; i < this.ops.length; i += 1) {
      ops += this.ops[i];
    }
    return Utils.keccak256(Abi.encodeParameters(['uint32', 'string'], [this.universe, ops]));
  }

  sign(web3Account) {
    return web3Account.sign(this.hash()).signature.substring(2);
  }

  mutation(web3Account) {
    let s = '[';
    for (let i = 0; i < this.ops.length; i += 1) {
      s += '"';
      s += cleanOpsStringForGQL(this.ops[i]);
      s += '",';
    }
    s += ']';

    return `mutation {
    execute(
      input: {
        ops: ${s},
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
  Tx,
  createAsset,
};