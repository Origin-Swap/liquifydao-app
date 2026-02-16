// hooks/useYields.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { yieldService } from '../../../services/yieldService';
import { useWalletAssets } from './useWalletAssets';

export const useYields = ({ chain = 'bsc', minApr = 5, limit = 20 } = {}) => {
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const assets = useWalletAssets();

  useEffect(() => {
    let mounted = true;

    const fetchYields = async () => {
      try {
        setLoading(true);
        const data = await yieldService.getAllYields({ chain, minApr, limit });

        if (mounted) {
          setYields(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          console.error('Failed to fetch yields:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchYields();

    // Refresh setiap 5 menit
    const interval = setInterval(fetchYields, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [chain, minApr, limit]);

  // Filter berdasarkan asset yang dimiliki
  const personalizedYields = useMemo(() => {
    const assetSymbols = assets.map(a => a.symbol);

    return yields
      .map(y => {
        // Hitung relevance score
        let relevanceScore = 0;

        // Cocok dengan token yang dimiliki
        if (assetSymbols.includes(y.token0)) relevanceScore += 10;
        if (y.token1 && assetSymbols.includes(y.token1)) relevanceScore += 10;

        // Stablecoin cocok dengan stable
        if (y.type === 'stable' && assets.some(a => a.type === 'stable')) {
          relevanceScore += 5;
        }

        // Dapatkan reason text
        let reason = 'Recommended for your portfolio';
        if (assetSymbols.includes(y.token0)) {
          reason = `You hold ${y.token0}`;
        } else if (y.token1 && assetSymbols.includes(y.token1)) {
          reason = `You hold ${y.token1}`;
        } else if (y.type === 'stable' && assets.some(a => a.type === 'stable')) {
          reason = 'Based on your stablecoin holdings';
        }

        return {
          ...y,
          relevanceScore,
          reason
        };
      })
      .sort((a, b) => {
        // Sort by relevance first, then APR
        if (a.relevanceScore !== b.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return b.apr - a.apr;
      });
  }, [yields, assets]);

  return {
    yields: personalizedYields,
    loading,
    error,
    refresh: () => {
      setLoading(true);
      // Trigger re-fetch
      setTimeout(() => {
        setYields([]);
      }, 100);
    }
  };
};
