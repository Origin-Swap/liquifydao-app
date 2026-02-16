// hooks/useWalletAssets.js
import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { erc20Abi } from 'viem';
import { useTokenPrices } from './useTokenPrices';

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
  },
  {
    symbol: 'LIQ',
    address: '0xdc228DD2B3AF4Dde862155a1cB39498A7Dfa41C6',
    decimals: 18,
    type: 'single'
  }
];

export const useWalletAssets = () => {
  const { address, isConnected } = useAccount();

  // Ambil semua symbol untuk fetching harga
  const symbols = TOKENS.map(t => t.symbol);
  const { prices, loading: pricesLoading } = useTokenPrices(symbols);

  // Native balance (BNB)
  const native = useBalance({
    address,
    watch: true,
    query: {
      enabled: !!address,
    }
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
    query: {
      enabled: !!address
    }
  });

  if (!address) return [];

  const assets = [];

  // Debug log
  console.log('Prices loaded:', prices);

  // Native BNB
  if (native.data) {
    const balance = Number(native.data.value) / 10 ** native.data.decimals;
    assets.push({
      symbol: 'BNB',
      balance,
      type: 'single',
      price: prices.BNB || 320, // Fallback
      value: balance * (prices.BNB || 320)
    });
  }

  // ERC20 tokens
  if (erc20Balances.data) {
    erc20Balances.data.forEach((res, i) => {
      const token = TOKENS.filter(t => !t.native)[i];
      if (!token || !res?.result) return;

      const balance = Number(res.result) / 10 ** token.decimals;

      // Hanya push kalau balance > 0 atau token LIQ (biar muncul meski 0)
      if (balance > 0 || token.symbol === 'LIQ') {
        const price = prices[token.symbol] ||
                     (token.symbol === 'LIQ' ? 0.005 : 1); // Fallback
        const value = balance * price;

        assets.push({
          symbol: token.symbol,
          balance,
          type: token.type,
          price,
          value
        });
      }
    });
  }

  // Sort by value (descending)
  return assets.sort((a, b) => (b.value || 0) - (a.value || 0));
};
