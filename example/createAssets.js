const Accounts = require('web3-eth-accounts');
const fetch = require('isomorphic-fetch');
const { createAsset, Tx } = require('./src/Ops');

const pvk = '0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54';
const account = new Accounts().privateKeyToAccount(pvk);
console.log(account.address);

// let ops = [
//   createAsset({
//     nonce: 0, ownerId: '', metadata: '', props: {},
//   }),
//   // createAsset({ nonce: 0, ownerId: '', metadata: '', props: {} }),
//   // createAsset({ nonce: 0, ownerId: '', metadata: '', props: {} }),
//   // createAsset({ nonce: 0, ownerId: '', metadata: '', props: {} }),
//   // createAsset({ nonce: 0, ownerId: '', metadata: '', props: {} }),
//   // createAsset({ nonce: 0, ownerId: '', metadata: '', props: {} }),
//   // createAsset({ nonce: 0, ownerId: '', metadata: '', props: {} }),
//   // createAsset({ nonce: 0, ownerId: '', metadata: '', props: {} }),
//   // createAsset({ nonce: 0, ownerId: '', metadata: '', props: {} }),
// ];

// console.log(mutation);

(async () => { // for (let nonce = 22569; nonce < 30000; ) {
  //   console.log(nonce)

  for (let nonce = 1000069; nonce < 10000000;) {
    const tx = new Tx(0);
    for (let i = 0; i < 500; i += 1) {
      tx.push(createAsset({
        nonce, ownerId: '0x291081e5a1bF0b9dF6633e4868C88e1FA48900e7', metadata: {}, props: {},
      }));
      nonce++;
    }
    const mutation = tx.mutation(account);
    const a = fetch('https://api.blackhole.gorengine.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: mutation,
      }),
    }).then((response) => response.json())
      .then(console.log)
      .catch(console.error);
    await a;
  }
})();

// }
