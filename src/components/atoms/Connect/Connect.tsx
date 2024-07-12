import { IConnectProps } from './connect.types.ts';
import { FC, useContext, useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { AdenaService } from '../../../services/adena/adena.ts';
import { IAccountInfo } from '../../../services/adena/adena.types.ts';
import Config from '../../../config.ts';
import AccountContext from '../../../context/AccountContext.ts';
import Adena from '../../../shared/assets/img/adena.svg?react';

const Connect: FC<IConnectProps> = () => {
  const toast = useToast();
  const { setChainID, setAddress } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleWalletConnect = async () => {
    setIsLoading(true);

    try {
      // Attempt to establish a connection
      await AdenaService.establishConnection('govdao-web');

      // Add the custom network if it's not present
      await AdenaService.addNetwork(
        Config.CHAIN_ID,
        Config.CHAIN_JSON_RPC,
        Config.CHAIN_NAME
      );

      // Make sure the network is valid
      await AdenaService.switchNetwork(Config.CHAIN_ID);

      // Get the account info
      const info: IAccountInfo = await AdenaService.getAccountInfo();

      // Update the account context
      setAddress(info.address);
      setChainID(Config.CHAIN_ID);

      toast({
        position: 'bottom-right',
        title: 'Successfully connected to Adena',
        description: 'Connection to Adena wallet successful',
        status: 'success',
        isClosable: true
      });
    } catch (e) {
      console.error(e);

      toast({
        position: 'bottom-right',
        title: 'Unable to connect to Adena',
        description: 'There was an issue connecting to Adena',
        status: 'error',
        isClosable: true
      });
    }

    setIsLoading(false);
  };

  return (
    <Button
      isLoading={isLoading}
      loadingText={'Connecting...'}
      variant={'solid'}
      onClick={handleWalletConnect}
      leftIcon={
        <Adena
          style={{
            width: '20px',
            height: 'auto'
          }}
        />
      }
    >
      Connect Adena
    </Button>
  );
};

export default Connect;
