import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { erc20Abi } from 'viem';

// Token whitelist (BSC example)
const TOKENS = [
  {
    symbol: 'USDT',
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    type: 'stable'
  },
  {
    symbol: 'USDC',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    type: 'stable'
  },
  {
    symbol: 'BNB',
    native: true,
    type: 'single'
  }
];

export const useWalletAssets = () => {
  const { address, isConnected } = useAccount();

  // Native balance (BNB / ETH)
  const native = useBalance({
    address,
    watch: true
  });

  // ERC20 balances
  const erc20Calls = TOKENS
    .filter(t => !t.native)
    .map(token => ({
      address: token.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address]
    }));

  const erc20Balances = useReadContracts({
    contracts: erc20Calls,
    query: { enabled: isConnected }
  });

  if (!isConnected) return [];

  const assets = [];

  // Native
  if (native.data && Number(native.data.formatted) > 0) {
    assets.push({
      symbol: 'BNB',
      balance: Number(native.data.formatted),
      type: 'single'
    });
  }

  // ERC20
  erc20Balances.data?.forEach((res, i) => {
    const token = TOKENS.filter(t => !t.native)[i];
    const raw = res?.result;

    if (!raw) return;

    const balance = Number(raw) / 10 ** token.decimals;

    if (balance > 0) {
      assets.push({
        symbol: token.symbol,
        balance,
        type: token.type
      });
    }
  });

  return assets;
};
