import { IProposal } from '../atoms/Proposal/proposal.types.ts';

export interface IHomeProps {}

export interface ISocial {
  name: string;
  link: string;
  icon: React.ReactElement;
}

const proposalListRegex =
  /-\s\[(\d+)\]\(\/r\/gov\/dao:\d+\)\s-\s(.+?)\s\(\*\*(.+?)\*\*\)\(by\s(.+?)\)/g;

export const parseRenderResponse = (response: string): IProposal[] => {
  const matches = response.matchAll(proposalListRegex);

  const proposals: IProposal[] = [];
  for (const match of matches) {
    const [, index, comment, status, author] = match;

    console.log(
      `Index: ${index}, Comment: ${comment}, Status: ${status}, Author: ${author}`
    );

    proposals.push({
      id: parseInt(index),
      description: comment,
      status,
      author
    });
  }

  return proposals;
};
