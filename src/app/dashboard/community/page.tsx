"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  IconButton,
  Tab,
  Tabs,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useWallet, useConnection, ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// Add WalletWrapperProps interface
interface WalletWrapperProps {
  children: React.ReactNode;
}

// Define WalletConnectWrapper component inline
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

// Twitter user interface
interface TwitterUser {
  id: string;
  handle: string;
  displayName: string;
  avatar: string;
  followers: number;
  verified: boolean;
}

// Community data interface
interface CommunityData {
  stats: {
    members: number;
    activeUsers: number;
    posts: number;
    growthRate: number;
  };
  discussions: any[];
  events: any[];
  contributors: any[];
}

// Create a separate component that uses useSearchParams
function CommunityContentWithParams() {
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [twitterUser, setTwitterUser] = useState<TwitterUser | null>(null);
  const [twitterAuthError, setTwitterAuthError] = useState<string | null>(null);
  const router = useRouter();
  
  // Handle Twitter login
  const handleTwitterLogin = () => {
    setIsLoading(true);
    
    try {
      // Get Twitter OAuth configuration from environment variables
      const clientId = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI;
      
      if (!clientId || !redirectUri) {
        throw new Error("Twitter OAuth configuration is missing");
      }
      
      // Generate a random state parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('twitter_auth_state', state);
      
      // Create the authorization URL with proper parameters
      const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('scope', 'tweet.read users.read offline.access');
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('code_challenge', 'challenge');
      authUrl.searchParams.append('code_challenge_method', 'plain');
      
      // Redirect to Twitter authorization page
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Twitter login error:", error);
      setTwitterAuthError("Failed to initialize Twitter login");
      setIsLoading(false);
      
      // Fallback to simulated login for development
      simulateTwitterLogin();
    }
  };
  
  // Simulate Twitter login for development/fallback
  const simulateTwitterLogin = () => {
    setTimeout(() => {
      setTwitterUser({
        id: '123456789',
        handle: 'crypto_enthusiast',
        displayName: 'Crypto Enthusiast',
        avatar: 'https://i.pravatar.cc/150?img=3',
        followers: 1245,
        verified: true
      });
      
      // Initialize community data
      loadCommunityData();
    }, 1500);
  };
  
  // Load community data
  const loadCommunityData = () => {
    setCommunityData({
      stats: {
        members: 12458,
        activeUsers: 1245,
        posts: 8732,
        growthRate: 18
      },
      discussions: [
        {
          id: 1,
          author: "blockchain_dev",
          avatar: "https://i.pravatar.cc/150?img=1",
          title: "DeFAI's AI predictions are spot on!",
          content: "Just wanted to share that the AI predictions for ETH price movement were incredibly accurate this week.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          likes: 24,
          replies: 7
        },
        {
          id: 2,
          author: "defi_trader",
          avatar: "https://i.pravatar.cc/150?img=2",
          title: "Yield strategy feedback needed",
          content: "I've been testing the new yield optimization strategy. Getting about 12% APY. Has anyone tested it long-term?",
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          likes: 18,
          replies: 12
        },
        {
          id: 3,
          author: "crypto_enthusiast",
          avatar: "https://i.pravatar.cc/150?img=3",
          title: "Governance proposal discussion",
          content: "I'm drafting a governance proposal to improve the token distribution model. Looking for feedback before submission.",
          timestamp: new Date(Date.now() - 1000 * 60 * 240),
          likes: 32,
          replies: 15
        }
      ],
      events: [
        {
          id: 1,
          title: "DeFAI Community Call",
          description: "Monthly community call to discuss project updates and roadmap.",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
          attendees: 156,
          location: "Discord"
        },
        {
          id: 2,
          title: "Governance Proposal Review",
          description: "Review and vote on the latest governance proposals.",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          attendees: 89,
          location: "Snapshot"
        },
        {
          id: 3,
          title: "DeFi x AI Workshop",
          description: "Technical workshop on integrating AI models with DeFi protocols.",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
          attendees: 112,
          location: "YouTube Live"
        }
      ],
      contributors: [
        {
          id: 1,
          name: "Alex Chen",
          avatar: "https://i.pravatar.cc/150?img=4",
          contributions: 156,
          role: "Core Developer"
        },
        {
          id: 2,
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=5",
          contributions: 132,
          role: "Community Manager"
        },
        {
          id: 3,
          name: "Michael Rodriguez",
          avatar: "https://i.pravatar.cc/150?img=6",
          contributions: 98,
          role: "Protocol Researcher"
        },
        {
          id: 4,
          name: "Jessica Kim",
          avatar: "https://i.pravatar.cc/150?img=7",
          contributions: 87,
          role: "Content Creator"
        },
        {
          id: 5,
          name: "David Park",
          avatar: "https://i.pravatar.cc/150?img=8",
          contributions: 76,
          role: "Technical Advisor"
        },
        {
          id: 6,
          name: "Emma Wilson",
          avatar: "https://i.pravatar.cc/150?img=9",
          contributions: 64,
          role: "Ambassador"
        }
      ]
    });
    
    setIsLoading(false);
  };
  
  // Check for Twitter auth callback on component mount
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Parse the URL for auth code and state
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem('twitter_auth_state');
      
      // If we have a code and state matches, process the auth
      if (code && state && storedState && state === storedState) {
        setIsLoading(true);
        
        // In a real implementation, you would exchange the code for tokens
        // For now, we'll simulate a successful auth
        simulateTwitterLogin();
        
        // Clean up the URL and state
        localStorage.removeItem('twitter_auth_state');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Format event date
  const formatEventDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
          DeFAI Community
        </Typography>
        
        {/* Twitter Login Section */}
        {!twitterUser ? (
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
              Connect with X (Twitter) to join the community
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:twitter" />}
              onClick={handleTwitterLogin}
              disabled={isLoading}
              sx={{ 
                bgcolor: "rgba(29,161,242,0.2)",
                color: "#1DA1F2",
                border: "1px solid rgba(29,161,242,0.4)",
                py: 1.5,
                px: 3,
                borderRadius: "8px",
                fontWeight: "medium",
                "&:hover": {
                  bgcolor: "rgba(29,161,242,0.3)",
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#1DA1F2" }} />
              ) : (
                "Login with X"
              )}
            </Button>
            
            {twitterAuthError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  bgcolor: "rgba(244,67,54,0.1)",
                  color: "#f44336",
                  border: "1px solid rgba(244,67,54,0.2)"
                }}
              >
                {twitterAuthError}
              </Alert>
            )}
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(135,206,235,0.2)",
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={40} sx={{ color: "#87CEEB" }} />
              </Box>
            ) : (
              <Box>
                {/* User profile section */}
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      src={twitterUser.avatar} 
                      sx={{ width: 60, height: 60, border: '2px solid #1DA1F2' }}
                    />
                    <Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                          {twitterUser.displayName}
                        </Typography>
                        {twitterUser.verified && (
                          <Icon icon="mdi:check-decagram" style={{ color: '#1DA1F2' }} />
                        )}
                      </Stack>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        @{twitterUser.handle}
                      </Typography>
                    </Stack>
                    <Chip 
                      icon={<Icon icon="mdi:account-group" />}
                      label={`${twitterUser.followers.toLocaleString()} followers`}
                      sx={{ 
                        ml: 'auto',
                        bgcolor: "rgba(29,161,242,0.1)",
                        color: "#1DA1F2",
                        border: "1px solid rgba(29,161,242,0.3)",
                      }}
                    />
                  </Stack>
                </Box>
                
                {communityData && (
                  <Box>
                    {/* Community stats */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: "#87CEEB" }}>
                        Community Stats
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Stack alignItems="center">
                            <Typography variant="h5" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                              {communityData.stats.members.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                              Members
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Stack alignItems="center">
                            <Typography variant="h5" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                              {communityData.stats.activeUsers.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                              Active Now
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Stack alignItems="center">
                            <Typography variant="h5" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                              {communityData.stats.posts.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                              Total Posts
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Stack alignItems="center">
                            <Typography variant="h5" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                              {communityData.stats.growthRate}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                              Monthly Growth
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    {/* Tabs */}
                    <Box>
                      <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange}
                        sx={{ 
                          borderBottom: "1px solid rgba(135,206,235,0.1)",
                          '.MuiTabs-indicator': { backgroundColor: '#87CEEB' },
                          '.MuiTab-root': { color: 'rgba(135,206,235,0.7)' },
                          '.Mui-selected': { color: '#87CEEB' } 
                        }}
                      >
                        <Tab label="Discussions" />
                        <Tab label="Events" />
                        <Tab label="Contributors" />
                      </Tabs>
                      
                      {/* Tab content */}
                      <Box sx={{ py: 3 }}>
                        {/* Discussions Tab */}
                        {activeTab === 0 && (
                          <Box>
                            {/* New post input */}
                            <Box sx={{ mb: 3 }}>
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Start a new discussion..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                sx={{
                                  bgcolor: "rgba(0,0,0,0.2)",
                                  borderRadius: 1,
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: 'rgba(135,206,235,0.2)',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: 'rgba(135,206,235,0.4)',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#87CEEB',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    color: 'white',
                                  }
                                }}
                              />
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                  variant="contained"
                                  disabled={!newMessage.trim()}
                                  startIcon={<Icon icon="mdi:send" />}
                                  sx={{ 
                                    bgcolor: "rgba(135,206,235,0.2)",
                                    color: "#87CEEB",
                                    border: "1px solid rgba(135,206,235,0.4)",
                                    "&:hover": { 
                                      bgcolor: "rgba(135,206,235,0.3)",
                                    }
                                  }}
                                >
                                  Post
                                </Button>
                              </Box>
                            </Box>
                            
                            {/* Discussion list */}
                            <List sx={{ p: 0 }}>
                              {communityData.discussions.map((discussion) => (
                                <Paper 
                                  key={discussion.id}
                                  sx={{ 
                                    mb: 2, 
                                    p: 2, 
                                    bgcolor: "rgba(0,0,0,0.2)",
                                    border: "1px solid rgba(135,206,235,0.1)"
                                  }}
                                >
                                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                      <Avatar src={discussion.avatar} />
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Box>
                                          <Typography sx={{ color: "#87CEEB", fontWeight: "medium" }}>
                                            {discussion.title}
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", fontSize: '0.8rem' }}>
                                            by @{discussion.author} • {formatTimeAgo(discussion.timestamp)}
                                          </Typography>
                                        </Box>
                                      }
                                      secondary={
                                        <Typography 
                                          component="span"
                                          variant="body2"
                                          sx={{ 
                                            display: 'inline',
                                            color: "rgba(255,255,255,0.8)",
                                            mt: 1
                                          }}
                                        >
                                          {discussion.content}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                  <Box sx={{ display: 'flex', mt: 1, justifyContent: 'flex-end' }}>
                                    <Button
                                      startIcon={<Icon icon="mdi:thumb-up-outline" />}
                                      size="small"
                                      sx={{ 
                                        color: "rgba(135,206,235,0.7)",
                                        mr: 1,
                                        "&:hover": { color: "#87CEEB" }
                                      }}
                                    >
                                      {discussion.likes}
                                    </Button>
                                    <Button
                                      startIcon={<Icon icon="mdi:comment-outline" />}
                                      size="small"
                                      sx={{ 
                                        color: "rgba(135,206,235,0.7)",
                                        "&:hover": { color: "#87CEEB" }
                                      }}
                                    >
                                      {discussion.replies}
                                    </Button>
                                  </Box>
                                </Paper>
                              ))}
                            </List>
                          </Box>
                        )}
                        
                        {/* Events Tab */}
                        {activeTab === 1 && (
                          <Box>
                            <Grid container spacing={2}>
                              {communityData.events.map((event) => (
                                <Grid item xs={12} md={4} key={event.id}>
                                  <Paper 
                                    sx={{ 
                                      p: 2, 
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      bgcolor: "rgba(0,0,0,0.2)",
                                      border: "1px solid rgba(135,206,235,0.1)"
                                    }}
                                  >
                                    <Typography sx={{ color: "#87CEEB", fontWeight: "medium", mb: 1 }}>
                                      {event.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2, flexGrow: 1 }}>
                                      {event.description}
                                    </Typography>
                                    <Divider sx={{ borderColor: 'rgba(135,206,235,0.1)', my: 1 }} />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <Chip 
                                        icon={<Icon icon="mdi:calendar" />}
                                        label={formatEventDate(event.date)}
                                        size="small"
                                        sx={{ 
                                          bgcolor: "rgba(135,206,235,0.1)",
                                          color: "#87CEEB",
                                          border: "1px solid rgba(135,206,235,0.2)",
                                        }}
                                      />
                                      <Chip 
                                        icon={<Icon icon="mdi:account-group" />}
                                        label={`${event.attendees} attending`}
                                        size="small"
                                        sx={{ 
                                          bgcolor: "rgba(76,175,80,0.1)",
                                          color: "#4caf50",
                                          border: "1px solid rgba(76,175,80,0.2)",
                                        }}
                                      />
                                    </Stack>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Icon icon="mdi:calendar-check" />}
                                      sx={{ 
                                        mt: 2,
                                        color: "#87CEEB", 
                                        borderColor: "rgba(135,206,235,0.3)",
                                        "&:hover": {
                                          borderColor: "rgba(135,206,235,0.6)",
                                          bgcolor: "rgba(135,206,235,0.1)",
                                        }
                                      }}
                                    >
                                      RSVP
                                    </Button>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                        
                        {/* Contributors Tab */}
                        {activeTab === 2 && (
                          <Box>
                            <Grid container spacing={2}>
                              {communityData.contributors.map((contributor, index) => (
                                <Grid item xs={12} sm={6} md={4} key={contributor.id}>
                                  <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.3)", border: "1px solid rgba(135,206,235,0.2)" }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Avatar 
                                        src={contributor.avatar}
                                        sx={{ 
                                          width: 50, 
                                          height: 50,
                                          border: index < 3 ? '2px solid #FFD700' : 'none'
                                        }}
                                      />
                                      <Stack>
                                        <Typography sx={{ color: "#87CEEB" }}>
                                          {contributor.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                                          {contributor.role}
                                        </Typography>
                                      </Stack>
                                      {index < 3 && (
                                        <Chip 
                                          label={`#${index + 1}`} 
                                          size="small"
                                          sx={{ 
                                            ml: 'auto',
                                            bgcolor: "rgba(255,215,0,0.1)",
                                            color: "#FFD700",
                                            border: "1px solid rgba(255,215,0,0.3)",
                                          }}
                                        />
                                      )}
                                    </Stack>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                            
                            <Alert 
                              severity="info" 
                              icon={<Icon icon="mdi:information" />}
                              sx={{ 
                                mt: 3,
                                bgcolor: "rgba(33,150,243,0.1)", 
                                color: "#2196f3",
                                border: "1px solid rgba(33,150,243,0.2)"
                              }}
                            >
                              <Typography variant="body2">
                                Contributors are ranked based on their participation in discussions, governance proposals, 
                                and community events. Become a top contributor to earn exclusive rewards and recognition!
                              </Typography>
                            </Alert>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

// Main content component with Suspense
function CommunityContent() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={40} sx={{ color: "#87CEEB" }} />
      </Box>
    }>
      <CommunityContentWithParams />
    </Suspense>
  );
}

// Main component export that wraps everything in the wallet providers
export default function CommunityPage() {
  return (
    <WalletConnectWrapper>
      <DashboardLayout>
        <CommunityContent />
      </DashboardLayout>
    </WalletConnectWrapper>
  );
} 