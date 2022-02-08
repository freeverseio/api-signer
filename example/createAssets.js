/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

const program = require('commander');
const Accounts = require('web3-eth-accounts');
const fetch = require('isomorphic-fetch');
const { createAsset, AtomicAssetOps } = require('../src/Ops');

program
  .requiredOption('-p, --pvk <hex>')
  .requiredOption('-u, --universe <int>')
  .requiredOption('-a, --api <url>')
  .option('-n, --number <int>', '', 500)
  .parse(process.argv);

const opts = program.opts();
Object.keys(opts).forEach((key) => console.log(`${key}: ${opts[key]}`));

const {
  pvk, universe, api, number,
} = program.opts();

// const pvk = '0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54';
const account = new Accounts().privateKeyToAccount(pvk);

console.log(account.address);

async function getUserServerNonce(freeverseId, id) {
  const getNonceQuery = `
        query($freeverseId: String!, $universe: Int!) {
            usersUniverseByUserIdAndUniverseId(universeId: $universe, userId: $freeverseId){
              nonce
            }
          }
        `;

  const response = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: getNonceQuery,
      variables: {
        freeverseId,
        universe: +id,
      },
    }),
  });
  const result = await response.json();
  return result.data.usersUniverseByUserIdAndUniverseId.nonce;
}

(async () => {
  const nonce = await getUserServerNonce(account.address, universe);

  const tx = new AtomicAssetOps({ universeId: 0 });
  for (let i = 0; i < number; i += 1) {
    tx.push({
      op: createAsset({
        nonce: nonce + i,
        ownerId: account.address,
        metadata: {},
        props: {
          name: `Dragon ${nonce + i}`,
          image: 'ipfs://QmNfpD4rAHAE737hkMhJoRs9Cs9HkbfVjrkw2Hn2yGd1i3',
        },
      }),
    });
  }
  const mutation = tx.mutation({ web3Account: account });
  await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: mutation,
    }),
  }).then((response) => response.json())
    .then(console.log)
    .catch(console.error);
}
)();
