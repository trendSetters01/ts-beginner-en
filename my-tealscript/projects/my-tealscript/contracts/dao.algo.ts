import { Contract } from '@algorandfoundation/tealscript';

// eslint-disable-next-line no-unused-vars
class Dao extends Contract {
  proposal = GlobalStateKey<string>();

  votesTotal = GlobalStateKey<uint64>();

  votesInFavor = GlobalStateKey<uint64>();

  registeredASA = GlobalStateKey<AssetID>();

  // define a proposl
  createApplication(proposal: string): void {
    this.proposal.value = proposal;
  }

  //mint dao token
  bootstrap(): AssetID {
    verifyTxn(this.txn, { sender: this.app.creator });
    assert(!this.registeredASA.exists);
    const registeredASA = sendAssetCreation({
      configAssetTotal: 1_000,
      configAssetFreeze: this.app.address,
    });

    this.registeredASA.value = registeredASA;

    return registeredASA;
  }

  vote(inFavor: boolean): void {
    this.votesTotal.value = this.votesTotal.value + 1;

    if (inFavor) {
      this.votesInFavor.value = this.votesInFavor.value + 1;
    }
  }

  getProposal(): string {
    return this.proposal.value;
  }

  getRegisteredASA(): AssetID {
    return this.registeredASA.value;
  }

  getVotes(): [uint64, uint64] {
    return [this.votesInFavor.value, this.votesTotal.value];
  }
}
