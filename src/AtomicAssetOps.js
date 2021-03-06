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
  concatHash, cleanOpsStringForGQL, remove0x,
} = require('./Utils');

// Class to build queries required to create and update assets
// with option to process multiple such commands in one single atomic call
class AtomicAssetOps {
  constructor({ universeId }) {
    this.universe = universeId;
    this.ops = [];
  }

  // adds one new operation create/update to the batch
  push({ op }) {
    this.ops.push(op);
  }

  // builds the digest that will need to be signed
  digest() {
    let s = '';
    this.ops.forEach((op) => { s += op; });
    return concatHash(['uint32', 'string'], [this.universe, s]);
  }

  // signs the digest, the signature needs to be sent in the query
  sign({ web3Account }) {
    return remove0x(web3Account.sign(this.digest()).signature);
  }

  // Concats all commands, and returns the string
  // that needs to be provided in ops field of the graphQL mutation
  gqlOpsString() {
    let s = '';
    this.ops.forEach((op) => { s += `"${cleanOpsStringForGQL(op)}",`; });
    // remove the last ","
    return s.slice(0, -1);
  }

  // Returns the full graphQL mutation
  mutation({ signature }) {
    const gqlOps = this.gqlOpsString();

    return `mutation {
    execute(
      input: {
        ops: [${gqlOps}],
        signature: "${remove0x(signature)}",
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
};
