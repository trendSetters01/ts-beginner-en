import { Contract } from '@algorandfoundation/tealscript';

// eslint-disable-next-line no-unused-vars
class Dao extends Contract {
  proposal = GlobalStateKey<string>();

  votesTotal = GlobalStateKey<uint64>();

  votesInFavor = GlobalStateKey<uint64>();

  // define a proposl
  createApplication(proposal: string): void {
    this.proposal.value = proposal;
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

  getVotes(): [uint64, uint64] {
    return [this.votesInFavor.value,this.votesTotal.value];
  }

}
