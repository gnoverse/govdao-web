import { useState } from 'react';
import { IAccountContext } from './context/accountContext.types.ts';
import { GnoWSProvider } from '@gnolang/gno-js-client';
import { IProviderContext } from './context/providerContext.types.ts';
import Config from './config.ts';
import { ChakraProvider } from '@chakra-ui/react';
import AccountContext from './context/AccountContext.ts';
import ProviderContext from './context/ProviderContext.ts';
import Home from './components/organisms/Home.tsx';

const App = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainID, setChainID] = useState<string | null>(null);

  const accountContext: IAccountContext = {
    address,
    chainID,

    setAddress,
    setChainID
  };

  const [provider, setProvider] = useState<GnoWSProvider | null>(
    new GnoWSProvider(Config.CHAIN_WS_RPC)
  );

  const wsProvider: IProviderContext = {
    provider,
    setProvider
  };

  return (
    <ProviderContext.Provider value={wsProvider}>
      <AccountContext.Provider value={accountContext}>
        <ChakraProvider>
          <Home />
        </ChakraProvider>
      </AccountContext.Provider>
    </ProviderContext.Provider>
  );
};

export default App;
