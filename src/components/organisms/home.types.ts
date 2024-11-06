import {
  IProposal,
  IProposalsResponse
} from '../atoms/Proposal/proposal.types.ts';

export interface IHomeProps {}

export interface ISocial {
  name: string;
  link: string;
  icon: React.ReactElement;
}

export const parseRenderResponse = (response: string): IProposal[] => {
  const propsResponse = parsedJSONOrRaw<IProposalsResponse>(response);

  return propsResponse.proposals;
};

export const cleanUpRealmReturn = (ret: string) => {
  return ret.slice(2, -9).replace(/\\"/g, '"');
};

export const parsedJSONOrRaw = <T>(data: string): T => {
  const decoded = cleanUpRealmReturn(data);

  return JSON.parse(decoded) as T;
};
