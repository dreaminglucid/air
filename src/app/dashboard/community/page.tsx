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
  
  // Twitter OAuth configuration
  const TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || "";
  const REDIRECT_URI = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI || "";
  
  // Handle Twitter login
  const handleTwitterLogin = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
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
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            attendees: 156,
            location: "Discord"
          },
          {
            id: 2,
            title: "AI Trading Workshop",
            description: "Learn how to use DeFAI's AI tools for better trading decisions.",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            attendees: 89,
            location: "Zoom Webinar"
          },
          {
            id: 3,
            title: "ETH Denver Meetup",
            description: "Meet the DeFAI team at ETH Denver!",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            attendees: 42,
            location: "Denver, CO"
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
    }, 1500);
  };
  
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
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              background: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(135,206,235,0.2)",
              overflow: "hidden"
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={40} sx={{ color: "#87CEEB" }} />
              </Box>
            ) : (
              <Box>
                {/* Twitter user info */}
                <Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 3, borderBottom: "1px solid rgba(135,206,235,0.1)" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      src={twitterUser.avatar} 
                      sx={{ width: 48, height: 48, border: "2px solid #1DA1F2" }}
                    />
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          {twitterUser.displayName}
                        </Typography>
                        {twitterUser.verified && (
                          <Icon icon="mdi:check-decagram" style={{ color: "#1DA1F2", fontSize: 16 }} />
                        )}
                      </Stack>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        @{twitterUser.handle} • {twitterUser.followers.toLocaleString()} followers
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        ml: 'auto',
                        color: "#87CEEB",
                        borderColor: "rgba(135,206,235,0.3)",
                        "&:hover": { 
                          bgcolor: "rgba(135,206,235,0.1)",
                          borderColor: "rgba(135,206,235,0.5)",
                        }
                      }}
                      onClick={() => {
                        setTwitterUser(null);
                        setCommunityData(null);
                        // In a real app, you would also revoke the Twitter token
                      }}
                    >
                      Sign Out
                    </Button>
                  </Stack>
                </Box>
                
                {communityData && (
                  <Box>
                    {/* Community Stats */}
                    <Box sx={{ px: 3, py: 2, bgcolor: "rgba(0,0,0,0.15)" }}>
                      <Grid container spacing={3}>
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
                              Posts
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Stack alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Typography variant="h5" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                {communityData.stats.growthRate}%
                              </Typography>
                              <Icon icon="mdi:trending-up" style={{ color: "#4caf50", fontSize: 20 }} />
                            </Stack>
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
                      
                      {/* Discussions Tab */}
                      {activeTab === 0 && (
                        <Box sx={{ p: 3 }}>
                          {/* New post input */}
                          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Avatar 
                              src={twitterUser.avatar}
                              sx={{ width: 40, height: 40 }}
                            />
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              placeholder="Start a new discussion..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              sx={{
                                '.MuiOutlinedInput-root': {
                                  bgcolor: 'rgba(0,0,0,0.2)',
                                  borderRadius: 2,
                                  '& fieldset': {
                                    borderColor: 'rgba(135,206,235,0.2)',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'rgba(135,206,235,0.4)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(135,206,235,0.6)',
                                  },
                                },
                                input: { color: '#fff' },
                                textarea: { color: '#fff' }
                              }}
                            />
                            <IconButton
                              onClick={() => {
                                if (!newMessage.trim()) return;
                                
                                // In a real app, you would send this to your API
                                console.log("Sending message:", newMessage);
                                
                                // Clear input and simulate message posting
                                setNewMessage("");
                                
                                // Update the community data with the new message
                                if (communityData) {
                                  const updatedDiscussions = [
                                    {
                                      id: Date.now(),
                                      author: {
                                        name: twitterUser?.handle || "You",
                                        avatar: twitterUser?.avatar || "https://i.pravatar.cc/150?img=10"
                                      },
                                      title: "New discussion",
                                      content: newMessage,
                                      timestamp: new Date(),
                                      likes: 0,
                                      replies: 0
                                    },
                                    ...communityData.discussions
                                  ];
                                  
                                  setCommunityData({
                                    ...communityData,
                                    discussions: updatedDiscussions,
                                    stats: {
                                      ...communityData.stats,
                                      posts: communityData.stats.posts + 1
                                    }
                                  });
                                }
                              }}
                              disabled={!newMessage.trim()}
                              sx={{ 
                                bgcolor: "rgba(135,206,235,0.1)",
                                border: "1px solid rgba(135,206,235,0.3)",
                                color: "#87CEEB",
                                alignSelf: 'flex-end',
                                p: 1,
                                '&:hover': { 
                                  bgcolor: "rgba(135,206,235,0.2)" 
                                },
                                '&.Mui-disabled': {
                                  color: 'rgba(135,206,235,0.3)'
                                }
                              }}
                            >
                              <Icon icon="mdi:send" />
                            </IconButton>
                          </Stack>
                          
                          {/* Discussion list */}
                          <List sx={{ width: '100%' }}>
                            {communityData.discussions.map((discussion) => (
                              <React.Fragment key={discussion.id}>
                                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                  <ListItemAvatar>
                                    <Avatar src={discussion.author.avatar} />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                          {discussion.author.name}
                                        </Typography>
                                        <Typography 
                                          component="span" 
                                          variant="body2" 
                                          sx={{ color: 'rgba(255,255,255,0.5)' }}
                                        >
                                          • {formatTimeAgo(discussion.timestamp)}
                                        </Typography>
                                      </Stack>
                                    }
                                    secondary={
                                      <Box sx={{ mt: 1 }}>
                                        <Typography 
                                          component="div" 
                                          variant="subtitle2" 
                                          sx={{ color: '#87CEEB', mb: 0.5 }}
                                        >
                                          {discussion.title}
                                        </Typography>
                                        <Typography 
                                          component="div" 
                                          variant="body2" 
                                          sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}
                                        >
                                          {discussion.content}
                                        </Typography>
                                        <Stack direction="row" spacing={2}>
                                          <Button 
                                            size="small" 
                                            startIcon={<Icon icon="mdi:thumb-up-outline" />}
                                            sx={{ 
                                              color: 'rgba(135,206,235,0.7)',
                                              '&:hover': { color: '#87CEEB' }
                                            }}
                                          >
                                            {discussion.likes}
                                          </Button>
                                          <Button 
                                            size="small" 
                                            startIcon={<Icon icon="mdi:message-outline" />}
                                            sx={{ 
                                              color: 'rgba(135,206,235,0.7)',
                                              '&:hover': { color: '#87CEEB' }
                                            }}
                                          >
                                            {discussion.replies}
                                          </Button>
                                          <Button 
                                            size="small" 
                                            startIcon={<Icon icon="mdi:share-outline" />}
                                            sx={{ 
                                              color: 'rgba(135,206,235,0.7)',
                                              '&:hover': { color: '#87CEEB' }
                                            }}
                                          >
                                            Share
                                          </Button>
                                        </Stack>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                                <Divider component="li" sx={{ borderColor: 'rgba(135,206,235,0.1)', my: 1 }} />
                              </React.Fragment>
                            ))}
                          </List>
                        </Box>
                      )}
                      
                      {/* Events Tab */}
                      {activeTab === 1 && (
                        <Box sx={{ p: 3 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, color: "#87CEEB" }}>
                            Upcoming Community Events
                          </Typography>
                          
                          <Grid container spacing={2}>
                            {communityData.events.map((event) => (
                              <Grid item xs={12} md={4} key={event.id}>
                                <Paper 
                                  sx={{ 
                                    p: 2, 
                                    height: '100%',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    bgcolor: "rgba(0,0,0,0.3)", 
                                    border: "1px solid rgba(135,206,235,0.2)",
                                    transition: "all 0.2s ease",
                                    "&:hover": { 
                                      transform: "translateY(-3px)",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                                    }
                                  }}
                                >
                                  <Stack spacing={2} sx={{ height: '100%' }}>
                                    <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                                      {event.title}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", flexGrow: 1 }}>
                                      {event.description}
                                    </Typography>
                                    
                                    <Stack spacing={1}>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Icon icon="mdi:calendar" style={{ color: "#87CEEB", fontSize: 18 }} />
                                        <Typography variant="body2" sx={{ color: "#fff" }}>
                                          {formatEventDate(event.date)}
                                        </Typography>
                                      </Stack>
                                      
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Icon icon="mdi:account-group" style={{ color: "#87CEEB", fontSize: 18 }} />
                                        <Typography variant="body2" sx={{ color: "#fff" }}>
                                          {event.attendees} attending
                                        </Typography>
                                      </Stack>
                                      
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Icon icon="mdi:map-marker" style={{ color: "#87CEEB", fontSize: 18 }} />
                                        <Typography variant="body2" sx={{ color: "#fff" }}>
                                          {event.location}
                                        </Typography>
                                      </Stack>
                                    </Stack>
                                    
                                    <Button
                                      variant="contained"
                                      startIcon={<Icon icon="mdi:calendar-check" />}
                                      sx={{ 
                                        mt: 2,
                                        bgcolor: "rgba(135,206,235,0.2)",
                                        color: "#87CEEB",
                                        border: "1px solid rgba(135,206,235,0.4)",
                                        "&:hover": { 
                                          bgcolor: "rgba(135,206,235,0.3)",
                                        }
                                      }}
                                    >
                                      RSVP
                                    </Button>
                                  </Stack>
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}
                      
                      {/* Contributors Tab */}
                      {activeTab === 2 && (
                        <Box sx={{ p: 3 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, color: "#87CEEB" }}>
                            Top Community Contributors
                          </Typography>
                          
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