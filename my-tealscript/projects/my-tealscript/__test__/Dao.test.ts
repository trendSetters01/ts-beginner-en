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

describe('Dao', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algod, testAccount, kmd } = fixture.context;

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

  test('getRegisteredASA', async () => {
    const getRegisteredFromMethod = await appClient.getRegisteredAsa({});
    console.log('typeof RegisteredASA', typeof registeredASA);
    expect(getRegisteredFromMethod.return?.valueOf()).toBe(registeredASA);
  });

  test('boostrap (Negative)', async () => {
    await appClient.appClient.fundAppAccount(algokit.microAlgos(200_000));
    await expect(appClient.bootstrap({}, { sender, sendParams: { fee: algokit.microAlgos(2_000) } })).rejects.toThrow();
  });

  test('vote & getVotes', async () => {
    await appClient.vote({ inFavor: true });

    const votesAfter = await appClient.getVotes({});

    expect(votesAfter.return?.valueOf()).toEqual([BigInt(1), BigInt(1)]);

    await appClient.vote({ inFavor: false });

    const votesAfter2 = await appClient.getVotes({});

    expect(votesAfter2.return?.valueOf()).toEqual([BigInt(1), BigInt(2)]);
  });
});
