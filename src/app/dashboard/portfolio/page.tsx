"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Alert,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// Replace the regular import with a dynamic import that disables SSR
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

// Wallet connection wrapper
function WalletConnectWrapper({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Interfaces
interface Token {
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  allocation: number;
  address: string;
  mintAddress?: string;
  icon?: string;
}

interface WatchedWallet {
  address: string;
  label: string;
  isConnected?: boolean;
  tokens: Token[];
  totalValue: number;
}

function PortfolioContent() {
  const { publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [watchedWallets, setWatchedWallets] = useState<WatchedWallet[]>([]);
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);
  const [addWalletDialogOpen, setAddWalletDialogOpen] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletLabel, setNewWalletLabel] = useState('');
  const [walletMenuAnchor, setWalletMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0);
  const [tokenPrices, setTokenPrices] = useState({
    SOL: 20.45,  // Default price
    DEFAI: 0.25, // Default price
    AIR: 0.12,   // Default price
    USDC: 1.00,  // Default price
    BONK: 0.000001, // Default price
  });
  const [isClient, setIsClient] = useState(false);
  const [optimizeDialogOpen, setOptimizeDialogOpen] = useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<string>('pdf');
  const [exportPeriod, setExportPeriod] = useState<string>('30d');
  
  const handleWalletMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setWalletMenuAnchor(event.currentTarget);
  };

  const handleWalletMenuClose = () => {
    setWalletMenuAnchor(null);
  };
  
  const openAddWalletDialog = () => {
    setAddWalletDialogOpen(true);
    handleWalletMenuClose();
  };
  
  const closeAddWalletDialog = () => {
    setAddWalletDialogOpen(false);
    setNewWalletAddress('');
    setNewWalletLabel('');
  };
  
  const addWatchedWallet = async () => {
    try {
      // Validate the address
      new PublicKey(newWalletAddress);
      
      setIsLoading(true);
      
      // Fetch token balances for the new wallet
      const tokens = await fetchTokenBalances(newWalletAddress);
      
      // Calculate total value
      const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
      
      // Create the new wallet object
      const newWallet: WatchedWallet = {
        address: newWalletAddress,
        label: newWalletLabel || `Wallet ${watchedWallets.length + 1}`,
        isConnected: false,
        tokens,
        totalValue
      };
      
      // Add the new wallet to the watched wallets list
      setWatchedWallets(prev => [...prev, newWallet]);
      
      // Select the new wallet
      setSelectedWalletIndex(watchedWallets.length);
      
      // Close the dialog
      closeAddWalletDialog();
    } catch (error) {
      setError("Invalid wallet address. Please enter a valid Solana wallet address.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeWatchedWallet = (index: number) => {
    // Don't allow removing the connected wallet
    if (watchedWallets[index].isConnected) {
      setError("Cannot remove the connected wallet. Disconnect first.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Remove the wallet
    setWatchedWallets(prev => prev.filter((_, i) => i !== index));
    
    // If removed the selected wallet, select the first wallet
    if (selectedWalletIndex === index) {
      setSelectedWalletIndex(0);
    } else if (selectedWalletIndex > index) {
      // If removed a wallet before the selected wallet, adjust the index
      setSelectedWalletIndex(prev => prev - 1);
    }
  };
  
  const selectWallet = (address: string) => {
    setCurrentWallet(address);
    handleWalletMenuClose();
    fetchTokens(address);
  };
  
  // Add this formatting function
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };
  
  // Token Program ID and token addresses
  const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  const DEFAI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DEFAI_CONTRACT_ADDRESS || "5LGyBHMMPwzMunxhcBMn6ZWAuqoHUQmcFiboTJidFURP";
  const AIR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_AIR_CONTRACT_ADDRESS || "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";
  const SOL_DECIMALS = 9; // Add this constant in the component scope where it's accessible to fetchTokenBalances

  // Improved fetchTokens function with proper error handling and accurate data
  const fetchTokens = useCallback(async (walletAddress: string) => {
    if (!connection || !walletAddress) return [];
    
    setIsLoading(true);
    try {
      const walletPublicKey = new PublicKey(walletAddress);
      
      // Get all token accounts owned by the wallet
      const tokenAccounts = await connection.getTokenAccountsByOwner(
        walletPublicKey,
        { programId: TOKEN_PROGRAM_ID }
      );
      
      // Parse token accounts to get balances
      const parsedTokens: Token[] = [];
      
      // Also get native SOL balance
      const solBalance = await connection.getBalance(walletPublicKey);
      const solPrice = 20.45; // Would normally fetch from an API
      const solValue = (solBalance / 1e9) * solPrice;
      
      parsedTokens.push({
        name: "Solana",
        symbol: "SOL",
        icon: "SOL",
        balance: solBalance,
        price: solPrice,
        value: solValue,
        change24h: 2.34,
        allocation: 0, // Will calculate after all tokens are fetched
        address: "native"
      });
      
      // Track the total value to calculate allocation percentages
      let totalValue = solValue;
      
      // Process each token account
      for (const { account } of tokenAccounts.value) {
        const accountInfo = AccountLayout.decode(account.data);
        const amount = Number(accountInfo.amount);
        
        // Skip empty accounts
        if (amount === 0) continue;
        
        // Get mint address (token address)
        const mintAddress = new PublicKey(accountInfo.mint).toString();
        
        // Determine token info based on mint address
        let tokenInfo: Partial<Token> = {
          address: mintAddress,
          balance: 0,
          price: 0,
          value: 0,
          change24h: 0
        };
        
        if (mintAddress === DEFAI_TOKEN_ADDRESS) {
          tokenInfo = {
            ...tokenInfo,
            name: "DeFi AI",
            symbol: "DEFAI",
            icon: "D",
            price: 0.25, // In a real app, fetch from API
            change24h: 4.8
          };
        } else if (mintAddress === AIR_TOKEN_ADDRESS) {
          tokenInfo = {
            ...tokenInfo,
            name: "AI Reward",
            symbol: "AIR",
            icon: "A",
            price: 0.12, // In a real app, fetch from API
            change24h: -1.2
          };
        } else {
          // For unknown tokens, try to get info from token registry or default
          tokenInfo = {
            ...tokenInfo,
            name: `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
            symbol: "???",
            icon: "?",
            price: 0.01, // Placeholder
            change24h: 0
          };
        }
        
        // Calculate token balance and value
        // Most SPL tokens use 9 decimals, but this could vary
        const decimals = 9; // In a real app, fetch from token metadata
        const balance = amount / Math.pow(10, decimals);
        const value = balance * (tokenInfo.price || 0);
        
        totalValue += value;
        
        parsedTokens.push({
          ...tokenInfo,
          balance,
          value,
          allocation: 0, // Will calculate after
        } as Token);
      }
      
      // Calculate allocation percentages
      return parsedTokens.map(token => ({
        ...token,
        allocation: totalValue > 0 ? (token.value / totalValue) * 100 : 0
      }));
      
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setError("Failed to load token balances");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [connection]);

  // Update loadWalletData to handle switched wallets properly
  const loadWalletData = useCallback(async (walletAddress: string) => {
    if (!walletAddress) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch token balances from the wallet
      const walletTokens = await fetchTokens(walletAddress);
      setTokens(walletTokens);
      
      // Calculate total portfolio value
      const total = walletTokens.reduce((sum, token) => sum + token.value, 0);
      setPortfolioValue(total);
      
      // Simulate portfolio change (in a real app, compare with previous data)
      // This is a placeholder - in production, you'd compare with historical data
      const changePercent = (Math.random() * 6) - 3; // -3% to +3%
      setPortfolioChange(changePercent);
      
    } catch (error) {
      console.error("Error loading wallet data:", error);
      setError("Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
  }, [fetchTokens]);

  // Set current wallet when connected wallet changes
  useEffect(() => {
    if (publicKey) {
      // When wallet connects, set it as current
      setCurrentWallet(publicKey.toString());
      
      // Add to watched wallets if not already there
      const walletExists = watchedWallets.some(w => w.address === publicKey.toString());
      if (!walletExists) {
        setWatchedWallets(prev => [...prev, {
          address: publicKey.toString(),
          label: "My Wallet (Connected)",
          isConnected: true,
          tokens: [],
          totalValue: 0
        }]);
      }
    }
  }, [publicKey]);

  // Load data whenever the current wallet changes
  useEffect(() => {
    if (currentWallet) {
      loadWalletData(currentWallet);
    }
  }, [currentWallet, loadWalletData]);
  
  // Function to get wallet display name
  const getWalletDisplayName = (address: string) => {
    const wallet = watchedWallets.find(w => w.address === address);
    if (wallet) {
      return wallet.label || truncateAddress(address);
    }
    return truncateAddress(address);
  };
  
  // Helper to truncate addresses
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return address.slice(0, 6) + '...' + address.slice(-4);
  };
  
  // Portfolio performance data (simulated)
  const performanceData = {
    "24h": portfolioChange,
    "7d": 12.3,
    "30d": -3.5,
    "1y": 28.7
  };

  // Add this fetchTokenBalances function after the truncateAddress helper
  const fetchTokenBalances = useCallback(async (walletAddress: string) => {
    if (!connection) return [];
    
    try {
      // Use Helius RPC to get token balances
      const heliusEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || '';
      
      // First, get SOL balance
      const solResponse = await fetch(heliusEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'helius-sol-balance',
          method: 'getBalance',
          params: [walletAddress]
        })
      });
      
      const solData = await solResponse.json();
      const solBalance = solData.result?.value ? (solData.result.value / Math.pow(10, SOL_DECIMALS)).toFixed(4) : "0";
      
      // Then get token accounts
      const response = await fetch(heliusEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'helius-token-balances',
          method: 'getTokenAccountsByOwner',
          params: [
            walletAddress,
            { programId: TOKEN_PROGRAM_ID.toString() },
            { encoding: 'jsonParsed' }
          ]
        })
      });
      
      const data = await response.json();
      
      // Process token balances
      const tokenList: Token[] = [];
      
      // Add SOL as first token
      tokenList.push({
        name: "Solana",
        symbol: "SOL",
        balance: parseFloat(solBalance),
        price: tokenPrices.SOL || 0,
        value: parseFloat(solBalance) * (tokenPrices.SOL || 0),
        change24h: 2.4, // Mock change data - would come from price API in production
        mintAddress: "So11111111111111111111111111111111111111112", // SOL mint address
        icon: "mdi:currency-sol",
        address: "native",
        allocation: 0 // Add this missing property, will calculate percentages later
      });
      
      // Process other tokens
      if (data.result && data.result.value) {
        for (const account of data.result.value) {
          // Extract token data
          const parsedInfo = account.account.data.parsed.info;
          const mint = parsedInfo.mint;
          const amount = parsedInfo.tokenAmount.uiAmount;
          
          // Only include tokens with non-zero balance
          if (amount > 0) {
            // Determine token symbol and price based on known tokens
            let symbol, price, name, change24h;
            
            if (mint === DEFAI_TOKEN_ADDRESS) {
              symbol = "DEFAI";
              name = "DefiAI";
              price = tokenPrices.DEFAI || 0;
              change24h = 5.2; // Mock data
            } else if (mint === AIR_TOKEN_ADDRESS) {
              symbol = "AIR";
              name = "Air Protocol";
              price = tokenPrices.AIR || 0;
              change24h = -2.1; // Mock data
            } else if (mint === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
              symbol = "USDC";
              name = "USD Coin";
              price = tokenPrices.USDC || 0;
              change24h = 0.1; // Mock data
            } else if (mint === "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263") {
              symbol = "BONK";
              name = "Bonk";
              price = tokenPrices.BONK || 0;
              change24h = 7.8; // Mock data
            } else {
              // For unknown tokens, use a generic placeholder
              symbol = "???";
              name = `Unknown (${mint.slice(0, 4)}...)`;
              price = 0;
              change24h = 0;
            }
            
            // Calculate token value in USD
            const value = amount * price;
            
            // Add to token list
            tokenList.push({
              name,
              symbol,
              balance: amount.toString(),
              price,
              value,
              change24h,
              mintAddress: mint,
              icon: symbol,
              address: mint,
              allocation: 0 // Add this missing property, will calculate percentages later
            });
          }
        }
      }
      
      return tokenList;
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setError("Failed to load token balances. Please try again later.");
      return [];
    }
  }, [connection, tokenPrices]);

  // Cleanest approach - completely revised useEffect
  useEffect(() => {
    if (!publicKey) return;
    
    async function fetchWalletData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Add a non-null assertion since we've already checked publicKey isn't null
        const walletAddress = publicKey!.toString();
        // Or use optional chaining with a fallback
        // const walletAddress = publicKey?.toString() || "";
        
        const tokens = await fetchTokenBalances(walletAddress);
        const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
        
        setWatchedWallets(prev => {
          // Check if wallet already exists
          const existingIndex = prev.findIndex(w => w.address === walletAddress);
          
          if (existingIndex >= 0) {
            // Update existing wallet
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              isConnected: true,
              tokens,
              totalValue
            };
            
            // Make sure to select this wallet
            setTimeout(() => setSelectedWalletIndex(existingIndex), 0);
            
            return updated;
          } else {
            // Add new wallet
            const newWallet = {
              address: walletAddress,
              label: "My Wallet (Connected)",
              isConnected: true,
              tokens,
              totalValue
            };
            
            // Select the new wallet (at the end of the array)
            setTimeout(() => setSelectedWalletIndex(prev.length), 0);
            
            return [...prev, newWallet];
          }
        });
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setError("Failed to load wallet data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWalletData();
  }, [publicKey, fetchTokenBalances]);

  // You could also add a function to update these prices with real data in the future
  const fetchTokenPrices = useCallback(async () => {
    try {
      // This is where you would fetch real prices from a price API
      // For now, just using static prices
      setTokenPrices({
        SOL: 20.45, 
        DEFAI: 0.25,
        AIR: 0.12,
        USDC: 1.00,
        BONK: 0.000001
      });
    } catch (error) {
      console.error("Error fetching token prices:", error);
    }
  }, []);

  // Add fetchTokenPrices to your useEffect that loads data
  useEffect(() => {
    if (publicKey) {
      fetchTokenPrices();
      // Other loading code...
    }
  }, [publicKey, fetchTokenPrices]);

  // Add this useEffect near your other useEffects
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add these handler functions after your other handlers
  const openOptimizeDialog = () => setOptimizeDialogOpen(true);
  const closeOptimizeDialog = () => setOptimizeDialogOpen(false);

  const openSwapDialog = () => setSwapDialogOpen(true);
  const closeSwapDialog = () => {
    setSwapDialogOpen(false);
    setFromToken('');
    setToToken('');
    setSwapAmount('');
  };

  const openExportDialog = () => setExportDialogOpen(true);
  const closeExportDialog = () => setExportDialogOpen(false);

  const handleOptimizePortfolio = () => {
    // This would contain the actual optimization logic
    // For now, we'll just close the dialog
    closeOptimizeDialog();
  };

  const handleSwapTokens = () => {
    // This would contain the actual swap logic
    // For now, we'll just close the dialog
    closeSwapDialog();
  };

  const handleExportReport = () => {
    // This would contain the actual export logic
    // For now, we'll just close the dialog
    closeExportDialog();
  };

  // Add this utility function somewhere in your component
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show success message
        setError("Wallet address copied to clipboard!");
        setTimeout(() => setError(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
            Portfolio Dashboard
          </Typography>
          
          {/* Wallet Selector */}
          <Button
            variant="outlined"
            onClick={handleWalletMenuOpen}
            startIcon={<Icon icon="mdi:wallet" />}
            endIcon={<Icon icon="mdi:chevron-down" />}
            sx={{ 
              color: "#87CEEB", 
              borderColor: "rgba(135,206,235,0.3)",
              "&:hover": { 
                bgcolor: "rgba(135,206,235,0.1)",
                borderColor: "rgba(135,206,235,0.5)",
              }
            }}
          >
            {currentWallet ? getWalletDisplayName(currentWallet) : "Select Wallet"}
          </Button>
          
          <Menu
            anchorEl={walletMenuAnchor}
            open={Boolean(walletMenuAnchor)}
            onClose={handleWalletMenuClose}
            PaperProps={{
              sx: {
                bgcolor: "rgba(13, 17, 28, 0.95)",
                border: "1px solid rgba(135,206,235,0.2)",
                color: "#87CEEB",
                minWidth: "200px"
              }
            }}
          >
            <MenuItem onClick={openAddWalletDialog}>
              <ListItemIcon>
                <Icon icon="mdi:plus" style={{ color: "#87CEEB" }} />
              </ListItemIcon>
              <ListItemText>Add Wallet</ListItemText>
            </MenuItem>
            
            {watchedWallets.length > 0 && <Divider sx={{ my: 1, borderColor: 'rgba(135,206,235,0.2)' }} />}
            
            {watchedWallets.map((wallet, index) => (
              <MenuItem 
                key={wallet.address} 
                onClick={() => {
                  selectWallet(wallet.address);
                  setSelectedWalletIndex(index);
                }}
                selected={selectedWalletIndex === index}
                sx={{
                  bgcolor: selectedWalletIndex === index ? 'rgba(135,206,235,0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(135,206,235,0.2)'
                  }
                }}
              >
                <ListItemIcon>
                  {wallet.isConnected ? (
                    <Icon icon="mdi:wallet-sync" style={{ color: "#4caf50" }} />
                  ) : (
                    <Icon icon="mdi:wallet" style={{ color: "#87CEEB" }} />
                  )}
                </ListItemIcon>
                <ListItemText>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid rgba(135,206,235,0.2)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' }
                    }}
                    onClick={() => copyToClipboard(wallet.address)}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#87CEEB', 
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        mr: 1
                      }}
                    >
                      {wallet.address}
                    </Typography>
                    <Icon icon="mdi:content-copy" style={{ color: '#87CEEB', fontSize: '1rem' }} />
                  </Box>
                </ListItemText>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWatchedWallet(index);
                  }}
                  sx={{ 
                    color: 'rgba(135,206,235,0.5)',
                    '&:hover': { color: '#87CEEB' }
                  }}
                >
                  <Icon icon="mdi:delete-outline" width={18} />
                </IconButton>
              </MenuItem>
            ))}
          </Menu>
        </Stack>
        
        {/* Connection section */}
        {!publicKey && watchedWallets.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(135,206,235,0.2)",
              textAlign: "center"
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 3, color: "#87CEEB" }}>
              Connect your wallet or add a wallet address to view portfolio data
            </Typography>
            
            <Stack direction="row" spacing={2} justifyContent="center">
              {isClient && (
                <WalletMultiButton 
                  style={{
                    backgroundColor: "rgba(135,206,235,0.2)",
                    color: "#87CEEB",
                    border: "1px solid rgba(135,206,235,0.4)",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                    fontSize: "1rem",
                  }}
                />
              )}
              
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={openAddWalletDialog}
                sx={{ 
                  color: "#87CEEB", 
                  borderColor: "rgba(135,206,235,0.3)",
                  "&:hover": { 
                    bgcolor: "rgba(135,206,235,0.1)",
                    borderColor: "rgba(135,206,235,0.5)",
                  }
                }}
              >
                Add Wallet
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={40} sx={{ color: "#87CEEB" }} />
              </Box>
            ) : error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  bgcolor: "rgba(211, 47, 47, 0.1)", 
                  color: "#f44336",
                  border: "1px solid rgba(211, 47, 47, 0.2)"
                }}
              >
                {error}
              </Alert>
            ) : (
              <Stack spacing={3}>
                {/* Portfolio Overview */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: "rgba(0,0,0,0.2)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(135,206,235,0.2)",
                  }}
                >
                  <Grid container spacing={3}>
                    {/* Portfolio Value */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="rgba(135,206,235,0.7)">
                          Total Portfolio Value
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="baseline">
                          <Typography variant="h3" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                            {formatCurrency(portfolioValue)}
                          </Typography>
                          <Chip
                            label={`${portfolioChange >= 0 ? '+' : ''}${portfolioChange.toFixed(2)}%`}
                            size="small"
                            sx={{
                              bgcolor: portfolioChange >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                              color: portfolioChange >= 0 ? '#4caf50' : '#f44336',
                              fontWeight: 'bold'
                            }}
                            icon={<Icon icon={portfolioChange >= 0 ? "mdi:trending-up" : "mdi:trending-down"} />}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    
                    {/* Performance Overview */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="rgba(135,206,235,0.7)">
                          Performance
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          {Object.entries(performanceData).map(([period, change]) => (
                            <Chip
                              key={period}
                              label={`${period}: ${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
                              size="small"
                              sx={{
                                bgcolor: change >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                color: change >= 0 ? '#4caf50' : '#f44336',
                                fontWeight: 'bold'
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Grid>
                    
                    {/* AI Recommendation */}
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Icon icon="mdi:robot" style={{ color: "#87CEEB", fontSize: 24, marginTop: 4 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: "#87CEEB", mb: 1 }}>
                              AI Portfolio Recommendation
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.8)" }}>
                              Based on your current allocations, consider rebalancing to increase your DeFAI position by 5%. 
                              Market indicators suggest positive momentum in the coming weeks. Risk score: 65/100 (Moderate).
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Asset Allocation */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: "rgba(0,0,0,0.2)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(135,206,235,0.2)",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#87CEEB", mb: 3 }}>
                    Asset Allocation
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* Pie Chart Visual - In a real app, use a charting library */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        height: 200, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative',
                        mb: 2
                      }}>
                        {/* Simulated pie chart - in production use a real chart component */}
                        <Box sx={{ 
                          width: 180, 
                          height: 180, 
                          borderRadius: '50%',
                          background: `conic-gradient(
                            #4caf50 0% ${tokens[0]?.allocation || 0}%, 
                            #2196f3 ${tokens[0]?.allocation || 0}% ${(tokens[0]?.allocation || 0) + (tokens[1]?.allocation || 0)}%, 
                            #ff9800 ${(tokens[0]?.allocation || 0) + (tokens[1]?.allocation || 0)}% ${(tokens[0]?.allocation || 0) + (tokens[1]?.allocation || 0) + (tokens[2]?.allocation || 0)}%,
                            #f44336 ${(tokens[0]?.allocation || 0) + (tokens[1]?.allocation || 0) + (tokens[2]?.allocation || 0)}% 100%
                          )`,
                          border: '4px solid rgba(13, 17, 28, 0.8)',
                        }} />
                        <Box sx={{ 
                          position: 'absolute', 
                          width: 80, 
                          height: 80, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(13, 17, 28, 0.9)',
                          border: '2px solid rgba(135,206,235,0.1)',
                        }} />
                      </Box>
                      
                      {/* Legend */}
                      <Stack spacing={1}>
                        {tokens.slice(0, 4).map((token, index) => (
                          <Stack key={index} direction="row" spacing={1} alignItems="center">
                            <Box sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              bgcolor: index === 0 ? '#4caf50' : index === 1 ? '#2196f3' : index === 2 ? '#ff9800' : '#f44336'
                            }} />
                            <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                              {token.symbol}: {token.allocation.toFixed(1)}%
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Grid>
                    
                    {/* Token Table */}
                    <Grid item xs={12} md={8}>
                      <TableContainer component={Box} sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ color: "rgba(135,206,235,0.7)" }}>Asset</TableCell>
                              <TableCell sx={{ color: "rgba(135,206,235,0.7)" }}>Balance</TableCell>
                              <TableCell sx={{ color: "rgba(135,206,235,0.7)" }}>Price</TableCell>
                              <TableCell sx={{ color: "rgba(135,206,235,0.7)" }}>Value</TableCell>
                              <TableCell sx={{ color: "rgba(135,206,235,0.7)" }}>24h</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tokens.map((token, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar 
                                      sx={{ 
                                        width: 24, 
                                        height: 24, 
                                        bgcolor: token.symbol === 'DeFAI' ? 'rgba(135,206,235,0.2)' : 
                                                 token.symbol === 'AIR' ? 'rgba(76, 175, 80, 0.2)' :
                                                 token.symbol === 'SOL' ? 'rgba(155, 89, 182, 0.2)' :
                                                 'rgba(255, 152, 0, 0.2)',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      {token.symbol.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                                      {token.name}
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ color: "#87CEEB" }}>
                                  {token.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })} {token.symbol}
                                </TableCell>
                                <TableCell sx={{ color: "#87CEEB" }}>
                                  ${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                </TableCell>
                                <TableCell sx={{ color: "#87CEEB" }}>
                                  ${token.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: token.change24h >= 0 ? '#4caf50' : '#f44336',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Actions */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: "rgba(0,0,0,0.2)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(135,206,235,0.2)",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#87CEEB", mb: 3 }}>
                    Portfolio Actions
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Icon icon="mdi:auto-fix" />}
                        onClick={openOptimizeDialog}
                        sx={{ 
                          py: 1.5,
                          color: "#87CEEB", 
                          borderColor: "rgba(135,206,235,0.3)",
                          "&:hover": { 
                            bgcolor: "rgba(135,206,235,0.1)",
                            borderColor: "rgba(135,206,235,0.5)",
                          }
                        }}
                      >
                        Optimize Portfolio
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Icon icon="mdi:swap-horizontal" />}
                        onClick={openSwapDialog}
                        component={Link}
                        href="/dashboard/swap"
                        sx={{ 
                          py: 1.5,
                          color: "#87CEEB", 
                          borderColor: "rgba(135,206,235,0.3)",
                          "&:hover": { 
                            bgcolor: "rgba(135,206,235,0.1)",
                            borderColor: "rgba(135,206,235,0.5)",
                          }
                        }}
                      >
                        Swap Tokens
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Icon icon="mdi:file-download" />}
                        onClick={openExportDialog}
                        sx={{ 
                          py: 1.5,
                          color: "#87CEEB", 
                          borderColor: "rgba(135,206,235,0.3)",
                          "&:hover": { 
                            bgcolor: "rgba(135,206,235,0.1)",
                            borderColor: "rgba(135,206,235,0.5)",
                          }
                        }}
                      >
                        Export Report
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
      
      {/* Add Wallet Dialog */}
      <Dialog 
        open={addWalletDialogOpen} 
        onClose={closeAddWalletDialog}
        PaperProps={{
          sx: {
            bgcolor: "rgba(13, 17, 28, 0.95)",
            border: "1px solid rgba(135,206,235,0.2)",
            color: "#87CEEB",
            minWidth: { xs: "90%", sm: "400px" }
          }
        }}
      >
        <DialogTitle sx={{ color: "#87CEEB" }}>Add Wallet to Watch</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField 
              label="Wallet Address"
              fullWidth
              value={newWalletAddress}
              onChange={(e) => setNewWalletAddress(e.target.value)}
              InputProps={{
                sx: { 
                  color: "#87CEEB",
                  fontSize: "0.875rem",
                  fontFamily: "monospace" 
                }
              }}
              InputLabelProps={{
                sx: { color: "rgba(135,206,235,0.7)" }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(135,206,235,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(135,206,235,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(135,206,235,0.7)',
                  },
                }
              }}
            />
            
            <TextField 
              label="Wallet Label (Optional)"
              fullWidth
              value={newWalletLabel}
              onChange={(e) => setNewWalletLabel(e.target.value)}
              InputProps={{
                sx: { color: "#87CEEB" }
              }}
              InputLabelProps={{
                sx: { color: "rgba(135,206,235,0.7)" }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(135,206,235,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(135,206,235,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(135,206,235,0.7)',
                  },
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={closeAddWalletDialog}
            sx={{ color: 'rgba(135,206,235,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={addWatchedWallet}
            variant="contained"
            disabled={!newWalletAddress}
            sx={{ 
              bgcolor: "rgba(135,206,235,0.2)",
              color: "#87CEEB",
              border: "1px solid rgba(135,206,235,0.4)",
              "&:hover": { 
                bgcolor: "rgba(135,206,235,0.3)",
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(135,206,235,0.05)",
                color: "rgba(135,206,235,0.3)",
              }
            }}
          >
            Add Wallet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Optimize Portfolio Dialog */}
      <Dialog 
        open={optimizeDialogOpen} 
        onClose={closeOptimizeDialog}
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(135,206,235,0.3)",
            borderRadius: 2,
            color: "#87CEEB",
            minWidth: { xs: "90%", sm: 400 }
          }
        }}
      >
        <DialogTitle sx={{ color: "#87CEEB", borderBottom: "1px solid rgba(135,206,235,0.2)" }}>
          Optimize Portfolio
        </DialogTitle>
        <DialogContent sx={{ my: 2 }}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.8)" }}>
              Our AI-powered portfolio optimization will analyze your holdings and suggest the ideal allocation to maximize returns while managing risk.
            </Typography>
            
            <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
              <Typography variant="subtitle2" sx={{ color: "#87CEEB", mb: 1 }}>
                Current Portfolio Metrics
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Risk Score:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                    7.4/10 (High)
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Diversification:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                    Low (3 assets)
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Projected APY:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                    12.3%
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
              <Typography variant="subtitle2" sx={{ color: "#4caf50", mb: 1 }}>
                Optimized Allocation
              </Typography>
              <Stack spacing={1}>
                {tokens.slice(0, 4).map((token, index) => (
                  <Stack key={index} direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                      {token.symbol}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                      {(25 - index * 5).toFixed(1)}%
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
            
            <Alert severity="info" sx={{ bgcolor: "rgba(33,150,243,0.1)", color: "#2196f3", border: "1px solid rgba(33,150,243,0.2)" }}>
              Implementing this optimization would require approximately {tokens.length} swaps with an estimated cost of 0.002 SOL.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(135,206,235,0.2)" }}>
          <Button 
            onClick={closeOptimizeDialog}
            sx={{ color: 'rgba(135,206,235,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleOptimizePortfolio}
            variant="contained"
            sx={{ 
              bgcolor: "rgba(135,206,235,0.2)",
              color: "#87CEEB",
              border: "1px solid rgba(135,206,235,0.4)",
              "&:hover": { 
                bgcolor: "rgba(135,206,235,0.3)",
              }
            }}
          >
            Apply Optimization
          </Button>
        </DialogActions>
      </Dialog>

      {/* Swap Dialog */}
      <Dialog 
        open={swapDialogOpen} 
        onClose={closeSwapDialog}
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(135,206,235,0.3)",
            borderRadius: 2,
            color: "#87CEEB",
            minWidth: { xs: "90%", sm: 400 }
          }
        }}
      >
        <DialogTitle sx={{ color: "#87CEEB", borderBottom: "1px solid rgba(135,206,235,0.2)" }}>
          Swap Tokens
        </DialogTitle>
        <DialogContent sx={{ my: 2 }}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.8)" }}>
              Swap tokens directly from your wallet. We'll find the best routes and rates across decentralized exchanges.
            </Typography>
            
            {/* From Token */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: "rgba(135,206,235,0.8)", mb: 1 }}>
                From
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField 
                    fullWidth
                    placeholder="0.0"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    InputProps={{
                      sx: { color: "#87CEEB", fontSize: "1.2rem" },
                      endAdornment: (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box 
                            component="select" 
                            value={fromToken} 
                            onChange={(e) => setFromToken(e.target.value)}
                            sx={{ 
                              bgcolor: "rgba(0,0,0,0.3)",
                              color: "#87CEEB",
                              border: "1px solid rgba(135,206,235,0.3)",
                              borderRadius: 1,
                              p: 1,
                              cursor: "pointer",
                              '&:focus': { outline: 'none' }
                            }}
                          >
                            <Box component="option" value="" disabled>Select Token</Box>
                            {tokens.map((token, idx) => (
                              <Box key={idx} component="option" value={token.symbol}>{token.symbol}</Box>
                            ))}
                          </Box>
                        </Stack>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      }
                    }}
                  />
                </Stack>
              </Paper>
            </Box>
            
            {/* Arrow */}
            <Box display="flex" justifyContent="center">
              <IconButton 
                sx={{ 
                  bgcolor: "rgba(135,206,235,0.1)", 
                  color: "#87CEEB",
                  '&:hover': { bgcolor: "rgba(135,206,235,0.2)" }
                }}
              >
                <Icon icon="mdi:arrow-down" width={24} />
              </IconButton>
            </Box>
            
            {/* To Token */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: "rgba(135,206,235,0.8)", mb: 1 }}>
                To (Estimated)
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField 
                    fullWidth
                    placeholder="0.0"
                    value={swapAmount ? (parseInt(swapAmount) * 0.98).toFixed(2) : ""}
                    disabled
                    InputProps={{
                      sx: { color: "#87CEEB", fontSize: "1.2rem" },
                      endAdornment: (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box 
                            component="select" 
                            value={toToken} 
                            onChange={(e) => setToToken(e.target.value)}
                            sx={{ 
                              bgcolor: "rgba(0,0,0,0.3)",
                              color: "#87CEEB",
                              border: "1px solid rgba(135,206,235,0.3)",
                              borderRadius: 1,
                              p: 1,
                              cursor: "pointer",
                              '&:focus': { outline: 'none' }
                            }}
                          >
                            <Box component="option" value="" disabled>Select Token</Box>
                            {tokens.map((token, idx) => (
                              <Box key={idx} component="option" value={token.symbol}>{token.symbol}</Box>
                            ))}
                          </Box>
                        </Stack>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      }
                    }}
                  />
                </Stack>
              </Paper>
            </Box>
            
            {/* Swap Info */}
            <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Rate:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                    {fromToken && toToken ? `1 ${fromToken} = 0.98 ${toToken}` : '--'}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Fee:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                    0.15%
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Slippage:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                    0.5%
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(135,206,235,0.2)" }}>
          <Button 
            onClick={closeSwapDialog}
            sx={{ color: 'rgba(135,206,235,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSwapTokens}
            variant="contained"
            disabled={!fromToken || !toToken || !swapAmount}
            sx={{ 
              bgcolor: "rgba(135,206,235,0.2)",
              color: "#87CEEB",
              border: "1px solid rgba(135,206,235,0.4)",
              "&:hover": { 
                bgcolor: "rgba(135,206,235,0.3)",
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(135,206,235,0.05)",
                color: "rgba(135,206,235,0.3)",
              }
            }}
          >
            Swap Tokens
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Report Dialog */}
      <Dialog 
        open={exportDialogOpen} 
        onClose={closeExportDialog}
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(135,206,235,0.3)",
            borderRadius: 2,
            color: "#87CEEB",
            minWidth: { xs: "90%", sm: 400 }
          }
        }}
      >
        <DialogTitle sx={{ color: "#87CEEB", borderBottom: "1px solid rgba(135,206,235,0.2)" }}>
          Export Portfolio Report
        </DialogTitle>
        <DialogContent sx={{ my: 2 }}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.8)" }}>
              Generate a detailed report of your portfolio performance and holdings.
            </Typography>
            
            {/* Format Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: "rgba(135,206,235,0.8)", mb: 1 }}>
                Report Format
              </Typography>
              <Stack direction="row" spacing={1}>
                {['pdf', 'csv', 'json'].map((format) => (
                  <Button
                    key={format}
                    variant={exportFormat === format ? "contained" : "outlined"}
                    onClick={() => setExportFormat(format)}
                    sx={{ 
                      flex: 1,
                      textTransform: 'uppercase',
                      color: exportFormat === format ? "#87CEEB" : "rgba(135,206,235,0.7)",
                      border: `1px solid ${exportFormat === format ? "rgba(135,206,235,0.6)" : "rgba(135,206,235,0.3)"}`,
                      bgcolor: exportFormat === format ? "rgba(135,206,235,0.2)" : "transparent",
                      "&:hover": { 
                        bgcolor: "rgba(135,206,235,0.15)",
                      },
                    }}
                  >
                    {format}
                  </Button>
                ))}
              </Stack>
            </Box>
            
            {/* Time Period */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: "rgba(135,206,235,0.8)", mb: 1 }}>
                Time Period
              </Typography>
              <Stack direction="row" spacing={1}>
                {[
                  {id: '7d', label: '7 Days'},
                  {id: '30d', label: '30 Days'},
                  {id: '90d', label: '90 Days'},
                  {id: 'all', label: 'All-time'}
                ].map((period) => (
                  <Button
                    key={period.id}
                    variant={exportPeriod === period.id ? "contained" : "outlined"}
                    onClick={() => setExportPeriod(period.id)}
                    sx={{ 
                      flex: 1,
                      color: exportPeriod === period.id ? "#87CEEB" : "rgba(135,206,235,0.7)",
                      border: `1px solid ${exportPeriod === period.id ? "rgba(135,206,235,0.6)" : "rgba(135,206,235,0.3)"}`,
                      bgcolor: exportPeriod === period.id ? "rgba(135,206,235,0.2)" : "transparent",
                      "&:hover": { 
                        bgcolor: "rgba(135,206,235,0.15)",
                      },
                    }}
                  >
                    {period.label}
                  </Button>
                ))}
              </Stack>
            </Box>
            
            {/* Report Sections */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: "rgba(135,206,235,0.8)", mb: 1 }}>
                Include in Report
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
                <Stack spacing={1}>
                  {[
                    { id: 'holdings', label: 'Current Holdings', description: 'Token balances and values' },
                    { id: 'performance', label: 'Performance Metrics', description: 'Historical returns and growth rate' },
                    { id: 'transactions', label: 'Transaction History', description: 'Record of buys, sells, and transfers' },
                    { id: 'tax', label: 'Tax Information', description: 'Realized gains/losses for tax reporting' }
                  ].map((section) => (
                    <Stack key={section.id} direction="row" alignItems="center" spacing={2}>
                      <Chip 
                        label="✓"
                        sx={{ 
                          bgcolor: "rgba(135,206,235,0.2)",
                          color: "#87CEEB",
                          width: 24,
                          height: 24
                        }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                          {section.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.6)" }}>
                          {section.description}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(135,206,235,0.2)" }}>
          <Button 
            onClick={closeExportDialog}
            sx={{ color: 'rgba(135,206,235,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExportReport}
            variant="contained"
            startIcon={<Icon icon="mdi:download" />}
            sx={{ 
              bgcolor: "rgba(135,206,235,0.2)",
              color: "#87CEEB",
              border: "1px solid rgba(135,206,235,0.4)",
              "&:hover": { 
                bgcolor: "rgba(135,206,235,0.3)",
              }
            }}
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Main component export that wraps everything in the wallet providers
export default function PortfolioPage() {
  return (
    <WalletConnectWrapper>
      <DashboardLayout>
        <PortfolioContent />
      </DashboardLayout>
    </WalletConnectWrapper>
  );
} 