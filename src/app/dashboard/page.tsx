"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { Icon } from "@iconify/react";
import { keyframes } from "@mui/system";
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import required CSS for the wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

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

// Create a wallet wrapper component
function WalletConnectWrapper({ children }: WalletWrapperProps) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Mainnet;
  
  // You can also provide a custom endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Only use wallets that are working properly with our setup
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
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Dashboard component with wallet capabilities
function DashboardContent() {
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
  
  // Get wallet context
  const { publicKey, disconnect } = useWallet();
  
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

  // Handle wallet connect status change to update AI response
  useEffect(() => {
    if (publicKey) {
      // Add a wallet connected message
      const walletMessage: MessageType = {
        id: Date.now().toString(),
        text: `Wallet connected: ${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`,
        sender: "user",
        timestamp: new Date(),
      };
      
      setTimeout(() => {
        const agentResponse: MessageType = {
          id: (Date.now() + 1).toString(),
          text: `Great! I can now access your reward data. Your wallet ${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)} has been connected to the DeFAI ecosystem.`,
          sender: "agent",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, walletMessage, agentResponse]);
      }, 1000);
    }
  }, [publicKey]);

  return (
    <Container 
      maxWidth={false}
      disableGutters
      sx={{ 
        background: "linear-gradient(180deg, #000000 0%, #1a1a2e 100%) !important", 
        minHeight: "100vh !important",
        width: "100% !important",
        margin: "0 !important",
        padding: "2rem !important",
        boxSizing: "border-box !important",
        color: "#87CEEB",
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
        {/* Header */}
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            fontFamily: "monospace", 
            textShadow: "0 0 10px rgba(135,206,235,0.7)",
            mb: 4,
          }}
        >
          DeFAI Rewards Dashboard
        </Typography>
        
        {/* Wallet Connection */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2
          }}
        >
          {publicKey ? (
            <Chip
              icon={<Icon icon="mdi:wallet" />}
              label={`${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`}
              variant="outlined"
              onDelete={() => disconnect()}
              deleteIcon={<Icon icon="mdi:logout" />}
              sx={{
                color: '#87CEEB',
                borderColor: 'rgba(135,206,235,0.5)',
                bgcolor: 'rgba(135,206,235,0.1)',
                '& .MuiChip-deleteIcon': {
                  color: 'rgba(135,206,235,0.7)',
                  '&:hover': {
                    color: '#87CEEB',
                  }
                },
              }}
            />
          ) : (
            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:wallet" />}
              sx={{
                color: '#87CEEB',
                borderColor: 'rgba(135,206,235,0.5)',
                '&:hover': {
                  borderColor: '#87CEEB',
                  bgcolor: 'rgba(135,206,235,0.1)',
                },
              }}
              onClick={() => {
                // The wallet adapter modal will be shown
                document.querySelector('.wallet-adapter-button')?.dispatchEvent(
                  new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                  })
                );
              }}
            >
              Connect Wallet
            </Button>
          )}
          
          {/* Hidden wallet button that will be triggered by our custom UI */}
          <Box sx={{ position: 'absolute', visibility: 'hidden', width: 0, height: 0, overflow: 'hidden' }}>
            <WalletMultiButton />
          </Box>
        </Box>

        {/* Quick Topics */}
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", py: 1, px: 2 }}>
          {quickTopics.map((topic) => (
            <Button
              key={topic.id}
              variant="outlined"
              size="small"
              onClick={() => handleQuickQuestion(topic.question)}
              sx={{
                color: "#87CEEB",
                borderColor: "rgba(135,206,235,0.3)",
                whiteSpace: "nowrap",
                "&:hover": {
                  borderColor: "rgba(135,206,235,0.6)",
                  bgcolor: "rgba(135,206,235,0.1)",
                },
              }}
            >
              {topic.label}
            </Button>
          ))}
        </Stack>
        
        {/* Chat container */}
        <Paper 
          elevation={0}
          sx={{
            height: "70vh", 
            bgcolor: "rgba(0,0,0,0.5)",
            borderRadius: 2,
            border: "1px solid rgba(135,206,235,0.2)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Message area */}
          <Box 
            sx={{ 
              p: 2, 
              flexGrow: 1, 
              overflow: "auto",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxHeight: "calc(70vh - 130px)",
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
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
                    <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>AI</Typography>
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
                    <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>YOU</Typography>
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
                  <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>AI</Typography>
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
          
          {/* Input area */}
          <Box 
            sx={{ 
              p: 2, 
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
                  p: 1,
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

        {/* Navigation back to home */}
        <Button
          variant="outlined"
          component="a"
          href="/"
          startIcon={<Icon icon="mdi:arrow-left" />}
          sx={{ 
            color: "#87CEEB", 
            borderColor: "rgba(135,206,235,0.3)",
            alignSelf: "center",
            mt: 2,
            "&:hover": {
              borderColor: "rgba(135,206,235,0.6)",
              bgcolor: "rgba(135,206,235,0.1)",
            }
          }}
        >
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
}

// Main component export that wraps everything in the wallet providers
export default function Dashboard() {
  return (
    <WalletConnectWrapper>
      <DashboardContent />
    </WalletConnectWrapper>
  );
} 