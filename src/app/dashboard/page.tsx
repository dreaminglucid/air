"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { keyframes } from "@mui/system";
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

// Import required CSS for the wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

// Dynamic import of wallet components to prevent hydration mismatch
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

// Add this constant near the top of the file, after imports
// Define TOKEN_PROGRAM_ID as a constant to avoid dependency on spl-token
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Animation keyframes
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Message types
type MessageType = {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
};

// Quick question topics
const quickTopics = [
  { id: "trending", label: "Trending Coins", question: "What are the trending cryptocurrencies right now?" },
  { id: "market", label: "Market Analysis", question: "Can you give me a quick market analysis?" },
  { id: "defi", label: "DeFi News", question: "What's happening in DeFi today?" },
  { id: "nft", label: "NFT Updates", question: "Any interesting NFT developments lately?" },
  { id: "airdrops", label: "Airdrops", question: "What are the best upcoming airdrops?" },
];

// Add this before the WalletConnectWrapper function
interface WalletWrapperProps {
  children: React.ReactNode;
}

// Update the WalletConnectWrapper for better reliability
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

// Dashboard component with wallet capabilities
function DashboardContent() {
  // First, declare all states
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      text: "Hello! I'm DeFAIza, your AI assistant. How can I help you manage your rewards today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [defaiBalance, setDefaiBalance] = useState<string | null>(null);
  const [airBalance, setAirBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  
  // Get wallet context
  const { connection } = useConnection();
  const { publicKey, disconnect } = useWallet();
  
  // Add token constants using environment variables
  const DEFAI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DEFAI_CONTRACT_ADDRESS || "5LGyBHMMPwzMunxhcBMn6ZWAuqoHUQmcFiboTJidFURP";
  const AIR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_AIR_CONTRACT_ADDRESS || "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";
  
  // Define fetchTokenBalances BEFORE using it in useEffect
  const fetchTokenBalances = useCallback(async () => {
    if (!publicKey || !connection) {
      setDefaiBalance(null);
      setAirBalance(null);
      return;
    }
    
    try {
      setIsLoadingBalance(true);
      setDefaiBalance("Loading...");
      setAirBalance("Loading...");
      
      // Use a more direct approach with Helius
      const heliusEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || '';
      
      // Create a simple fetch to Helius directly to get token balances
      const response = await fetch(heliusEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'helius-token-balances',
          method: 'getTokenAccountsByOwner',
          params: [
            publicKey.toString(),
            { programId: TOKEN_PROGRAM_ID.toString() },
            { encoding: 'jsonParsed' }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }
      
      let defaiAmt = "0";
      let airAmt = "0";
      
      // Parse the response from Helius
      if (data.result && data.result.value) {
        for (const item of data.result.value) {
          const accountInfo = item.account.data.parsed.info;
          const mintAddress = accountInfo.mint;
          
          if (mintAddress === DEFAI_TOKEN_ADDRESS) {
            defaiAmt = accountInfo.tokenAmount.uiAmount?.toString() || "0";
          } else if (mintAddress === AIR_TOKEN_ADDRESS) {
            airAmt = accountInfo.tokenAmount.uiAmount?.toString() || "0";
          }
        }
      }
      
      setDefaiBalance(defaiAmt);
      setAirBalance(airAmt);
    } catch (error) {
      console.error("Error getting token accounts:", error);
      setDefaiBalance("Error");
      setAirBalance("Error");
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection, DEFAI_TOKEN_ADDRESS, AIR_TOKEN_ADDRESS]);

  // Now use the function in useEffect
  useEffect(() => {
    if (publicKey) {
      fetchTokenBalances();
      
      // Add a wallet connected message with proper typing
      const walletMessage: MessageType = {
        id: Date.now().toString(),
        text: `Wallet connected! Checking for token balances...`,
        sender: "agent", 
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, walletMessage]);
    }
  }, [publicKey, fetchTokenBalances]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Fix the useEffect for global styling - it had a syntax error
  useEffect(() => {
    // Apply styles directly to document body and html element
    document.documentElement.style.background = "linear-gradient(180deg, #000000 0%, #1a1a2e 100%)";
    document.documentElement.style.height = "100%";
    document.body.style.background = "linear-gradient(180deg, #000000 0%, #1a1a2e 100%)";
    document.body.style.margin = "0";
    document.body.style.padding = "0"; 
    document.body.style.minHeight = "100vh";
    
    // Force any parent containers to inherit the background
    const rootElement = document.getElementById('__next');
    if (rootElement) {
      rootElement.style.background = "linear-gradient(180deg, #000000 0%, #1a1a2e 100%)";
      rootElement.style.minHeight = "100vh";
    }
    
    return () => {
      // Clean up styles when component unmounts
      document.documentElement.style.background = "";
      document.documentElement.style.height = "";
      document.body.style.background = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.minHeight = "";
      if (rootElement) {
        rootElement.style.background = "";
        rootElement.style.minHeight = "";
      }
    };
  }, []);

  // Handle message submission
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response with common DeFAI-related responses
    setTimeout(() => {
      const responses = [
        "The essence flows every 5 minutes! Your rewards are being distributed automatically to your wallet.",
        "Your AI16Z lifeforce is continuously growing. No need to claim - the stream is automatic.",
        "The 5% transaction essence powers the entire reward ecosystem. It's the digital lifeforce that sustains us all.",
        "According to my calculations, with current volume, your holdings should generate passive rewards at approximately 0.05% daily.",
        "The protocol is functioning optimally. All essence collection and distribution systems are online.",
        "Remember, your rewards scale with your holdings. The more $AIR you hold, the greater your share of the flow.",
        "I'm detecting healthy network activity. The ecosystem is thriving and the reward pool is being continuously replenished.",
      ];

      // Generate agent response based on user input
      let responseText = "";
      if (input.toLowerCase().includes("trending") || input.toLowerCase().includes("popular coin")) {
        responseText = "Based on recent market data, the trending coins this week are ETH, SOL, BONK, WIF, and TROLL. The meme sector is seeing significant growth with new narratives forming.";
      } else if (input.toLowerCase().includes("market analysis") || input.toLowerCase().includes("market overview")) {
        responseText = "Current market analysis: BTC dominance is at 52%, overall sentiment is bullish with strong institutional inflows. DeFi TVL has increased 15% this month with Solana ecosystem leading growth.";
      } else if (input.toLowerCase().includes("defi")) {
        responseText = "In DeFi news, lending protocols are showing strong growth, with TVL up 22% this month. New yield optimization strategies are emerging with AI-driven rebalancing protocols showing promise.";
      } else if (input.toLowerCase().includes("nft")) {
        responseText = "NFT market is seeing renewed interest with dynamic NFTs and AI-generated collections gaining traction. Trading volumes have increased 35% from last month with Solana NFTs leading the charge.";
      } else if (input.toLowerCase().includes("airdrop")) {
        responseText = "Notable upcoming airdrops include several Layer 2 protocols and DEX platforms. Projects with strong community engagement and testnet participation are likely to distribute tokens in Q2.";
      } else if (input.toLowerCase().includes("reward") || input.toLowerCase().includes("earn")) {
        responseText = responses[0];
      } else if (input.toLowerCase().includes("claim")) {
        responseText = responses[1];
      } else if (input.toLowerCase().includes("tax") || input.toLowerCase().includes("fee")) {
        responseText = responses[2];
      } else if (input.toLowerCase().includes("calculate") || input.toLowerCase().includes("how much")) {
        responseText = responses[3];
      } else if (input.toLowerCase().includes("status") || input.toLowerCase().includes("working")) {
        responseText = responses[4];
      } else if (input.toLowerCase().includes("hold") || input.toLowerCase().includes("more")) {
        responseText = responses[5];
      } else {
        // Default response for anything else
        responseText = responses[6];
      }

      const agentMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "agent",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Completely rewrite the handleQuickQuestion function
  const handleQuickQuestion = (question: string) => {
    // Don't proceed if already loading
    if (isLoading) return;
    
    // Create the user message with proper typing
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    };
    
    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Determine which response to show based on the question type
    let responseText = "";
    
    // Match the exact strings from the topic questions
    if (question.includes("trending cryptocurrencies")) {
      responseText = "Based on recent market data, the trending coins this week are ETH, SOL, BONK, WIF, and TROLL. The meme sector is seeing significant growth with new narratives forming.";
    } else if (question.includes("market analysis")) {
      responseText = "Current market analysis: BTC dominance is at 52%, overall sentiment is bullish with strong institutional inflows. DeFi TVL has increased 15% this month with Solana ecosystem leading growth.";
    } else if (question.includes("DeFi today")) {
      responseText = "In DeFi news, lending protocols are showing strong growth, with TVL up 22% this month. New yield optimization strategies are emerging with AI-driven rebalancing protocols showing promise.";
    } else if (question.includes("NFT developments")) {
      responseText = "NFT market is seeing renewed interest with dynamic NFTs and AI-generated collections gaining traction. Trading volumes have increased 35% from last month with Solana NFTs leading the charge.";
    } else if (question.includes("upcoming airdrops")) {
      responseText = "Notable upcoming airdrops include several Layer 2 protocols and DEX platforms. Projects with strong community engagement and testnet participation are likely to distribute tokens in Q2.";
    }
    
    // Set a timeout to simulate AI response time
    setTimeout(() => {
      // Create the agent response with proper typing
      const agentMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "agent",
        timestamp: new Date(),
      };
      
      // Add the agent message to the chat
      setMessages(prev => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const pathname = usePathname();

  // Update the copyToClipboard function
  const copyToClipboard = (text: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show tooltip
        setShowCopyTooltip(true);
        // Hide tooltip after 2 seconds
        setTimeout(() => setShowCopyTooltip(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Stack spacing={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
          DeFAI Rewards Dashboard
        </Typography>
        
        {/* Wallet Connection */}
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
              Connect your wallet to view your rewards
            </Typography>
            
            {/* Use the WalletMultiButton directly with custom styling */}
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
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 3,
              borderRadius: 2,
              background: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(135,206,235,0.2)",
            }}
          >
            <Stack spacing={2}>
              {/* Wallet header with disconnect button */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
                  Connected Wallet
                </Typography>
                <Button
                  size="small"
                  startIcon={<Icon icon="mdi:logout" />}
                  onClick={() => disconnect()}
                  sx={{
                    color: "rgba(135,206,235,0.7)",
                    "&:hover": {
                      color: "#87CEEB",
                      bgcolor: "rgba(135,206,235,0.1)",
                    }
                  }}
                >
                  Disconnect
                </Button>
              </Stack>
              
              {/* Wallet address */}
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 1.5, 
                bgcolor: "rgba(0,0,0,0.3)", 
                border: "1px solid rgba(135,206,235,0.15)",
                cursor: "pointer",
                position: "relative",
                "&:hover": { bgcolor: "rgba(0,0,0,0.4)" }
              }} 
                onClick={() => publicKey && copyToClipboard(publicKey.toString())}
              >
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Wallet Address
                </Typography>
                
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: "bold", 
                      fontFamily: "monospace", 
                      color: "#87CEEB",
                      flexGrow: 1
                    }}
                  >
                    {publicKey?.toString()}
                  </Typography>
                  <Box sx={{ position: "relative" }}>
                    <Icon icon="mdi:content-copy" style={{ color: "#87CEEB", fontSize: "1rem" }} />
                    
                    {/* Tooltip positioned next to the copy icon */}
                    {showCopyTooltip && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: "-60px", // Position to the right of the icon
                          transform: "translateY(-50%)",
                          bgcolor: "rgba(0,0,0,0.8)",
                          color: "#87CEEB",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          zIndex: 1500,
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          animation: "fadeIn 0.2s, fadeOut 0.2s 1.8s",
                          "@keyframes fadeIn": {
                            "0%": { opacity: 0, transform: "translateY(-50%) translateX(-10px)" },
                            "100%": { opacity: 1, transform: "translateY(-50%) translateX(0)" }
                          },
                          "@keyframes fadeOut": {
                            "0%": { opacity: 1, transform: "translateY(-50%) translateX(0)" },
                            "100%": { opacity: 0, transform: "translateY(-50%) translateX(10px)" }
                          }
                        }}
                      >
                        Copied!
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>
              
              {/* Token balances */}
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                  Token Balances
                </Typography>
                
                {isLoadingBalance ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} sx={{ color: "#87CEEB" }} />
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      p: 1.5, 
                      borderRadius: 1.5, 
                      bgcolor: "rgba(135,206,235,0.05)",
                      border: "1px solid rgba(135,206,235,0.1)"
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: 'rgba(135,206,235,0.2)',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          D
                        </Avatar>
                        <Typography variant="body2" sx={{ color: "#87CEEB" }}>DEFAI</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: "#87CEEB" }}>
                        {defaiBalance === null ? '0' : defaiBalance}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      p: 1.5, 
                      borderRadius: 1.5, 
                      bgcolor: "rgba(135,206,235,0.05)",
                      border: "1px solid rgba(135,206,235,0.1)"
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: 'rgba(135,206,235,0.2)',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          A
                        </Avatar>
                        <Typography variant="body2" sx={{ color: "#87CEEB" }}>AIR</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: "#87CEEB" }}>
                        {airBalance === null ? '0' : airBalance}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
              
              {/* AI Financial Advisor Panel */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: 2,
                  background: "rgba(0,0,0,0.2)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(135,206,235,0.2)",
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "rgba(135,206,235,0.2)", color: "#87CEEB" }}>
                      <Icon icon="mdi:robot-outline" />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                      DeFAI Advisor
                    </Typography>
                  </Stack>
                  
                  <Box sx={{ position: 'relative', py: 2 }}>
                    <Typography variant="body1" sx={{ color: "#87CEEB", mb: 2 }}>
                      Based on current market conditions and your holdings, I recommend:
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Icon icon="mdi:trending-up" style={{ color: "#4caf50", fontSize: 24 }} />
                          <Typography sx={{ color: "#87CEEB" }}>
                            Increase $DEFAI holding before next governance vote
                          </Typography>
                        </Stack>
                      </Paper>
                      
                      <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Icon icon="mdi:chart-timeline-variant" style={{ color: "#ff9800", fontSize: 24 }} />
                          <Typography sx={{ color: "#87CEEB" }}>
                            Social multiplier activation could yield 15% more rewards
                          </Typography>
                        </Stack>
                      </Paper>
                      
                      <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Icon icon="mdi:calendar-clock" style={{ color: "#87CEEB", fontSize: 24 }} />
                          <Typography sx={{ color: "#87CEEB" }}>
                            Optimal reward claim time: 48 hours from now
                          </Typography>
                        </Stack>
                      </Paper>
                    </Stack>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Icon icon="mdi:auto-fix" />}
                      sx={{ 
                        mt: 2,
                        color: "#87CEEB", 
                        borderColor: "rgba(135,206,235,0.3)",
                        "&:hover": { 
                          bgcolor: "rgba(135,206,235,0.1)",
                          borderColor: "rgba(135,206,235,0.5)",
                        }
                      }}
                    >
                      Optimize Strategy
                    </Button>
                  </Box>
                </Stack>
              </Paper>
              
              {/* Eligibility check button */}
              <Box sx={{ pt: 1 }}>
                <Button 
                  fullWidth
                  variant="outlined"
                  startIcon={<Icon icon="mdi:check-circle" />}
                  onClick={() => {
                    const message: MessageType = {
                      id: Date.now().toString(),
                      text: "DeFAIza has located your wallet. You are now connected to the DeFAI Rewards ecosystem!",
                      sender: "agent",
                      timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, message]);
                  }}
                  sx={{ 
                    color: "#87CEEB",
                    borderColor: "rgba(135,206,235,0.3)",
                    py: 1,
                    "&:hover": { 
                      bgcolor: "rgba(135,206,235,0.1)",
                      borderColor: "rgba(135,206,235,0.5)",
                    }
                  }}
                >
                  Check Eligibility
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Quick Topics */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "rgba(0,0,0,0.4)",
            borderRadius: 2,
            border: "1px solid rgba(135,206,235,0.2)",
            overflow: "hidden",
            height: { xs: "60vh", sm: "70vh" }, // Adjust height on mobile
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Quick question topics - Scroll horizontally on mobile */}
          <Box
            sx={{
              display: "flex",
              p: 1.5,
              gap: 1,
              borderBottom: "1px solid rgba(135,206,235,0.2)",
              bgcolor: "rgba(0,0,0,0.3)",
              overflowX: "auto", // Allow horizontal scrolling on mobile
              WebkitOverflowScrolling: "touch", // Better scrolling on iOS
              "&::-webkit-scrollbar": {
                height: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(135,206,235,0.3)",
                borderRadius: "4px",
              },
            }}
          >
            {quickTopics.map((topic) => (
              <Chip
                key={topic.id}
                label={topic.label}
                onClick={() => handleQuickQuestion(topic.question)}
                sx={{
                  color: "#87CEEB",
                  borderColor: "rgba(135,206,235,0.3)",
                  bgcolor: "rgba(135,206,235,0.05)",
                  "&:hover": {
                    bgcolor: "rgba(135,206,235,0.1)",
                    borderColor: "rgba(135,206,235,0.5)",
                  },
                  whiteSpace: "nowrap", // Prevent wrapping on mobile
                  flexShrink: 0, // Prevent chips from shrinking on mobile
                }}
              />
            ))}
          </Box>

          {/* Messages container with improved mobile styling */}
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 1.5, sm: 2 }, // Less padding on mobile
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: { xs: "85%", sm: "75%" }, // Wider messages on mobile
                }}
              >
                {message.sender === "agent" && (
                  <Avatar 
                    sx={{ 
                      mr: 1, 
                      bgcolor: "rgba(135,206,235,0.2)",
                      border: "1px solid rgba(135,206,235,0.4)",
                    }}
                    src="/defaiza.png"
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: "bold", color: "#87CEEB" }}>AI</Typography>
                  </Avatar>
                )}
                
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: message.sender === "user" 
                      ? "rgba(255,255,255,0.1)" 
                      : "rgba(135,206,235,0.1)",
                    border: message.sender === "user"
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid rgba(135,206,235,0.2)",
                    animation: message.sender === "agent" ? `${float} 4s infinite ease-in-out` : "none",
                    fontFamily: message.sender === "agent" ? "monospace" : "inherit",
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {message.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: "block", 
                      mt: 1, 
                      color: "rgba(255,255,255,0.7)",
                      fontWeight: "500"
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                
                {message.sender === "user" && (
                  <Avatar 
                    sx={{ 
                      ml: 1, 
                      bgcolor: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: "bold", color: "#87CEEB" }}>YOU</Typography>
                  </Avatar>
                )}
              </Box>
            ))}
            
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  mb: 2,
                }}
              >
                <Avatar 
                  sx={{ 
                    mr: 1, 
                    bgcolor: "rgba(135,206,235,0.2)",
                    border: "1px solid rgba(135,206,235,0.4)",
                  }}
                  src="/defaiza.png"
                >
                  <Typography sx={{ fontSize: 12, fontWeight: "bold", color: "#87CEEB" }}>AI</Typography>
                </Avatar>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(135,206,235,0.1)",
                    border: "1px solid rgba(135,206,235,0.2)",
                    width: 80,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography 
                    sx={{ 
                      animation: `${pulse} 1.5s infinite ease-in-out`,
                      fontSize: "1.5rem",
                    }}
                  >
                    ...
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          
          {/* Input area with improved mobile styles */}
          <Box 
            sx={{ 
              p: { xs: 1, sm: 2 }, // Less padding on mobile
              borderTop: "1px solid rgba(135,206,235,0.2)",
              bgcolor: "rgba(0,0,0,0.3)",
            }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask about your rewards..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: { xs: "0.875rem", sm: "1rem" }, // Smaller font on mobile
                    color: "#fff",
                    borderRadius: 2,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(135,206,235,0.5)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(135,206,235,0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(135,206,235,0.5)",
                    },
                  },
                }}
              />
              <IconButton 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                sx={{ 
                  bgcolor: "rgba(135,206,235,0.1)",
                  border: "1px solid rgba(135,206,235,0.3)",
                  color: "#87CEEB",
                  borderRadius: 2,
                  p: { xs: 0.75, sm: 1 }, // Smaller padding on mobile
                  "&:hover": {
                    bgcolor: "rgba(135,206,235,0.2)",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(135,206,235,0.3)",
                  }
                }}
              >
                <Icon icon="mdi:send" width={24} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>

        {/* Learning & Credentials */}
        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#87CEEB",
              mb: 3,
            }}
          >
            DeFAI Credentials
          </Typography>

          <Grid container spacing={3}>
            {/* Beginner Card */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: "rgba(0,0,0,0.2)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(135,206,235,0.2)",
                  borderRadius: 2
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Icon icon="mdi:school" style={{ color: "#87CEEB", width: 24, height: 24 }} />
                  <Typography variant="h6" sx={{ color: "#87CEEB", flexGrow: 1 }}>
                    Beginner
                  </Typography>
                  <Chip 
                    label="Completed" 
                    sx={{ 
                      bgcolor: "rgba(0,128,0,0.2)", 
                      color: "#00C853",
                      borderRadius: '16px'
                    }} 
                  />
                </Stack>
                
                <Box sx={{ width: '100%', mb: 3 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={100} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(135,206,235,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#87CEEB'
                      }
                    }} 
                  />
                </Box>
                
                <Typography sx={{ color: "rgba(135,206,235,0.8)", mb: 3, flexGrow: 1 }}>
                  You've mastered the basics of DeFAI tokenomics and earned a 1.1x multiplier.
                </Typography>
                
                <Button
                  variant="outlined"
                  endIcon={<Icon icon="mdi:arrow-right" />}
                  sx={{ 
                    color: "#87CEEB", 
                    borderColor: "rgba(135,206,235,0.3)",
                    alignSelf: 'flex-start',
                    "&:hover": {
                      borderColor: "rgba(135,206,235,0.6)",
                      bgcolor: "rgba(135,206,235,0.1)",
                    }
                  }}
                >
                  REVIEW
                </Button>
              </Paper>
            </Grid>
            
            {/* Intermediate Card */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: "rgba(0,0,0,0.2)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(135,206,235,0.2)",
                  borderRadius: 2
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Icon icon="mdi:chart-line" style={{ color: "#87CEEB", width: 24, height: 24 }} />
                  <Typography variant="h6" sx={{ color: "#87CEEB", flexGrow: 1 }}>
                    Intermediate
                  </Typography>
                  <Chip 
                    label="In Progress" 
                    sx={{ 
                      bgcolor: "rgba(255,152,0,0.2)", 
                      color: "#FFA726",
                      borderRadius: '16px'
                    }} 
                  />
                </Stack>
                
                <Box sx={{ width: '100%', mb: 3 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={60} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(135,206,235,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#87CEEB'
                      }
                    }} 
                  />
                </Box>
                
                <Typography sx={{ color: "rgba(135,206,235,0.8)", mb: 3, flexGrow: 1 }}>
                  Complete 2 more advanced tasks to unlock a 1.25x multiplier.
                </Typography>
                
                <Button
                  variant="outlined"
                  endIcon={<Icon icon="mdi:arrow-right" />}
                  sx={{ 
                    color: "#87CEEB", 
                    borderColor: "rgba(135,206,235,0.3)",
                    alignSelf: 'flex-start',
                    "&:hover": {
                      borderColor: "rgba(135,206,235,0.6)",
                      bgcolor: "rgba(135,206,235,0.1)",
                    }
                  }}
                >
                  CONTINUE
                </Button>
              </Paper>
            </Grid>
            
            {/* Advanced Card */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: "rgba(0,0,0,0.2)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(135,206,235,0.2)",
                  borderRadius: 2
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Icon icon="mdi:trophy" style={{ color: "#87CEEB", width: 24, height: 24 }} />
                  <Typography variant="h6" sx={{ color: "#87CEEB", flexGrow: 1 }}>
                    Advanced
                  </Typography>
                  <Chip 
                    label="Locked" 
                    sx={{ 
                      bgcolor: "rgba(100,100,100,0.2)", 
                      color: "#9E9E9E",
                      borderRadius: '16px'
                    }} 
                  />
                </Stack>
                
                <Box sx={{ width: '100%', mb: 3 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={0} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(135,206,235,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#87CEEB'
                      }
                    }} 
                  />
                </Box>
                
                <Typography sx={{ color: "rgba(135,206,235,0.8)", mb: 3, flexGrow: 1 }}>
                  Advanced credentials unlock a 1.5x permanent multiplier.
                </Typography>
                
                <Button
                  variant="outlined"
                  endIcon={<Icon icon="mdi:arrow-right" />}
                  disabled
                  sx={{ 
                    color: "#87CEEB", 
                    borderColor: "rgba(135,206,235,0.3)",
                    alignSelf: 'flex-start',
                    "&:hover": {
                      borderColor: "rgba(135,206,235,0.6)",
                      bgcolor: "rgba(135,206,235,0.1)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(135,206,235,0.5)",
                      borderColor: "rgba(135,206,235,0.1)",
                    }
                  }}
                >
                  START
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center', color: 'rgba(135,206,235,0.5)' }}>
          <Typography variant="body2">
            DeFAI Dashboard v1.0
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

// Main component export that wraps everything in the wallet providers
export default function Dashboard() {
  return (
    <WalletConnectWrapper>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </WalletConnectWrapper>
  );
} 