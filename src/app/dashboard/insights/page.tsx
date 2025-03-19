"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Grid,
  LinearProgress,
  Divider,
  Alert,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useWallet, useConnection, ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import DashboardLayout from '@/components/DashboardLayout';

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

function InsightsContent() {
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [insightsData, setInsightsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<any>(null);
  const [trendModalOpen, setTrendModalOpen] = useState(false);

  // Simulate fetching insights data
  useEffect(() => {
    if (publicKey) {
      setIsLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        setInsightsData({
          marketSentiment: {
            overall: 'bullish',
            score: 78,
            change: 12,
            factors: [
              { name: 'Social Media', sentiment: 'positive', confidence: 82 },
              { name: 'On-Chain Activity', sentiment: 'positive', confidence: 75 },
              { name: 'Trading Volume', sentiment: 'neutral', confidence: 65 },
              { name: 'Whale Movement', sentiment: 'positive', confidence: 79 }
            ]
          },
          pricePredictions: {
            shortTerm: { direction: 'up', confidence: 68, target: '+12%' },
            midTerm: { direction: 'up', confidence: 72, target: '+25%' },
            longTerm: { direction: 'up', confidence: 65, target: '+40%' }
          },
          tradingStrategies: [
            { 
              name: 'Momentum Strategy', 
              suitability: 'high', 
              expectedReturn: '18-22%',
              timeframe: '1-3 months',
              risk: 'medium'
            },
            { 
              name: 'Value Accumulation', 
              suitability: 'medium', 
              expectedReturn: '25-35%',
              timeframe: '3-6 months',
              risk: 'medium-low'
            },
            { 
              name: 'Trend Following', 
              suitability: 'high', 
              expectedReturn: '15-20%',
              timeframe: '2-4 weeks',
              risk: 'medium-high'
            }
          ],
          emergingTrends: [
            { 
              name: 'DeFi 3.0 Protocols', 
              confidence: 85, 
              impact: 'high',
              timeframe: 'emerging now'
            },
            { 
              name: 'Cross-Chain Integration', 
              confidence: 78, 
              impact: 'high',
              timeframe: 'gaining momentum'
            },
            { 
              name: 'AI-Powered DApps', 
              confidence: 92, 
              impact: 'very high',
              timeframe: 'early stage'
            }
          ]
        });
        setIsLoading(false);
      }, 2000);
    }
  }, [publicKey]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenTrendModal = (trend: any) => {
    setSelectedTrend(trend);
    setTrendModalOpen(true);
  };

  const handleCloseTrendModal = () => {
    setTrendModalOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Stack spacing={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
          AI Insights
        </Typography>
        
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
              Connect your wallet to access AI-powered market insights
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
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                <CircularProgress size={40} sx={{ color: "#87CEEB", mb: 2 }} />
                <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.8)" }}>
                  AI is analyzing market data...
                </Typography>
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
            ) : insightsData ? (
              <Box>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange}
                  sx={{ 
                    mb: 3,
                    '.MuiTabs-indicator': { backgroundColor: '#87CEEB' },
                    '.MuiTab-root': { color: 'rgba(135,206,235,0.7)' },
                    '.Mui-selected': { color: '#87CEEB' }
                  }}
                >
                  <Tab label="Market Sentiment" />
                  <Tab label="Price Predictions" />
                  <Tab label="Trading Strategies" />
                  <Tab label="Emerging Trends" />
                </Tabs>
                
                {/* Market Sentiment Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)" }}>
                          <Stack spacing={2}>
                            <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                              Overall Market Sentiment
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Chip 
                                label={insightsData.marketSentiment.overall.toUpperCase()} 
                                color="primary"
                                sx={{ 
                                  bgcolor: "rgba(135,206,235,0.2)",
                                  color: "#87CEEB",
                                  border: "1px solid rgba(135,206,235,0.3)",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  py: 2,
                                  px: 1
                                }} 
                              />
                              
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h4" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                  {insightsData.marketSentiment.score}%
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: insightsData.marketSentiment.change > 0 ? "#4caf50" : "#f44336",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                  }}
                                >
                                  <Icon 
                                    icon={insightsData.marketSentiment.change > 0 ? "mdi:arrow-up" : "mdi:arrow-down"} 
                                    style={{ marginRight: '4px' }} 
                                  />
                                  {Math.abs(insightsData.marketSentiment.change)}% from last week
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Divider sx={{ borderColor: 'rgba(135,206,235,0.1)', my: 1 }} />
                            
                            <Typography variant="subtitle2" sx={{ color: "#87CEEB", mt: 1 }}>
                              Contributing Factors
                            </Typography>
                            
                            {insightsData.marketSentiment.factors.map((factor: any, index: number) => (
                              <Box key={index} sx={{ mb: 2 }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                                    {factor.name}
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: factor.sentiment === 'positive' ? "#4caf50" : 
                                             factor.sentiment === 'negative' ? "#f44336" : "#ffb74d"
                                    }}
                                  >
                                    {factor.sentiment.toUpperCase()}
                                  </Typography>
                                </Stack>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={factor.confidence} 
                                  sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: factor.sentiment === 'positive' ? "rgba(76,175,80,0.8)" : 
                                              factor.sentiment === 'negative' ? "rgba(244,67,54,0.8)" : "rgba(255,183,77,0.8)"
                                    }
                                  }} 
                                />
                              </Box>
                            ))}
                          </Stack>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)", height: '100%' }}>
                          <Typography variant="h6" sx={{ color: "#87CEEB", mb: 2 }}>
                            AI Sentiment Analysis
                          </Typography>
                          
                          <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, mb: 2 }}>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontStyle: 'italic' }}>
                              "Based on comprehensive analysis of on-chain metrics, social sentiment, and market indicators, 
                              our AI models indicate a strongly bullish outlook for the next 2-4 weeks. Key factors include 
                              increased developer activity, growing institutional interest, and positive regulatory developments."
                            </Typography>
                          </Box>
                          
                          <Alert 
                            severity="info" 
                            icon={<Icon icon="mdi:robot" />}
                            sx={{ 
                              bgcolor: "rgba(33,150,243,0.1)", 
                              color: "#2196f3",
                              border: "1px solid rgba(33,150,243,0.2)"
                            }}
                          >
                            AI confidence in this analysis: <strong>87%</strong>
                          </Alert>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Price Predictions Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper sx={{ p: 3, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)" }}>
                          <Typography variant="h6" sx={{ color: "#87CEEB", mb: 3 }}>
                            AI Price Predictions
                          </Typography>
                          
                          <Grid container spacing={3}>
                            {['Short-Term (7 days)', 'Mid-Term (30 days)', 'Long-Term (90 days)'].map((term, index) => {
                              const prediction = index === 0 ? insightsData.pricePredictions.shortTerm :
                                                index === 1 ? insightsData.pricePredictions.midTerm :
                                                insightsData.pricePredictions.longTerm;
                              return (
                                <Grid item xs={12} md={4} key={index}>
                                  <Paper sx={{ 
                                    p: 2, 
                                    bgcolor: "rgba(0,0,0,0.3)", 
                                    border: "1px solid rgba(135,206,235,0.15)",
                                    height: '100%'
                                  }}>
                                    <Typography variant="subtitle2" sx={{ color: "rgba(135,206,235,0.8)", mb: 1 }}>
                                      {term}
                                    </Typography>
                                    
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'space-between',
                                      mb: 2
                                    }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon 
                                          icon={prediction.direction === 'up' ? "mdi:arrow-up-bold-circle" : "mdi:arrow-down-bold-circle"} 
                                          style={{ 
                                            fontSize: '2rem', 
                                            color: prediction.direction === 'up' ? '#4caf50' : '#f44336',
                                            marginRight: '8px'
                                          }} 
                                        />
                                        <Typography 
                                          variant="h5" 
                                          sx={{ 
                                            fontWeight: "bold", 
                                            color: prediction.direction === 'up' ? '#4caf50' : '#f44336' 
                                          }}
                                        >
                                          {prediction.target}
                                        </Typography>
                                      </Box>
                                      
                                      <Chip 
                                        label={`${prediction.confidence}% Confidence`}
                                        size="small"
                                        sx={{ 
                                          bgcolor: "rgba(135,206,235,0.1)",
                                          color: "#87CEEB",
                                          border: "1px solid rgba(135,206,235,0.2)"
                                        }} 
                                      />
                                    </Box>
                                    
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={prediction.confidence} 
                                      sx={{ 
                                        height: 6, 
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: prediction.direction === 'up' ? "rgba(76,175,80,0.8)" : "rgba(244,67,54,0.8)"
                                        }
                                      }} 
                                    />
                                  </Paper>
                                </Grid>
                              );
                            })}
                          </Grid>
                          
                          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: "#87CEEB", mb: 1 }}>
                              AI Analysis Notes
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                              Our AI models analyze over 200 market indicators, on-chain metrics, and historical patterns to generate these predictions.
                              The current bullish outlook is supported by increasing institutional adoption, favorable technical indicators, and strong
                              fundamental developments in the ecosystem.
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Trading Strategies Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Grid container spacing={3}>
                      {insightsData.tradingStrategies.map((strategy: any, index: number) => (
                        <Grid item xs={12} md={4} key={index}>
                          <Paper sx={{ 
                            p: 3, 
                            bgcolor: "rgba(0,0,0,0.2)", 
                            border: "1px solid rgba(135,206,235,0.2)",
                            height: '100%'
                          }}>
                            <Stack spacing={2}>
                              <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                                {strategy.name}
                              </Typography>
                              
                              <Chip 
                                label={`${strategy.suitability.toUpperCase()} SUITABILITY`}
                                size="small"
                                sx={{ 
                                  alignSelf: 'flex-start',
                                  bgcolor: strategy.suitability === 'high' ? "rgba(76,175,80,0.1)" : 
                                          strategy.suitability === 'medium' ? "rgba(255,183,77,0.1)" : "rgba(244,67,54,0.1)",
                                  color: strategy.suitability === 'high' ? "#4caf50" : 
                                         strategy.suitability === 'medium' ? "#ffb74d" : "#f44336",
                                  border: strategy.suitability === 'high' ? "1px solid rgba(76,175,80,0.3)" : 
                                          strategy.suitability === 'medium' ? "1px solid rgba(255,183,77,0.3)" : "1px solid rgba(244,67,54,0.3)",
                                }} 
                              />
                              
                              <Divider sx={{ borderColor: 'rgba(135,206,235,0.1)' }} />
                              
                              <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                    Expected Return:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                    {strategy.expectedReturn}
                                  </Typography>
                                </Stack>
                                
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                    Timeframe:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                    {strategy.timeframe}
                                  </Typography>
                                </Stack>
                                
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                    Risk Level:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                    {strategy.risk.toUpperCase()}
                                  </Typography>
                                </Stack>
                              </Stack>
                              
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ 
                                  mt: 1,
                                  color: "#87CEEB", 
                                  borderColor: "rgba(135,206,235,0.3)",
                                  "&:hover": {
                                    borderColor: "rgba(135,206,235,0.6)",
                                    bgcolor: "rgba(135,206,235,0.1)",
                                  }
                                }}
                              >
                                View Details
                              </Button>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Alert 
                      severity="warning" 
                      sx={{ 
                        mt: 3,
                        bgcolor: "rgba(255,183,77,0.1)", 
                        color: "#ffb74d",
                        border: "1px solid rgba(255,183,77,0.2)"
                      }}
                    >
                      These strategies are AI-generated recommendations based on current market conditions. 
                      Always conduct your own research before making investment decisions.
                    </Alert>
                  </Box>
                )}
                
                {/* Emerging Trends Tab */}
                {activeTab === 3 && (
                  <Box>
                    <Grid container spacing={3}>
                      {insightsData.emergingTrends.map((trend: any, index: number) => (
                        <Grid item xs={12} md={4} key={index}>
                          <Paper sx={{ 
                            p: 3, 
                            bgcolor: "rgba(0,0,0,0.2)", 
                            border: "1px solid rgba(135,206,235,0.2)",
                            height: '100%'
                          }}>
                            <Stack spacing={2}>
                              <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                                {trend.name}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Chip 
                                  label={`${trend.confidence}% AI Confidence`}
                                  size="small"
                                  sx={{ 
                                    bgcolor: "rgba(135,206,235,0.1)",
                                    color: "#87CEEB",
                                    border: "1px solid rgba(135,206,235,0.2)"
                                  }} 
                                />
                                
                                <Chip 
                                  label={trend.impact.toUpperCase()}
                                  size="small"
                                  sx={{ 
                                    bgcolor: trend.impact === 'high' || trend.impact === 'very high' ? "rgba(76,175,80,0.1)" : "rgba(255,183,77,0.1)",
                                    color: trend.impact === 'high' || trend.impact === 'very high' ? "#4caf50" : "#ffb74d",
                                    border: trend.impact === 'high' || trend.impact === 'very high' ? "1px solid rgba(76,175,80,0.3)" : "1px solid rgba(255,183,77,0.3)",
                                  }} 
                                />
                              </Box>
                              
                              <Divider sx={{ borderColor: 'rgba(135,206,235,0.1)' }} />
                              
                              <Box>
                                <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.7)", mb: 0.5 }}>
                                  Trend Status:
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                                  {trend.timeframe}
                                </Typography>
                              </Box>
                              
                              <Button
                                variant="outlined"
                                size="small"
                                endIcon={<Icon icon="mdi:arrow-right" />}
                                onClick={() => handleOpenTrendModal(trend)}
                                sx={{ 
                                  mt: 1,
                                  color: "#87CEEB", 
                                  borderColor: "rgba(135,206,235,0.3)",
                                  "&:hover": {
                                    borderColor: "rgba(135,206,235,0.6)",
                                    bgcolor: "rgba(135,206,235,0.1)",
                                  }
                                }}
                              >
                                Explore Opportunities
                              </Button>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Paper sx={{ p: 3, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.2)", mt: 3 }}>
                      <Typography variant="h6" sx={{ color: "#87CEEB", mb: 2 }}>
                        AI Trend Analysis
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 2 }}>
                        Our AI has identified these emerging trends by analyzing developer activity, 
                        funding patterns, social media discussions, and early adoption metrics across the ecosystem.
                        Projects aligned with these trends may experience significant growth in the coming months.
                      </Typography>
                      
                      <Alert 
                        severity="info" 
                        icon={<Icon icon="mdi:lightbulb-on" />}
                        sx={{ 
                          bgcolor: "rgba(33,150,243,0.1)", 
                          color: "#2196f3",
                          border: "1px solid rgba(33,150,243,0.2)"
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Pro Tip:</strong> Consider allocating 5-10% of your portfolio to projects in these emerging trend categories 
                          for potential high-growth opportunities.
                        </Typography>
                      </Alert>
                    </Paper>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Icon icon="mdi:robot" style={{ fontSize: '3rem', color: 'rgba(135,206,235,0.7)', marginBottom: '1rem' }} />
                <Typography variant="subtitle1" sx={{ color: '#87CEEB', mb: 1 }}>
                  AI Insights Ready to Generate
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '80%', mx: 'auto', mb: 3 }}>
                  Our AI will analyze market conditions, on-chain data, and social sentiment to provide you with actionable insights.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Icon icon="mdi:brain" />}
                  onClick={() => setIsLoading(true)}
                  sx={{ 
                    bgcolor: "rgba(135,206,235,0.2)",
                    color: "#87CEEB",
                    border: "1px solid rgba(135,206,235,0.4)",
                    "&:hover": {
                      bgcolor: "rgba(135,206,235,0.3)",
                    }
                  }}
                >
                  Generate AI Insights
                </Button>
              </Box>
            )}
          </Paper>
        )}
      </Stack>
      
      {/* Trend Details Modal */}
      <Dialog 
        open={trendModalOpen} 
        onClose={handleCloseTrendModal}
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: "rgba(13, 17, 28, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(135,206,235,0.2)",
            borderRadius: 2,
            color: "#fff"
          }
        }}
      >
        {selectedTrend && (
          <>
            <DialogTitle sx={{ color: "#87CEEB", borderBottom: "1px solid rgba(135,206,235,0.2)" }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Icon icon={selectedTrend.icon} />
                <Typography variant="h6">{selectedTrend.name} Opportunities</Typography>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 3, color: "rgba(255,255,255,0.8)" }}>
                {selectedTrend.description}
              </Typography>
              
              <Typography variant="subtitle2" sx={{ color: "#87CEEB", mb: 1 }}>
                Key Investment Opportunities
              </Typography>
              
              <List sx={{ bgcolor: "rgba(0,0,0,0.2)", borderRadius: 1, mb: 2 }}>
                {[1, 2, 3].map((item, index) => (
                  <ListItem key={index} sx={{ borderBottom: index < 2 ? "1px solid rgba(135,206,235,0.1)" : "none" }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Icon icon="mdi:check-circle" style={{ color: "#4caf50" }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Project ${index + 1}`} 
                      secondary={`A promising ${selectedTrend.name.toLowerCase()} project with strong fundamentals`}
                      primaryTypographyProps={{ sx: { color: "#87CEEB" } }}
                      secondaryTypographyProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Typography variant="subtitle2" sx={{ color: "#87CEEB", mb: 1 }}>
                Risk Assessment
              </Typography>
              
              <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(135,206,235,0.1)", mb: 2 }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Market Risk:
                    </Typography>
                    <Chip 
                      label="Medium" 
                      size="small"
                      sx={{ 
                        bgcolor: "rgba(255,183,77,0.1)", 
                        color: "#ffb74d",
                        border: "1px solid rgba(255,183,77,0.2)",
                      }} 
                    />
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Technology Risk:
                    </Typography>
                    <Chip 
                      label="Medium-High" 
                      size="small"
                      sx={{ 
                        bgcolor: "rgba(244,67,54,0.1)", 
                        color: "#f44336",
                        border: "1px solid rgba(244,67,54,0.2)",
                      }} 
                    />
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Adoption Risk:
                    </Typography>
                    <Chip 
                      label="Low" 
                      size="small"
                      sx={{ 
                        bgcolor: "rgba(76,175,80,0.1)", 
                        color: "#4caf50",
                        border: "1px solid rgba(76,175,80,0.2)",
                      }} 
                    />
                  </Stack>
                </Stack>
              </Paper>
              
              <Alert 
                severity="info" 
                icon={<Icon icon="mdi:lightbulb-on" />}
                sx={{ 
                  bgcolor: "rgba(33,150,243,0.1)", 
                  color: "#2196f3",
                  border: "1px solid rgba(33,150,243,0.2)"
                }}
              >
                <Typography variant="body2">
                  <strong>AI Recommendation:</strong> Consider allocating 3-5% of your portfolio to this trend, 
                  focusing on established projects with proven technology and adoption metrics.
                </Typography>
              </Alert>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(135,206,235,0.2)" }}>
              <Button 
                onClick={handleCloseTrendModal}
                sx={{ 
                  color: "rgba(135,206,235,0.7)",
                  "&:hover": { color: "#87CEEB" }
                }}
              >
                Close
              </Button>
              <Button 
                variant="contained"
                startIcon={<Icon icon="mdi:bookmark-outline" />}
                sx={{ 
                  bgcolor: "rgba(135,206,235,0.2)",
                  color: "#87CEEB",
                  border: "1px solid rgba(135,206,235,0.4)",
                  "&:hover": { 
                    bgcolor: "rgba(135,206,235,0.3)",
                  }
                }}
              >
                Save to Watchlist
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

// Main component export that wraps everything in the wallet providers
export default function InsightsPage() {
  return (
    <WalletConnectWrapper>
      <DashboardLayout>
        <InsightsContent />
      </DashboardLayout>
    </WalletConnectWrapper>
  );
} 