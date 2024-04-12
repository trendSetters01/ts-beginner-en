import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { DaoClient } from '../contracts/clients/DaoClient';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: DaoClient;
let sender: any;
let registeredASA: any;
let algods: any;
describe('Dao', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algod, testAccount, kmd } = fixture.context;
    algods = algod;
    sender = await algokit.getOrCreateKmdWalletAccount(
      {
        name: 'teaslscript-dao-sender',
        fundWith: algokit.algos(10),
      },
      algod,
      kmd
    );

    appClient = new DaoClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await appClient.create.createApplication({ proposal: 'This is a proposal' });
  });

  test('getProposal', async () => {
    const getProposalFromMethod = await appClient.getProposal({});
    expect(getProposalFromMethod.return?.valueOf()).toBe('This is a proposal');
  });

  test('boostrap', async () => {
    await appClient.appClient.fundAppAccount(algokit.microAlgos(200_000));
    const bootstrapResult = await appClient.bootstrap({}, { sendParams: { fee: algokit.microAlgos(2_000) } });
    registeredASA = bootstrapResult.return?.valueOf();
    console.log(registeredASA);
  });

  test('vote (Negative)', async () => {
    try {
      await expect(appClient.vote({ inFavor: true, registeredASA })).rejects.toThrow();
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  test('getRegisteredASA', async () => {
    const getRegisteredFromMethod = await appClient.getRegisteredAsa({});
    console.log('typeof RegisteredASA', typeof registeredASA);
    expect(getRegisteredFromMethod.return?.valueOf()).toBe(registeredASA);
  });

  test('register', async () => {
    try {
      const registeredASAOptInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        to: sender.addr,
        amount: 0,
        suggestedParams: await algokit.getTransactionParams(undefined, algods),
        assetIndex: Number(registeredASA),
      });

      await algokit.sendTransaction({ from: sender, transaction: registeredASAOptInTxn }, algods);

      await appClient.register({ registeredASA }, { sender, sendParams: { fee: algokit.microAlgos(3_000) } });

      const registerASATransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        to: sender.addr,
        amount: 1,
        suggestedParams: await algokit.getTransactionParams(undefined, algods),
        assetIndex: Number(registeredASA),
      });
      await expect(
        algokit.sendTransaction({ from: sender, transaction: registerASATransferTxn }, algods)
      ).rejects.toThrow();
    } catch (error) {
      console.log('EEEEEEEEE', error);
      throw error;
    }
  });

  test('boostrap (Negative)', async () => {
    await appClient.appClient.fundAppAccount(algokit.microAlgos(200_000));
    await expect(appClient.bootstrap({}, { sender, sendParams: { fee: algokit.microAlgos(2_000) } })).rejects.toThrow();
  });

  test.skip('vote & getVotes', async () => {
    await appClient.vote({ inFavor: true, registeredASA });

    const votesAfter = await appClient.getVotes({});

    expect(votesAfter.return?.valueOf()).toEqual([BigInt(1), BigInt(1)]);

    await appClient.vote({ inFavor: false, registeredASA });

    const votesAfter2 = await appClient.getVotes({});

    expect(votesAfter2.return?.valueOf()).toEqual([BigInt(1), BigInt(2)]);
  });
});
