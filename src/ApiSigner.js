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

const Web3 = require('web3');

// Concats values in vals array, interpreting them as defined by the types array
// and hashes the result using keccak256
function concatHash(types, vals) {
  const web3 = new Web3();
  return web3.utils.keccak256(web3.eth.abi.encodeParameters(types, vals));
}

// Creates the digest to execute an opsStr and returns the signature of the digest.
function signExecuteMutation({ web3account, universeIdx, opsStr }) {
  const digest = concatHash(
    ['uint32', 'string'],
    [universeIdx, opsStr],
  );
  const digestSignature = web3account.sign(digest);
  return digestSignature;
}

// Creates the digest to upload an image and returns the signature of the digest.
function signImageUpload({ web3account, fileHash, universeIdx }) {
  const digest = concatHash(
    ['string', 'uint32'],
    [fileHash, universeIdx],
  );
  const digestSignature = web3account.sign(digest);
  return digestSignature;
}

// Creates the digest to query the list of available images in a universe,
// and returns the signature of the digest.
function signListImages({ web3account, universeIdx }) {
  const digest = concatHash(['uint32'], [universeIdx]);
  const digestSignature = web3account.sign(digest);
  return digestSignature;
}

module.exports = {
  signExecuteMutation,
  signImageUpload,
  signListImages,
};
