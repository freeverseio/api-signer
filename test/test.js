const { assert } = require('chai');
const Web3 = require('web3');
const {
  signExecuteMutation,
  signImageUpload,
  signListImages,
  createAssetMutationInputs,
  createAssetMutation,
} = require('../src/ApiSigner');

it('signExecuteMutation - opsStr = empty', () => {
  const opsStr = '';
  const universeIdx = 0;
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x07a077de7b4dc56c5e8a686b081c269ee71da3bdd148e67f3be3f146b46617b54248c0ca51a4b9def97de763d28ad61736ef100bd8f03a0bac22e22ac74660241c';
  const sig = signExecuteMutation({ web3account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = {}', () => {
  const opsStr = '{}';
  const universeIdx = 0;
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x718ffe55edcc824d5ecb3dcf4c7b2eab70ac72100bfb7a9e9777da0af1f0bfe401d373451e5d843632bc785d711a7b3c6c67ae24c69d7ac7d12e884c536a288b1c';
  const sig = signExecuteMutation({ web3account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = {} - universe = 1', () => {
  const opsStr = '{}';
  const universeIdx = 1;
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0xa79f585886a011d2516083ed5b9b3af060ea4b637c0948d28ce9c80646ecbaa6615d8e6615679cf3510fbe0aa5e89cf5b45e2444076492b8a9a007f87271d8d71b';
  const sig = signExecuteMutation({ web3account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = {}{2}', () => {
  const opsStr = '{}{2}';
  const universeIdx = 1;
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x608f77d5e99d9ef47100532001d59da5e755aef402a9c939f265f98a01603fd57f6aa7b51b41eee1e3fe16862bbb822f4d80a982f077274d78967a652254f5391c';
  const sig = signExecuteMutation({ web3account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = complex', () => {
  const opsStr = '{"type":"create_asset","msg":{"nonce":6,"owner_id":"0x9f2F0826ABA274e55B6C69C46c4a9a6edB1f513E","props":"{\\"a\\":\\"bg\\"}","metadata":"{}"}}';
  const universeIdx = 0;
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0xd59137c200af36586f311d2508e06ec3179fe3bff0f7d66b21b9bd7c9cb518976d9cf3edd142a2dce924eb627e1821202ad6a8eaca9f22164f6a4e4bb4a62b571b';
  const sig = signExecuteMutation({ web3account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = complex v2', () => {
  const opsStr = '{"type":"set_asset_props","msg":{"nonce":3,"id":"10905121390242327112570837029394542234005750610646","props":"{\\"a\\":\\"bg\\"}"}}';
  const universeIdx = 0;
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x340960b6aaec852054adafc76f9efeed8ebca0c67790dc3c85856db300590ba9478a4d46bb3c3ed08ae043c8bef613f003fda13130452b2ee27e72ba12bc16151b';
  const sig = signExecuteMutation({ web3account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signImageUpload', () => {
  const universeIdx = 0;
  const fileHash = '0a72a75bbe43c1a11aa589eed5e7dce0196ec434cb370ab0b688b2f9a5439a04';
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');

  const expected = '0x8377d29dfaad044ef631b37e712eba47ddf6fd992e502cfa51eef42611dc24e25c047b986a3f444ab8f22c4ad65754729c95f88836561fa072cf25bd776014c71c';
  const sig = signImageUpload({ web3account: universeOwnerAccount, fileHash, universeIdx });
  assert.equal(sig.signature, expected);
});

it('signListImages', () => {
  const universeIdx = 0;
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');

  const expected = '0x722c33ad2cf10f5bd195c0504c9ae0ba91de07d779eacf34fa74d3f165b91c1e3ca505423a8c9d550d50ab9eb398d03b576232e43f69349bcc64b32baf1eb8161c';
  const sig = signListImages({ web3account: universeOwnerAccount, universeIdx });
  assert.equal(sig.signature, expected);
});

it('createAssetMutationInputs and createAssetMutation', () => {
  // universe owner private key and corresponding account:
  const universeOwnerPrivateKey = '0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54';
  const universeOwnerAccount = new Web3().eth.accounts.privateKeyToAccount(universeOwnerPrivateKey);
  // your universe id (obtained when signing up with Freeverse):
  const universeIdx = 1;

  // FreeverseID and nonce of user who will own this new asset:
  // (the Nonce can be obtained via the query 'usersUniverseByUserIdAndUniverseId')
  const ownerId = '0x8C146499db1685a522dE043d98092091dE2212DB';
  const userNonce = 1;

  // properties for asset
  const propsJSON = {
    name: 'Supercool Dragon',
    description: 'Legendary creature that loves fire.',
    image: 'ipfs://QmPAg1mjxcEQPPtqsLoEcauVedaeMH81WXDPvPx3VC5zUz',
    attributes: [
      {
        trait_type: 'Rarity',
        value: 'Scarce',
      },
      {
        trait_type: 'Level',
        value: 5,
      },
      {
        trait_type: 'Weight',
        value: 123.5,
      },
    ],
  };

  const metadataJSON = {};
  const { ops, signature } = createAssetMutationInputs({
    universeOwnerAccount,
    newAssetOwnerId: ownerId,
    userNonce,
    universeIdx,
    propsJSON,
    metadataJSON,
  });
  assert.equal(ops, '{\\"type\\":\\"create_asset\\",\\"msg\\":{\\"nonce\\":1,\\"owner_id\\":\\"0x8C146499db1685a522dE043d98092091dE2212DB\\",\\"props\\":\\"{\\\\\\"name\\\\\\":\\\\\\"Supercool Dragon\\\\\\",\\\\\\"description\\\\\\":\\\\\\"Legendary creature that loves fire.\\\\\\",\\\\\\"image\\\\\\":\\\\\\"ipfs://QmPAg1mjxcEQPPtqsLoEcauVedaeMH81WXDPvPx3VC5zUz\\\\\\",\\\\\\"attributes\\\\\\":[{\\\\\\"trait_type\\\\\\":\\\\\\"Rarity\\\\\\",\\\\\\"value\\\\\\":\\\\\\"Scarce\\\\\\"},{\\\\\\"trait_type\\\\\\":\\\\\\"Level\\\\\\",\\\\\\"value\\\\\\":5},{\\\\\\"trait_type\\\\\\":\\\\\\"Weight\\\\\\",\\\\\\"value\\\\\\":123.5}]}\\",\\"metadata\\":\\"{}\\"}}');
  assert.equal(signature, '5b2df111532422e187df5bd538fdb0b2d8380e7bf78fe622b020e8c3813ad09f560feeba45931c921c02b4938e5280c40780e7e64a8b1c01a6cf40e025e5af691c');

  const mutation = createAssetMutation({
    universeOwnerAccount,
    newAssetOwnerId: ownerId,
    userNonce,
    universeIdx,
    propsJSON,
    metadataJSON,
  });
  assert.equal(
    mutation,
    `
    mutation {
        execute(
            input: {
              ops: ["${ops}"],
              signature: "${signature}",
              universe: ${universeIdx},
            }){
              results
            }}
    `,
  );
});
