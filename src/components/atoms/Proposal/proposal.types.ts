import { parsedJSONOrRaw } from '../../organisms/home.types.ts';

export interface IProposalProps {
  id: number;
  proposal: IProposal;
}

export interface IProposalsResponse {
  proposals: IProposal[];
  total: number;
}

export interface IProposal {
  author: string;
  description: string;
  status: string;
  stats: IStats;
  is_expired: boolean;
}

export interface IStats {
  yay_votes: number;
  nay_votes: number;
  abstain_votes: number;
  total_voting_power: number;
}

export const parseVotingStatus = (response: string): IStats => {
  const proposal = parsedJSONOrRaw<IProposal>(response);

  return proposal.stats;
};
