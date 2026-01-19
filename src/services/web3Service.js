import { createConfig, http } from 'wagmi';
import { mainnet, polygon, bsc, arbitrum, optimism } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, polygon, bsc, arbitrum, optimism],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
});

export const wagmiConfig = config;
