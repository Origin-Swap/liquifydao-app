import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { bsc } from 'viem/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { StakingPage } from './components/staking/StakingPage';
import { LoadingScreen } from './components/LoadingScreen'; // Pastikan Anda memiliki komponen ini

// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

// Wagmi configuration
const projectId = '65e900325f6440b81073eb1b10270843';

const wagmiConfig = getDefaultConfig({
  appName: 'SocialFi',
  projectId,
  chains: [bsc],
  ssr: false,
});

// Main App component
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Router>
      {loading ? (
        <LoadingScreen />
      ) : (
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: '#3b82f6',
                borderRadius: 'large',
              })}
            >
              <div className="min-h-screen bg-gray-900">
                <Navbar />
                <div className="">
                  <Routes>
                    <Route path="/earn" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<StakingPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      )}
    </Router>
  );
}

export default App;
