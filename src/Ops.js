const {
  createAssetString, updateAssetString, concatHash, cleanOpsStringForGQL,
} = require('./Utils');

class AtomicAssetOps {
  constructor({ universeId }) {
    this.universe = universeId;
    this.ops = [];
  }

  push({ op }) {
    this.ops.push(op);
  }

  digest() {
    let ops = '';
    for (let i = 0; i < this.ops.length; i += 1) {
      ops += this.ops[i];
    }
    return concatHash(['uint32', 'string'], [this.universe, ops]);
  }

  sign({ web3Account }) {
    // remove the initial "0x" from the signature
    return web3Account.sign(this.digest()).signature.substring(2);
  }

  gqlOpsString() {
    let s = '';
    this.ops.forEach((op) => { s += `"${cleanOpsStringForGQL(op)}",`; });
    // remove the last ","
    return s.slice(0, -1);
  }

  mutation({ web3Account }) {
    const gqlOps = this.gqlOpsString();

    return `mutation {
    execute(
      input: {
        ops: [${gqlOps}],
        signature: "${this.sign({ web3Account })}",
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
