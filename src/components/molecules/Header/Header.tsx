import { IHeaderProps } from './header.types.ts';
import { FC, useContext } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Connect from '../../atoms/Connect/Connect.tsx';
import AccountContext from '../../../context/AccountContext.ts';

const Header: FC<IHeaderProps> = () => {
  const { address } = useContext(AccountContext);

  return (
    <Flex width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
      {address ? (
        <Flex marginLeft={'auto'}>
          <Text>{address}</Text>
        </Flex>
      ) : (
        <Flex marginLeft={'auto'}>
          <Connect />
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
