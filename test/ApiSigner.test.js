const { assert } = require('chai');
const Abi = require('web3-eth-abi');
const Accounts = require('web3-eth-accounts');
const { ethers } = require('ethers');

const {
  signImageUpload,
  signListImages,
  createAssetMutationInputs,
  updateAssetMutationInputs,
  signDropPriority,
  signCreateCollection,
  signUpdateCollection,
  receiptDigest,
} = require('../src/ApiSigner');
const {
  signExecuteMutation,
} = require('../src/Utils');

it('encoding as strings using web3 library', () => {
  assert.equal(Abi.encodeParameters(['string'], ['']), '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000');
  assert.equal(Abi.encodeParameters(['string'], ['0']), '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000000');
  assert.equal(Abi.encodeParameters(['string'], ['{}}']), '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000037b7d7d0000000000000000000000000000000000000000000000000000000000');
});

it('signExecuteMutation - opsStr = empty', () => {
  const opsStr = '';
  const universeIdx = 0;
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x07a077de7b4dc56c5e8a686b081c269ee71da3bdd148e67f3be3f146b46617b54248c0ca51a4b9def97de763d28ad61736ef100bd8f03a0bac22e22ac74660241c';
  const sig = signExecuteMutation({ web3Account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = {}', () => {
  const opsStr = '{}';
  const universeIdx = 0;
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x718ffe55edcc824d5ecb3dcf4c7b2eab70ac72100bfb7a9e9777da0af1f0bfe401d373451e5d843632bc785d711a7b3c6c67ae24c69d7ac7d12e884c536a288b1c';
  const sig = signExecuteMutation({ web3Account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = {} - universe = 1', () => {
  const opsStr = '{}';
  const universeIdx = 1;
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0xa79f585886a011d2516083ed5b9b3af060ea4b637c0948d28ce9c80646ecbaa6615d8e6615679cf3510fbe0aa5e89cf5b45e2444076492b8a9a007f87271d8d71b';
  const sig = signExecuteMutation({ web3Account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = {}{2}', () => {
  const opsStr = '{}{2}';
  const universeIdx = 1;
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x608f77d5e99d9ef47100532001d59da5e755aef402a9c939f265f98a01603fd57f6aa7b51b41eee1e3fe16862bbb822f4d80a982f077274d78967a652254f5391c';
  const sig = signExecuteMutation({ web3Account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = complex', () => {
  const opsStr = '{"type":"create_asset","msg":{"nonce":6,"owner_id":"0x9f2F0826ABA274e55B6C69C46c4a9a6edB1f513E","props":"{\\"a\\":\\"bg\\"}","metadata":"{}"}}';
  const universeIdx = 0;
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0xd59137c200af36586f311d2508e06ec3179fe3bff0f7d66b21b9bd7c9cb518976d9cf3edd142a2dce924eb627e1821202ad6a8eaca9f22164f6a4e4bb4a62b571b';
  const sig = signExecuteMutation({ web3Account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signExecuteMutation - opsStr = complex v2', () => {
  const opsStr = '{"type":"set_asset_props","msg":{"nonce":3,"id":"10905121390242327112570837029394542234005750610646","props":"{\\"a\\":\\"bg\\"}"}}';
  const universeIdx = 0;
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x340960b6aaec852054adafc76f9efeed8ebca0c67790dc3c85856db300590ba9478a4d46bb3c3ed08ae043c8bef613f003fda13130452b2ee27e72ba12bc16151b';
  const sig = signExecuteMutation({ web3Account: universeOwnerAccount, universeIdx, opsStr });
  assert.equal(sig.signature, expected);
});

it('signImageUpload', () => {
  const universeIdx = 0;
  const fileHash = '0a72a75bbe43c1a11aa589eed5e7dce0196ec434cb370ab0b688b2f9a5439a04';
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');

  const expected = '0x8377d29dfaad044ef631b37e712eba47ddf6fd992e502cfa51eef42611dc24e25c047b986a3f444ab8f22c4ad65754729c95f88836561fa072cf25bd776014c71c';
  const sig = signImageUpload({ web3Account: universeOwnerAccount, fileHash, universeIdx });
  assert.equal(sig.signature, expected);
});

it('signListImages', () => {
  const universeIdx = 0;
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');

  const expected = '0x722c33ad2cf10f5bd195c0504c9ae0ba91de07d779eacf34fa74d3f165b91c1e3ca505423a8c9d550d50ab9eb398d03b576232e43f69349bcc64b32baf1eb8161c';
  const sig = signListImages({ web3Account: universeOwnerAccount, universeIdx });
  assert.equal(sig.signature, expected);
});

it('signDropPriority', () => {
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');

  const expected = '0x676993a0064a55464a62f2a356433020b7e4eac1b47c86172b88e0a15433530e44c23ffbfec00df67bbbf57fe53e9c0c368cee9555617e6f1478c2c3ce32c1261b';
  const sig = signDropPriority({
    web3Account: universeOwnerAccount,
    assetId: '269599466671506397947685068811903227002082778120854472900238839975913',
    priority: 42,
  });
  assert.equal(sig.signature, expected);
});

it(' should create signature for CreateCollection', () => {
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0xaa962dd18976c6ad786de97e063d46a4151848157c060364094f840e9dab5f2912bdf15827c62b7b26574e9510dd511cb27b49a86dc82b559b1e177df063263c1c';
  const sig = signCreateCollection({
    web3Account: universeOwnerAccount,
    universeId: 0,
    collectionId: 1,
  });
  assert.equal(sig.signature, expected);
});

it(' should create signature for UpdateCollection', () => {
  const universeOwnerAccount = new Accounts().privateKeyToAccount('0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54');
  const expected = '0x228728852b54eee075159b11340d7dae41c2eb927526ed045ebd9d2f3d33ba451e136424986ad7707f82dafb5b48e993c3e3044cd8e0edad2f00ab80f46c93ef1b';
  const sig = signUpdateCollection({
    web3Account: universeOwnerAccount,
    name: 'Test 1234',
    universeId: 0,
    collectionId: 2,
    description: 'description',
    imageUrl: '',
    nonce: 1,
  });
  assert.equal(sig.signature, expected);
});

it('should calculate the digest for receipt', () => {
  const expected = '0xac640bc7f348edc0b7a2540b0ba5c0edd4f79bf6dce7df70922ec24ac3f01ea5';
  const receipt = {
    results: ['{"result":"success"}'],
    ops: ['{}', '{2}'],
    universeId: 1,
    signature: '608f77d5e99d9ef47100532001d59da5e755aef402a9c939f265f98a01603fd57f6aa7b51b41eee1e3fe16862bbb822f4d80a982f077274d78967a652254f5391c',
    verse: 1,
  };
  const digest = receiptDigest({ receipt });
  assert.equal(digest, expected);
});

it('should create signature for receipt', () => {
  const relayerAccount = new Accounts().privateKeyToAccount('0x51897b64e85c3f714bba707e867914295a1377a7463a9dae8ea6a8b914246319');
  const expectedAddress = '0xc1C634795835096143561aBE1AFbB3c31109a7BC';
  assert.equal(relayerAccount.address, expectedAddress);
  const expectedSig = '0x3aa5a1390e79668331eb92842168d88cdbd94a484a31c4b79fce60a377bbdacc4ce18b5376b72e87a64661cc98e51359b1f42e8ec5ccdff60274b6690b0211ec1c';
  const receipt = {
    results: ['{"result":"success"}'],
    ops: ['{}', '{2}'],
    universeId: 1,
    signature: '608f77d5e99d9ef47100532001d59da5e755aef402a9c939f265f98a01603fd57f6aa7b51b41eee1e3fe16862bbb822f4d80a982f077274d78967a652254f5391c',
    verse: 1,
  };
  const digest = receiptDigest({ receipt });
  const sig = relayerAccount.sign(digest);

  assert.equal(sig.signature, expectedSig);

  const recoveredAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(digest), sig);
  assert.equal(recoveredAddress, expectedAddress);
});

it('createAssetMutationInputs', () => {
  // universe owner private key and corresponding account:
  const universeOwnerPrivateKey = '0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54';
  const universeOwnerAccount = new Accounts().privateKeyToAccount(universeOwnerPrivateKey);
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

  const metadataJSON = {
    userIDInMyServer: 21323543,
  };
  const { ops, signature } = createAssetMutationInputs({
    universeOwnerAccount,
    newAssetOwnerId: ownerId,
    userNonce,
    universeIdx,
    propsJSON,
    metadataJSON,
  });
  assert.equal(ops, '"{\\"type\\":\\"create_asset\\",\\"msg\\":{\\"nonce\\":1,\\"owner_id\\":\\"0x8C146499db1685a522dE043d98092091dE2212DB\\",\\"props\\":\\"{\\\\\\"name\\\\\\":\\\\\\"Supercool Dragon\\\\\\",\\\\\\"description\\\\\\":\\\\\\"Legendary creature that loves fire.\\\\\\",\\\\\\"image\\\\\\":\\\\\\"ipfs://QmPAg1mjxcEQPPtqsLoEcauVedaeMH81WXDPvPx3VC5zUz\\\\\\",\\\\\\"attributes\\\\\\":[{\\\\\\"trait_type\\\\\\":\\\\\\"Rarity\\\\\\",\\\\\\"value\\\\\\":\\\\\\"Scarce\\\\\\"},{\\\\\\"trait_type\\\\\\":\\\\\\"Level\\\\\\",\\\\\\"value\\\\\\":5},{\\\\\\"trait_type\\\\\\":\\\\\\"Weight\\\\\\",\\\\\\"value\\\\\\":123.5}]}\\",\\"metadata\\":\\"{\\\\\\"userIDInMyServer\\\\\\":21323543}\\"}}"');
  assert.equal(signature, '35fdf0b60bc9af271191448dfb12c49fc8b3b7aa93173cb9fd772f39ed3860ad68bf8209384613508930d5dc76ab9f01c08a8fc9586c1cdc681f5832b6805e171b');
});

it('updateAssetMutationInputs', () => {
  // universe owner private key and corresponding account:
  const universeOwnerPrivateKey = '0x3B878F7892FBBFA30C8AED1DF317C19B853685E707C2CF0EE1927DC516060A54';
  const universeOwnerAccount = new Accounts().privateKeyToAccount(universeOwnerPrivateKey);
  // your universe id (obtained when signing up with Freeverse):
  const universeIdx = 1;

  // FreeverseID and nonce of user who will own this new asset:
  // (the Nonce can be obtained via the query 'usersUniverseByUserIdAndUniverseId')
  const assetId = '90847538263667479732701940699204516337978725433575';
  const assetNonce = 3;

  // updated properties for asset
  const newPropsJSON = {
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

  const metadataJSON = {
    userIDInMyServer: 21323543,
  };
  const { ops, signature } = updateAssetMutationInputs({
    universeOwnerAccount,
    assetId,
    assetNonce,
    universeIdx,
    propsJSON: newPropsJSON,
    metadataJSON,
  });
  assert.equal(ops, '"{\\"type\\":\\"set_asset_props\\",\\"msg\\":{\\"nonce\\":3,\\"id\\":\\"90847538263667479732701940699204516337978725433575\\",\\"props\\":\\"{\\\\\\"name\\\\\\":\\\\\\"Supercool Dragon\\\\\\",\\\\\\"description\\\\\\":\\\\\\"Legendary creature that loves fire.\\\\\\",\\\\\\"image\\\\\\":\\\\\\"ipfs://QmPAg1mjxcEQPPtqsLoEcauVedaeMH81WXDPvPx3VC5zUz\\\\\\",\\\\\\"attributes\\\\\\":[{\\\\\\"trait_type\\\\\\":\\\\\\"Rarity\\\\\\",\\\\\\"value\\\\\\":\\\\\\"Scarce\\\\\\"},{\\\\\\"trait_type\\\\\\":\\\\\\"Level\\\\\\",\\\\\\"value\\\\\\":5},{\\\\\\"trait_type\\\\\\":\\\\\\"Weight\\\\\\",\\\\\\"value\\\\\\":123.5}]}\\",\\"metadata\\":\\"{\\\\\\"userIDInMyServer\\\\\\":21323543}\\"}}"');
  assert.equal(signature, '8fe897a0b60c2f088a99b754bfa8e879700810f0c432567c1756aa55200056c86637f4486b39ac5d27e136c68870ba6ee9c95e0839d6fd15b10acf0499e55d361b');
});
