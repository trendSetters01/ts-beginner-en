import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { DaoClient } from '../contracts/clients/DaoClient';
import * as algokit from '@algorandfoundation/algokit-utils';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: DaoClient;

describe('Dao', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algod, testAccount } = fixture.context;

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

  test('vote & getVotes', async () => {
    await appClient.vote({ inFavor: true });

    const votesAfter = await appClient.getVotes({});

    expect(votesAfter.return?.valueOf()).toEqual([BigInt(1), BigInt(1)]);
   
    await appClient.vote({ inFavor: false });

    const votesAfter2 = await appClient.getVotes({});

    expect(votesAfter2.return?.valueOf()).toEqual([BigInt(1), BigInt(2)]);
  });
});
