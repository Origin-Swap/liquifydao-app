import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { bsc } from 'wagmi/chains';
import { Unplug, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
    watch: true,
  });
  const { disconnect } = useDisconnect();

  const handleMenuClick = (page) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  const getChainName = (chainId) => {
    return chainId === bsc.id ? 'BSC' : 'Unknown';
  };

  const handleBalanceClick = () => {
    if (address) {
      navigate('/dashboard');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">🚀</span>
              </div>
              <p className="text-xl font-bold text-white">LIQUIFY<span className="text-xs text-blue-200">Beta </span></p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block border rounded-xl border-gray-200/60 px-6">
            <div className="flex items-baseline space-x-4">
              <button
                onClick={() => handleMenuClick('/')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => handleMenuClick('/dashboard')}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}

          {/* Wallet Connect - RainbowKit */}
          <div className="flex items-center space-x-3">
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, openChainModal, openAccountModal }) => (
                <button
                  onClick={account ? handleBalanceClick : openConnectModal}
                  className="connect-custom-btn bg-gray-300/0 border border-gray-200 text-white rounded-xl px-4 py-2 flex items-center space-x-2"
                >
                {account ? (
                  <div className="flex items-center">
                    {/* Ganti icon chain dengan balance */}
                    <div
                      className="flex cursor-pointer bg-white/0 rounded"
                      onClick={handleBalanceClick}
                    >
                      <span className="text-[14px] font-medium text-gray-200 dark:text-gray-200">
                        ${balanceData ? (
                          // Gunakan balanceData.formatted langsung tanpa parsing ulang
                          balanceData.formatted || '0.0000'
                        ) : (
                          '0.0000'
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  "Connect"
                )}
                </button>
              )}
            </ConnectButton.Custom>

            {/* Tombol Disconnect terpisah */}
            <ConnectButton.Custom>
              {({ account }) => (
                account && (
                  <button
                    onClick={() => disconnect()}
                    className="p-2 bg-gray-300/0 border border-gray-300 rounded-xl text-red-600 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    <Unplug className="w-5 h-5" />
                  </button>
                )
              )}
            </ConnectButton.Custom>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => handleMenuClick('/')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Home
              </button>
              <button
                onClick={() => handleMenuClick('/dashboard')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
