// hooks/useTokenPrices.js
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { priceCache, rateLimiter } from '../../../utils/priceCache';

// Mapping symbol ke CoinGecko ID
const COINGECKO_IDS = {
  BNB: 'binancecoin',
  USDT: 'tether',
  USDC: 'usd-coin',
  // LIQ token - dummy price, tidak perlu fetch
};

// Harga dummy untuk LIQ
const DUMMY_PRICES = {
  LIQ: 0.005
};

export const useTokenPrices = (symbols = []) => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { chainId } = useAccount();

  useEffect(() => {
    const fetchPrices = async () => {
      if (!symbols.length) return;

      setLoading(true);
      setError(null);

      try {
        const priceData = {};
        const needsFetch = [];

        // Cek cache dulu
        symbols.forEach(symbol => {
          // LIQ pakai dummy price
          if (symbol === 'LIQ') {
            priceData[symbol] = DUMMY_PRICES.LIQ;
            return;
          }

          const cached = priceCache.get(symbol);
          if (cached) {
            priceData[symbol] = cached;
          } else {
            needsFetch.push(symbol);
          }
        });

        // Fetch yang tidak ada di cache
        if (needsFetch.length > 0) {
          const ids = needsFetch
            .map(symbol => COINGECKO_IDS[symbol])
            .filter(id => id);

          if (ids.length > 0) {
            // Rate limiting
            await rateLimiter.waitIfNeeded();

            const response = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Map balik ke symbol
            needsFetch.forEach(symbol => {
              const id = COINGECKO_IDS[symbol];
              if (id && data[id]?.usd) {
                const price = data[id].usd;
                priceData[symbol] = price;
                priceCache.set(symbol, price);
              }
            });
          }
        }

        setPrices(priceData);
      } catch (err) {
        console.error('Error fetching prices:', err);
        setError(err.message);

        // Fallback ke dummy prices kalau error
        const fallbackPrices = {};
        symbols.forEach(symbol => {
          if (symbol === 'LIQ') {
            fallbackPrices[symbol] = DUMMY_PRICES.LIQ;
          } else {
            fallbackPrices[symbol] = symbol === 'BNB' ? 320 : 1; // Fallback kasar
          }
        });
        setPrices(fallbackPrices);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    // Refresh setiap 5 menit
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [symbols.join(','), chainId]); // Re-fetch kalau chain berubah

  return { prices, loading, error };
};
