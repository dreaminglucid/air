"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { SyntheticEvent } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  LinearProgress,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Alert,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import Link from 'next/link';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Token addresses from environment
const DEFAI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DEFAI_CONTRACT_ADDRESS || "5LGyBHMMPwzMunxhcBMn6ZWAuqoHUQmcFiboTJidFURP";
const AIR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_AIR_CONTRACT_ADDRESS || "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";

// Add WalletWrapperProps interface
interface WalletWrapperProps {
  children: React.ReactNode;
}

// WalletConnectWrapper component (reused from other pages)
function WalletConnectWrapper({ children }: WalletWrapperProps) {
  // Ensure we have a valid endpoint
  const endpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || clusterApiUrl('mainnet-beta');
  
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(), 
    new SolflareWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Type definitions for our data
interface TokenPerformance {
  date: string;
  price: number;
}

interface WhaleActivity {
  wallet: string;
  action: string;
  amount: number;
  timestamp: string;
}

interface TokenAnalytics {
  holders: number;
  transactions: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
}

// Main analytics content
function AnalyticsContent() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  // States for different data sections
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Token data states
  const [defaiPerformance, setDefaiPerformance] = useState<TokenPerformance[]>([]);
  const [airPerformance, setAirPerformance] = useState<TokenPerformance[]>([]);
  const [whaleActivity, setWhaleActivity] = useState<WhaleActivity[]>([]);
  const [defaiAnalytics, setDefaiAnalytics] = useState<TokenAnalytics | null>(null);
  const [airAnalytics, setAirAnalytics] = useState<TokenAnalytics | null>(null);
  const [socialSentiment, setSocialSentiment] = useState({
    twitter: { count: 0, change: 0 },
    telegram: { count: 0, change: 0 },
    discord: { count: 0, change: 0 }
  });

  // Add this handleTabChange function that's missing
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Function to fetch token transaction history from Helius
  const fetchTokenTransactions = useCallback(async (tokenAddress: string, days: number = 30) => {
    try {
      const heliusEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || '';
      
      // Get signatures for the token mint
      const response = await fetch(heliusEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'helius-transactions',
          method: 'getSignaturesForAddress',
          params: [
            tokenAddress,
            { limit: 100 }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }
      
      // Process transaction data to create price points (simulated for now)
      // In a real app, you'd use DEX data to get accurate prices
      const now = new Date();
      const pricePoints: TokenPerformance[] = [];
      
      for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Simulate price based on transaction volume and some randomness
        // This is just a placeholder - real prices would come from DEX APIs
        const basePrice = tokenAddress === DEFAI_TOKEN_ADDRESS ? 0.15 : 0.08;
        const randomFactor = 0.5 + Math.random();
        const dayOfMonth = date.getDate();
        const priceVariation = (dayOfMonth % 5 === 0) ? 1.2 : (dayOfMonth % 3 === 0) ? 0.9 : 1.0;
        
        pricePoints.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: +(basePrice * randomFactor * priceVariation).toFixed(4)
        });
      }
      
      return pricePoints;
    } catch (error) {
      console.error("Error fetching token transactions:", error);
      setError("Failed to load transaction data. Please try again later.");
      return [];
    }
  }, []);

  // Function to fetch whale activity data
  const fetchWhaleActivity = useCallback(async () => {
    try {
      const heliusEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || '';
      
      // Get large transactions for both tokens
      const [defaiResponse, airResponse] = await Promise.all([
        fetch(heliusEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'helius-large-txns-defai',
            method: 'getSignaturesForAddress',
            params: [
              DEFAI_TOKEN_ADDRESS,
              { limit: 10 }
            ]
          })
        }),
        fetch(heliusEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'helius-large-txns-air',
            method: 'getSignaturesForAddress',
            params: [
              AIR_TOKEN_ADDRESS,
              { limit: 10 }
            ]
          })
        })
      ]);
      
      const defaiData = await defaiResponse.json();
      const airData = await airResponse.json();
      
      if (defaiData.error || airData.error) {
        throw new Error("Error fetching whale activity");
      }
      
      // Process and combine the transaction data
      const whaleData: WhaleActivity[] = [];
      
      // Process DEFAI transactions
      if (defaiData.result) {
        defaiData.result.forEach((item: any, index: number) => {
          if (index < 3) { // Limit to 3 transactions per token
            const timestamp = new Date(item.blockTime * 1000);
            const timeAgo = getTimeAgo(timestamp);
            
            whaleData.push({
              wallet: truncateAddress(item.signature),
              action: index % 2 === 0 ? "Buy" : "Sell", // Simulated actions
              amount: Math.floor(10000 + Math.random() * 90000), // Simulated amount
              timestamp: timeAgo
            });
          }
        });
      }
      
      // Process AIR transactions
      if (airData.result) {
        airData.result.forEach((item: any, index: number) => {
          if (index < 3) { // Limit to 3 transactions per token
            const timestamp = new Date(item.blockTime * 1000);
            const timeAgo = getTimeAgo(timestamp);
            
            whaleData.push({
              wallet: truncateAddress(item.signature),
              action: index % 2 === 0 ? "Sell" : "Buy", // Simulated actions
              amount: Math.floor(5000 + Math.random() * 45000), // Simulated amount
              timestamp: timeAgo
            });
          }
        });
      }
      
      // Sort by most recent
      whaleData.sort((a, b) => {
        const timeA = parseTimeAgo(a.timestamp);
        const timeB = parseTimeAgo(b.timestamp);
        return timeA - timeB;
      });
      
      return whaleData;
    } catch (error) {
      console.error("Error fetching whale activity:", error);
      return [];
    }
  }, []);

  // Function to fetch token analytics
  const fetchTokenAnalytics = useCallback(async (tokenAddress: string) => {
    try {
      const heliusEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || '';
      
      // Get token accounts to count holders
      const response = await fetch(heliusEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'helius-token-accounts',
          method: 'getProgramAccounts',
          params: [
            TOKEN_PROGRAM_ID.toString(),
            {
              filters: [
                {
                  dataSize: 165, // Size of token account data
                },
                {
                  memcmp: {
                    offset: 0,
                    bytes: tokenAddress,
                  },
                },
              ],
            },
          ],
        }),
      });
      
      const data = await response.json();
      
      // Count token holders (accounts with non-zero balance)
      let holders = 0;
      if (data.result) {
        holders = data.result.length;
      }
      
      // Get transaction count
      const txResponse = await fetch(heliusEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'helius-tx-count',
          method: 'getSignaturesForAddress',
          params: [
            tokenAddress,
            { limit: 1000 }
          ]
        })
      });
      
      const txData = await txResponse.json();
      const transactions = txData.result ? txData.result.length : 0;
      
      // Generate simulated analytics data based on real holder count
      // In a production app, you'd get this from DEX APIs and token data
      const baseMarketCap = tokenAddress === DEFAI_TOKEN_ADDRESS ? 2500000 : 1200000;
      const baseVolume = tokenAddress === DEFAI_TOKEN_ADDRESS ? 125000 : 75000;
      const baseSupply = tokenAddress === DEFAI_TOKEN_ADDRESS ? 100000000 : 500000000;
      
      // Calculate adjusted values based on holder count (add some variability)
      const holderFactor = Math.max(1, holders / 100);
      const txFactor = Math.max(1, transactions / 100);
      
      return {
        holders,
        transactions,
        volume24h: Math.floor(baseVolume * holderFactor * (0.9 + Math.random() * 0.2)),
        marketCap: Math.floor(baseMarketCap * holderFactor * (0.95 + Math.random() * 0.1)),
        circulatingSupply: Math.floor(baseSupply * (0.98 + Math.random() * 0.04))
      };
    } catch (error) {
      console.error("Error fetching token analytics:", error);
      return null;
    }
  }, []);

  // Fetch all data on component mount
  useEffect(() => {
    async function fetchAllData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch DEFAI performance data
        const defaiData = await fetchTokenTransactions(DEFAI_TOKEN_ADDRESS);
        setDefaiPerformance(defaiData);
        
        // Fetch AIR performance data
        const airData = await fetchTokenTransactions(AIR_TOKEN_ADDRESS);
        setAirPerformance(airData);
        
        // Fetch whale activity
        const whaleData = await fetchWhaleActivity();
        setWhaleActivity(whaleData);
        
        // Fetch token analytics
        const defaiStats = await fetchTokenAnalytics(DEFAI_TOKEN_ADDRESS);
        setDefaiAnalytics(defaiStats);
        
        const airStats = await fetchTokenAnalytics(AIR_TOKEN_ADDRESS);
        setAirAnalytics(airStats);
        
        // Set social sentiment (simulated data for now)
        setSocialSentiment({
          twitter: { count: 1245 + Math.floor(Math.random() * 100), change: 22 },
          telegram: { count: 5782 + Math.floor(Math.random() * 200), change: 8 },
          discord: { count: 2450 + Math.floor(Math.random() * 150), change: 15 }
        });
      } catch (error) {
        console.error("Error loading analytics data:", error);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAllData();
  }, [fetchTokenTransactions, fetchWhaleActivity, fetchTokenAnalytics]);

  // Helper function to truncate addresses
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  // Helper function to convert timestamp to relative time
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Fix the parseTimeAgo function which is missing or incomplete
  const parseTimeAgo = (timeAgo: string) => {
    const value = parseInt(timeAgo.split(' ')[0]);
    
    if (timeAgo.includes('seconds')) return value;
    if (timeAgo.includes('minutes')) return value * 60;
    if (timeAgo.includes('hours')) return value * 3600;
    if (timeAgo.includes('days')) return value * 86400;
    
    return 0;
  };

  // Fix the formatTimeAgo function if incomplete (from the snippet in your codebase)
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
            Analytics Dashboard
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button 
              component={Link} 
              href="/dashboard" 
              variant="outlined"
              startIcon={<Icon icon="mdi:arrow-left" />}
              sx={{ 
                color: "#87CEEB", 
                borderColor: "rgba(135,206,235,0.3)",
                "&:hover": { 
                  bgcolor: "rgba(135,206,235,0.1)",
                  borderColor: "rgba(135,206,235,0.5)",
                }
              }}
            >
              Dashboard
            </Button>
          </Stack>
        </Stack>
        
        {/* Wallet Connection Section */}
        {!publicKey ? (
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
            <Typography variant="subtitle1" sx={{ mb: 2, color: "#87CEEB" }}>
              Connect your wallet to view analytics
            </Typography>
            
            <WalletMultiButton 
              style={{
                backgroundColor: "rgba(135,206,235,0.2)",
                color: "#87CEEB",
                border: "1px solid rgba(135,206,235,0.4)",
                padding: "12px 24px",
                borderRadius: "8px",
                fontFamily: "inherit",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Paper>
        ) : (
          <Stack spacing={3}>
            {/* Analytics Content */}
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
                <Box>
                  {/* Token selection tabs */}
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{ 
                      mb: 3,
                      '.MuiTabs-indicator': { backgroundColor: '#87CEEB' },
                      '.MuiTab-root': { color: 'rgba(135,206,235,0.7)' },
                      '.Mui-selected': { color: '#87CEEB' }
                    }}
                  >
                    <Tab label="DEFAI" />
                    <Tab label="AIR" />
                  </Tabs>
                  
                  {/* Token analytics dashboard */}
                  <>
                    {tabValue === 0 && (
                      <Stack spacing={4}>
                        {/* DEFAI token stats */}
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)" }}>
                              <Typography variant="h6" sx={{ color: "#87CEEB", mb: 2 }}>
                                DEFAI Token Performance
                              </Typography>
                              
                              <TableContainer component={Box} sx={{ maxHeight: 400 }}>
                                <Table size="small" stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#87CEEB" }}>Date</TableCell>
                                      <TableCell sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#87CEEB" }}>Price (USD)</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {defaiPerformance.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell sx={{ color: "#87CEEB" }}>{item.date}</TableCell>
                                        <TableCell sx={{ color: "#87CEEB" }}>${item.price}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)" }}>
                              <Typography variant="h6" sx={{ color: "#87CEEB", mb: 2 }}>
                                DEFAI Analytics
                              </Typography>
                              
                              {defaiAnalytics && (
                                <Stack spacing={2}>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      Holders:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      {defaiAnalytics.holders.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                  
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      24h Volume:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      ${defaiAnalytics.volume24h.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                  
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      Market Cap:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      ${defaiAnalytics.marketCap.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                  
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      Circulating Supply:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      {defaiAnalytics.circulatingSupply.toLocaleString()} DEFAI
                                    </Typography>
                                  </Stack>
                                  
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      Total Transactions:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      {defaiAnalytics.transactions.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              )}
                            </Paper>
                          </Grid>
                        </Grid>
                        
                        {/* Whale Activity */}
                        <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)" }}>
                          <Typography variant="h6" sx={{ color: "#87CEEB", mb: 2 }}>
                            Whale Activity
                          </Typography>
                          
                          <TableContainer component={Box}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#87CEEB" }}>Wallet</TableCell>
                                  <TableCell sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#87CEEB" }}>Action</TableCell>
                                  <TableCell sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#87CEEB" }}>Amount</TableCell>
                                  <TableCell sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#87CEEB" }}>Time</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {whaleActivity.map((activity, index) => (
                                  <TableRow key={index}>
                                    <TableCell sx={{ color: "#87CEEB" }}>{activity.wallet}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={activity.action} 
                                        size="small"
                                        sx={{ 
                                          bgcolor: activity.action === "Buy" 
                                            ? "rgba(46, 125, 50, 0.2)" 
                                            : "rgba(211, 47, 47, 0.2)",
                                          color: activity.action === "Buy" ? "#4caf50" : "#f44336",
                                          border: activity.action === "Buy" 
                                            ? "1px solid rgba(46, 125, 50, 0.3)" 
                                            : "1px solid rgba(211, 47, 47, 0.3)",
                                        }} 
                                      />
                                    </TableCell>
                                    <TableCell sx={{ color: "#87CEEB" }}>{activity.amount.toLocaleString()} {activity.action === "Buy" ? "DEFAI" : "AIR"}</TableCell>
                                    <TableCell sx={{ color: "#87CEEB" }}>{activity.timestamp}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                        
                        {/* Social Sentiment Analysis */}
                        <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)" }}>
                          <Typography variant="h6" sx={{ color: "#87CEEB", mb: 2 }}>
                            Social Sentiment
                          </Typography>
                          
                          <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                Twitter Mentions
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                                {socialSentiment.twitter.count.toLocaleString()} (+{socialSentiment.twitter.change}%)
                              </Typography>
                            </Stack>
                            <LinearProgress 
                              variant="determinate" 
                              value={75} 
                              sx={{
                                bgcolor: "rgba(135,206,235,0.1)",
                                "& .MuiLinearProgress-bar": { bgcolor: "#87CEEB" }
                              }}
                            />
                            
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                Telegram Activity
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                                {socialSentiment.telegram.count.toLocaleString()} (+{socialSentiment.telegram.change}%)
                              </Typography>
                            </Stack>
                            <LinearProgress 
                              variant="determinate" 
                              value={62} 
                              sx={{
                                bgcolor: "rgba(135,206,235,0.1)",
                                "& .MuiLinearProgress-bar": { bgcolor: "#87CEEB" }
                              }}
                            />
                            
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                Discord Members
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#87CEEB" }}>
                                {socialSentiment.discord.count.toLocaleString()} (+{socialSentiment.discord.change}%)
                              </Typography>
                            </Stack>
                            <LinearProgress 
                              variant="determinate" 
                              value={45} 
                              sx={{
                                bgcolor: "rgba(135,206,235,0.1)",
                                "& .MuiLinearProgress-bar": { bgcolor: "#87CEEB" }
                              }}
                            />
                          </Stack>
                        </Paper>
                      </Stack>
                    )}
                    
                    {tabValue === 1 && (
                      <Stack spacing={4}>
                        {/* AIR token stats */}
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)" }}>
                              <Typography variant="h6" sx={{ color: "#87CEEB", mb: 2 }}>
                                AIR Token Performance
                              </Typography>
                              
                              <TableContainer component={Box} sx={{ maxHeight: 400 }}>
                                <Table size="small" stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#87CEEB" }}>Date</TableCell>
                                      <TableCell sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#87CEEB" }}>Price (USD)</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {airPerformance.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell sx={{ color: "#87CEEB" }}>{item.date}</TableCell>
                                        <TableCell sx={{ color: "#87CEEB" }}>${item.price}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)" }}>
                              <Typography variant="h6" sx={{ color: "#87CEEB", mb: 2 }}>
                                AIR Analytics
                              </Typography>
                              
                              {airAnalytics && (
                                <Stack spacing={2}>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      Holders:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      {airAnalytics.holders.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                  
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      24h Volume:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      ${airAnalytics.volume24h.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                  
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      Market Cap:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      ${airAnalytics.marketCap.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                  
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      Circulating Supply:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      {airAnalytics.circulatingSupply.toLocaleString()} AIR
                                    </Typography>
                                  </Stack>
                                  
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                      Total Transactions:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                      {airAnalytics.transactions.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              )}
                            </Paper>
                          </Grid>
                        </Grid>
                        
                        {/* Same whale activity and social sentiment sections as in DEFAI tab */}
                      </Stack>
                    )}
                  </>
                </Box>
              )}
            </Paper>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

// Main component export
export default function AnalyticsPage() {
  return (
    <WalletConnectWrapper>
      <AnalyticsContent />
    </WalletConnectWrapper>
  );
} 