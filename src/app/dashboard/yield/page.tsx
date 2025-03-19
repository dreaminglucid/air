"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Grid,
  Slider,
  TextField,
  MenuItem,
  LinearProgress,
  Divider,
  Alert,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useWallet, useConnection, ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { keyframes } from "@mui/system";
import DashboardLayout from '@/components/DashboardLayout';
import dynamic from 'next/dynamic';

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

// Animation keyframes
const pulse = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

// YieldContent component
function YieldContent() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [riskLevel, setRiskLevel] = useState(50);
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [timeHorizon, setTimeHorizon] = useState(30); // days
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<string | null>(null);
  const [thinkingMessages, setThinkingMessages] = useState<string[]>([]);
  
  // Simulated yield farming pools (in a real app, you'd fetch these from protocols)
  const yieldPools = [
    { protocol: "Raydium", apy: 18.5, risk: 40, tokens: ["SOL", "USDC"], tvl: 22500000 },
    { protocol: "Atrix", apy: 26.2, risk: 65, tokens: ["DeFAI", "USDT"], tvl: 8900000 },
    { protocol: "Orca", apy: 14.2, risk: 30, tokens: ["SOL", "USDT"], tvl: 34000000 },
    { protocol: "Marinade", apy: 7.9, risk: 10, tokens: ["mSOL"], tvl: 125000000 },
    { protocol: "DeFAI LP", apy: 32.5, risk: 75, tokens: ["DeFAI", "SOL"], tvl: 5400000 },
    { protocol: "Solend", apy: 10.2, risk: 45, tokens: ["USDC"], tvl: 18200000 },
  ];
  
  // Simulated AI analysis that shows thinking process
  const runAIAnalysis = useCallback(() => {
    if (!publicKey) return;
    
    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    setThinkingMessages([]);
    
    const thinkingSteps = [
      "Analyzing user risk preference...",
      "Evaluating current market conditions...",
      "Scanning 18 DeFi protocols for yield opportunities...",
      "Calculating expected returns with adjusted risk factors...",
      "Simulating portfolio allocations...",
      "Comparing gas costs across different networks...",
      "Identifying optimal entry points...",
      "Finalizing recommendations..."
    ];
    
    let count = 0;
    const interval = setInterval(() => {
      if (count < thinkingSteps.length) {
        setThinkingMessages(prev => [...prev, thinkingSteps[count]]);
        count++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          generateRecommendations();
          setIsAnalyzing(false);
          setAnalysisCompleted(true);
        }, 1000);
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, [publicKey]);
  
  // Generate recommendations based on user parameters
  const generateRecommendations = useCallback(() => {
    // Filter pools by risk preference
    const filteredPools = yieldPools.filter(pool => 
      Math.abs(pool.risk - riskLevel) < 30
    );
    
    // Sort by APY, weighted by risk match
    const sortedPools = [...filteredPools].sort((a, b) => {
      const aRiskMatch = 1 - Math.abs(a.risk - riskLevel) / 100;
      const bRiskMatch = 1 - Math.abs(b.risk - riskLevel) / 100;
      
      return (b.apy * bRiskMatch) - (a.apy * aRiskMatch);
    });
    
    // Calculate optimal allocations (simulated)
    const recommendations = sortedPools.slice(0, 3).map((pool, index) => {
      const allocation = index === 0 ? 50 : index === 1 ? 30 : 20;
      const amount = (investmentAmount * allocation) / 100;
      const expectedYield = amount * (pool.apy / 100) * (timeHorizon / 365);
      
      return {
        ...pool,
        allocation,
        amount,
        expectedYield,
        expectedReturn: amount + expectedYield,
      };
    });
    
    setRecommendations(recommendations);
  }, [riskLevel, investmentAmount, timeHorizon]);
  
  // Auto-deploy a strategy
  const deployStrategy = useCallback((strategy: string) => {
    setIsLoading(true);
    
    // Simulate deploying the strategy
    setTimeout(() => {
      setCurrentStrategy(strategy);
      setIsLoading(false);
    }, 2000);
  }, []);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
          Yield Optimizer
        </Typography>
        
        {/* Connection state */}
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
              Connect your wallet to access AI-powered yield optimization
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
            {/* Parameters Paper */}
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
              <Typography variant="h6" sx={{ mb: 3, color: "#87CEEB" }}>
                Investment Parameters
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, color: "rgba(135,206,235,0.8)" }}>
                        Investment Amount
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Math.max(0, Number(e.target.value)))}
                        InputProps={{
                          startAdornment: <Box component="span" sx={{ color: 'rgba(135,206,235,0.7)', mr: 1 }}>$</Box>,
                          sx: {
                            bgcolor: "rgba(0,0,0,0.3)",
                            color: "#87CEEB",
                            border: "1px solid rgba(135,206,235,0.3)",
                            borderRadius: 1,
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          }
                        }}
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, color: "rgba(135,206,235,0.8)" }}>
                        Time Horizon
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        value={timeHorizon}
                        onChange={(e) => setTimeHorizon(Number(e.target.value))}
                        InputProps={{
                          sx: {
                            bgcolor: "rgba(0,0,0,0.3)",
                            color: "#87CEEB",
                            border: "1px solid rgba(135,206,235,0.3)",
                            borderRadius: 1,
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          }
                        }}
                      >
                        <MenuItem value={7}>7 days</MenuItem>
                        <MenuItem value={30}>30 days</MenuItem>
                        <MenuItem value={90}>90 days</MenuItem>
                        <MenuItem value={180}>180 days</MenuItem>
                        <MenuItem value={365}>1 year</MenuItem>
                      </TextField>
                    </Box>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: "rgba(135,206,235,0.8)" }}>
                      Risk Tolerance: {riskLevel < 30 ? 'Low' : riskLevel < 70 ? 'Medium' : 'High'}
                    </Typography>
                    <Box sx={{ px: 1 }}>
                      <Slider 
                        value={riskLevel}
                        onChange={(_, value) => setRiskLevel(value as number)}
                        sx={{
                          color: "#87CEEB",
                          height: 8,
                          '& .MuiSlider-thumb': {
                            height: 20,
                            width: 20,
                            backgroundColor: '#87CEEB',
                          },
                          '& .MuiSlider-track': {
                            height: 8,
                            borderRadius: 4,
                          },
                          '& .MuiSlider-rail': {
                            height: 8,
                            borderRadius: 4,
                            opacity: 0.3,
                            backgroundColor: 'rgba(135,206,235,0.3)',
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(135,206,235,0.7)' }}>Conservative</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(135,206,235,0.7)' }}>Balanced</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(135,206,235,0.7)' }}>Aggressive</Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      startIcon={<Icon icon="mdi:robot" />}
                      onClick={runAIAnalysis}
                      sx={{
                        bgcolor: "rgba(135,206,235,0.2)",
                        color: "#87CEEB",
                        border: "1px solid rgba(135,206,235,0.4)",
                        p: 1.5,
                        "&:hover": {
                          bgcolor: "rgba(135,206,235,0.3)",
                        }
                      }}
                    >
                      Run AI Analysis
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Analysis Results */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: "rgba(0,0,0,0.2)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(135,206,235,0.2)",
                minHeight: 400
              }}
            >
              {isAnalyzing ? (
                // AI Thinking Process
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Icon icon="mdi:brain" style={{ color: "#87CEEB", fontSize: 24 }} />
                    <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                      AI Agent Working
                    </Typography>
                  </Stack>
                  
                  <LinearProgress 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 1,
                      height: 6,
                      bgcolor: 'rgba(0,0,0,0.3)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#87CEEB',
                      }
                    }} 
                  />
                  
                  <Stack spacing={1.5}>
                    {thinkingMessages.map((message, idx) => (
                      <Box key={idx} sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'rgba(0,0,0,0.3)', 
                        animation: idx === thinkingMessages.length - 1 ? `${typing} 0.8s steps(40, end)` : 'none',
                        width: idx === thinkingMessages.length - 1 ? '100%' : 'auto',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#87CEEB' }}>
                          {message}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ) : analysisCompleted ? (
                // Results
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Icon icon="mdi:check-circle" style={{ color: "#4caf50", fontSize: 24 }} />
                    <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                      Optimal Yield Strategy
                    </Typography>
                  </Stack>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: "rgba(135,206,235,0.8)" }}>
                        Recommended Portfolio Allocation
                      </Typography>
                      
                      {recommendations.map((rec, idx) => (
                        <Paper 
                          key={idx}
                          sx={{ 
                            p: 2, 
                            mb: 2, 
                            bgcolor: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(135,206,235,0.2)",
                            borderLeft: `4px solid ${
                              rec.risk < 30 ? '#4caf50' : rec.risk < 70 ? '#ff9800' : '#f44336'
                            }`
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: "#87CEEB" }}>
                                {rec.protocol} ({rec.tokens.join('/')})
                              </Typography>
                              <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                  APY: <span style={{ color: '#4caf50' }}>{rec.apy}%</span>
                                </Typography>
                                <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                  Risk: <span>{rec.risk}/100</span>
                                </Typography>
                                <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                  TVL: {formatCurrency(rec.tvl)}
                                </Typography>
                              </Stack>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="subtitle2" sx={{ color: "#87CEEB" }}>
                                {rec.allocation}% ({formatCurrency(rec.amount)})
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#4caf50" }}>
                                Est. {timeHorizon}-day yield: {formatCurrency(rec.expectedYield)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      ))}
                      
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: "rgba(135,206,235,0.8)" }}>
                          Expected Performance
                        </Typography>
                        <Paper 
                          sx={{ 
                            p: 2, 
                            bgcolor: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(135,206,235,0.2)",
                          }}
                        >
                          <Grid container spacing={3}>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                Initial Investment
                              </Typography>
                              <Typography variant="subtitle2" sx={{ color: "#87CEEB" }}>
                                {formatCurrency(investmentAmount)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                Projected Return
                              </Typography>
                              <Typography variant="subtitle2" sx={{ color: "#4caf50" }}>
                                {formatCurrency(
                                  recommendations.reduce((sum, rec) => sum + rec.expectedYield, 0)
                                )}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                APY (Weighted)
                              </Typography>
                              <Typography variant="subtitle2" sx={{ color: "#87CEEB" }}>
                                {(recommendations.reduce((sum, rec) => sum + (rec.apy * rec.allocation), 0) / 100).toFixed(2)}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                                Risk Score
                              </Typography>
                              <Typography variant="subtitle2" sx={{ color: "#87CEEB" }}>
                                {Math.round(recommendations.reduce((sum, rec) => sum + (rec.risk * rec.allocation), 0) / 100)}/100
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, bgcolor: "rgba(135,206,235,0.05)", border: "1px solid rgba(135,206,235,0.1)" }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                          <Icon icon="mdi:lightbulb" style={{ color: "#87CEEB", fontSize: 24, marginTop: 4 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: "#87CEEB", mb: 1 }}>
                              AI Insight
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(135,206,235,0.8)", mb: 2 }}>
                              Your strategy balances {riskLevel < 30 ? 'lower risk stable yield' : riskLevel < 70 ? 'moderate risk with solid returns' : 'higher risk for maximum returns'}.
                              {timeHorizon > 90 ? ' The longer time horizon allows for compounding benefits.' : 
                               timeHorizon < 30 ? ' For short-term strategies, focus on liquidity over maximum yield.' : 
                               ' This medium-term strategy balances immediate returns with growth potential.'}
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Divider sx={{ my: 2, borderColor: 'rgba(135,206,235,0.2)' }} />
                        
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<Icon icon="mdi:rocket-launch" />}
                          onClick={() => deployStrategy('optimal')}
                          disabled={isLoading || currentStrategy !== null}
                          sx={{
                            bgcolor: "rgba(135,206,235,0.2)",
                            color: "#87CEEB",
                            border: "1px solid rgba(135,206,235,0.4)",
                            p: 1.5,
                            "&:hover": {
                              bgcolor: "rgba(135,206,235,0.3)",
                            },
                            "&.Mui-disabled": {
                              bgcolor: "rgba(135,206,235,0.1)",
                              color: "rgba(135,206,235,0.5)",
                            }
                          }}
                        >
                          {isLoading ? (
                            <>
                              <CircularProgress size={16} sx={{ mr: 1, color: 'rgba(135,206,235,0.7)' }} />
                              Deploying...
                            </>
                          ) : currentStrategy !== null ? (
                            <>
                              <Icon icon="mdi:check-circle" />
                              Strategy Deployed
                            </>
                          ) : (
                            "Deploy This Strategy"
                          )}
                        </Button>
                        
                        {currentStrategy && (
                          <Alert 
                            severity="success" 
                            sx={{ 
                              mt: 2,
                              bgcolor: "rgba(76,175,80,0.1)",
                              color: "#4caf50",
                              border: "1px solid rgba(76,175,80,0.2)"
                            }}
                          >
                            Your yield strategy is now live and will begin generating returns immediately.
                          </Alert>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                // Empty state
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}>
                  <Icon icon="mdi:chart-areaspline" style={{ fontSize: '3rem', color: 'rgba(135,206,235,0.7)', marginBottom: '1rem' }} />
                  <Typography variant="subtitle1" sx={{ color: '#87CEEB', mb: 1 }}>
                    Ready to Optimize Your Yield Strategy
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '80%', mb: 3 }}>
                    Set your investment parameters and click "Run AI Analysis" to get personalized recommendations.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

// Main component export that wraps everything in the wallet providers
export default function YieldPage() {
  return (
    <WalletConnectWrapper>
      <DashboardLayout>
        <YieldContent />
      </DashboardLayout>
    </WalletConnectWrapper>
  );
} 