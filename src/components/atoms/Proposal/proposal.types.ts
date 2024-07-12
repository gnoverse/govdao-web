export interface IProposalProps {
  proposal: IProposal;
}

export interface IProposal {
  id: number;
  status: string;
  description: string;
  author: string;
}

export interface IProposalVotes {
  yes: number;
  no: number;
  percent: number;
  members: number;
}

const votingStatusRegex =
  /Voting status: YES: (\d+), NO: (\d+), percent: (\d+), members: (\d+)/g;

export const parseVotingStatus = (response: string): IProposalVotes => {
  const matches = response.matchAll(votingStatusRegex);

  for (const match of matches) {
    const [, yesCount, noCount, percent, membersCount] = match;

    return {
      yes: parseInt(yesCount),
      no: parseInt(noCount),
      percent: parseInt(percent),
      members: parseInt(membersCount)
    };
  }

  throw new Error('invalid detailed proposal render');
};
