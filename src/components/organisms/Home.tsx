import { IHomeProps, ISocial, parseRenderResponse } from './home.types.ts';
import { FC, useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Container,
  Flex,
  IconButton,
  Link,
  Text,
  useToast
} from '@chakra-ui/react';
import Header from '../molecules/Header/Header.tsx';
import { BsDiscord, BsGithub, BsTelegram, BsTwitterX } from 'react-icons/bs';
import Gnoland from '../../shared/assets/img/gnoland.svg?react';
import { IProposal } from '../atoms/Proposal/proposal.types.ts';
import Proposal from '../atoms/Proposal/Proposal.tsx';
import ProviderContext from '../../context/ProviderContext.ts';
import Config from '../../config.ts';

const Home: FC<IHomeProps> = () => {
  const socials: ISocial[] = [
    {
      name: 'Discord',
      link: 'https://discord.gg/YFtMjWwUN7',
      icon: <BsDiscord />
    },
    {
      name: 'GitHub',
      link: 'https://github.com/gnolang/gno',
      icon: <BsGithub />
    },
    {
      name: 'X',
      link: 'https://twitter.com/_gnoland',
      icon: <BsTwitterX />
    },
    {
      name: 'Telegram',
      link: 'https://t.me/gnoland',
      icon: <BsTelegram />
    }
  ];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayedProposals, setDisplayedProposals] = useState<IProposal[]>([]);

  const toast = useToast();
  const { provider } = useContext(ProviderContext);

  const fetchProposals = async (): Promise<IProposal[]> => {
    if (!provider) {
      throw new Error('invalid chain RPC URL');
    }

    const response: string = await provider.evaluateExpression(
      Config.REALM_PATH,
      `Proposals(0, 100)` // TODO add pagination
    );

    // TODO remove
    console.log(response);

    // Parse the proposals response
    return parseRenderResponse(response);
  };

  useEffect(() => {
    setIsLoading(true);

    fetchProposals()
      .then((posts: IProposal[]) => {
        setDisplayedProposals(posts);
      })
      .catch((e) => {
        console.error(e);

        toast({
          position: 'bottom-right',
          title: 'Unable to fetch proposals from govdao',
          description: 'An error occurred while fetching proposals from govdao',
          status: 'error',
          isClosable: true
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Container maxWidth={'7xl'} width={'100%'} my={12}>
      <Flex display={'column'} rowGap={12}>
        <Flex>
          <Gnoland
            style={{
              width: '300px',
              height: 'auto'
            }}
          />
          <Header />
        </Flex>

        <Flex alignItems={'center'} columnGap={4} mt={8}>
          <Link href={'https://github.com/gnolang/govdao-web'} isExternal>
            GitHub Project
          </Link>
          <Text>|</Text>
          <Link href={'https://test4.gno.land'} isExternal>
            Official website
          </Link>
          <Text>|</Text>
          <Flex alignItems={'center'} columnGap={4}>
            {socials.map((social, index) => {
              return (
                <Link key={index} href={social.link} isExternal>
                  <IconButton
                    aria-label={social.name}
                    variant={'outline'}
                    icon={social.icon}
                  />
                </Link>
              );
            })}
          </Flex>
        </Flex>
      </Flex>

      {isLoading && (
        <Flex mt={6}>
          <CircularProgress isIndeterminate color="#226c57" />
        </Flex>
      )}
      {!isLoading && (
        <Flex width={'100%'} mt={12} columnGap={8} rowGap={8} flexWrap={'wrap'}>
          {displayedProposals.map((proposal, id) => {
            return (
              <Proposal key={`proposal-${id}`} id={id} proposal={proposal} />
            );
          })}
        </Flex>
      )}
    </Container>
  );
};

export default Home;
