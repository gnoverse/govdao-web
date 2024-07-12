import {
  IProposalProps,
  IProposalVotes,
  parseVotingStatus
} from './proposal.types.ts';
import { FC, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  useToast
} from '@chakra-ui/react';
import AccountContext from '../../../context/AccountContext.ts';
import {
  EMessageType,
  IAccountInfo
} from '../../../services/adena/adena.types.ts';
import { AdenaService } from '../../../services/adena/adena.ts';
import Config from '../../../config.ts';
import ProviderContext from '../../../context/ProviderContext.ts';
import { FaCheck, FaMinusCircle } from 'react-icons/fa';

const Proposal: FC<IProposalProps> = (props) => {
  const { proposal } = props;

  const toast = useToast();
  const [voteDisabled, setVoteDisabled] = useState<boolean>(false);
  const { address } = useContext(AccountContext);

  const handleVote = async (yes: boolean) => {
    setVoteDisabled(true);

    if (!address) {
      // Wallet not connected
      toast({
        position: 'bottom-right',
        title: 'Wallet not connected',
        description: 'Please connect the Adena wallet to vote',
        status: 'error',
        isClosable: true
      });

      setVoteDisabled(false);

      return;
    }

    try {
      const accountInfo: IAccountInfo = await AdenaService.getAccountInfo();

      await AdenaService.sendTransaction(
        [
          {
            type: EMessageType.MSG_CALL,
            value: {
              caller: accountInfo.address,
              send: '',
              pkg_path: Config.REALM_PATH,
              func: 'VoteOnProposal',
              args: [`${proposal.id}`, yes ? 'YES' : 'NO']
            }
          }
        ],
        1000000,
        5000000,
        'Voted using govdao-web!'
      );

      toast({
        position: 'bottom-right',
        title: 'Vote cast',
        description: 'Successfully cast vote!',
        status: 'success',
        isClosable: true
      });
    } catch (e) {
      console.error(e);

      toast({
        position: 'bottom-right',
        title: 'Unable to vote',
        description: 'Unable to cast vote for proposal',
        status: 'error',
        isClosable: true
      });
    }

    setVoteDisabled(false);
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayedVotes, setDisplayedVotes] = useState<IProposalVotes>();

  const { provider } = useContext(ProviderContext);

  const fetchProposalVotes = async (): Promise<IProposalVotes> => {
    if (!provider) {
      throw new Error('invalid chain RPC URL');
    }

    const response: string = await provider.evaluateExpression(
      Config.REALM_PATH,
      `Render("${proposal.id}")`
    );

    // Parse the proposals response
    return parseVotingStatus(response);
  };

  useEffect(() => {
    setIsLoading(true);

    fetchProposalVotes()
      .then((votes: IProposalVotes) => {
        setDisplayedVotes(votes);
      })
      .catch((e) => {
        console.error(e);

        toast({
          position: 'bottom-right',
          title: 'Unable to fetch voting status from govdao',
          description: `An error occurred while fetching voting status for #${proposal.id} from govdao`,
          status: 'error',
          isClosable: true
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [proposal.id]);

  return (
    <Card width={'380px'}>
      <CardHeader>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Heading size="md">{`Proposal #${proposal.id}`}</Heading>

          {proposal.status == 'active' && (
            <Flex ml={4} columnGap={4}>
              <Button
                colorScheme={'green'}
                leftIcon={<FaCheck />}
                onClick={() => handleVote(true)}
                isDisabled={voteDisabled}
              >
                Yes
              </Button>
              <Button
                colorScheme={'red'}
                leftIcon={<FaMinusCircle />}
                onClick={() => handleVote(false)}
                isDisabled={voteDisabled}
              >
                No
              </Button>
            </Flex>
          )}
        </Flex>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform={'uppercase'}>
              Status
            </Heading>
            <Text pt="2" fontSize="sm" textTransform={'capitalize'}>
              {proposal.status}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Voting Status
            </Heading>
            {isLoading && (
              <CircularProgress isIndeterminate color="#226c57" size={'20px'} />
            )}
            {!isLoading && displayedVotes && (
              <Text pt="2" fontSize="sm" textTransform={'capitalize'}>
                {`YES: ${displayedVotes.yes}, NO: ${displayedVotes.no}, Voted: ${displayedVotes.percent}%, Members: ${displayedVotes.members}`}
              </Text>
            )}
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Description
            </Heading>
            <Text pt="2" fontSize="sm">
              {proposal.description}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Author
            </Heading>
            <Text pt="2" fontSize="sm" textTransform={'lowercase'}>
              {proposal.author}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default Proposal;
