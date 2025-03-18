"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  LinearProgress,
  Divider,
  Alert,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// Define the token program ID as in the dashboard
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Define the proposal interface
interface Proposal {
  id: number;
  title: string;
  description: string;
  creator: string;
  currentToken: string;
  proposedToken: string;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'rejected';
  endTime: number; // timestamp
}

// Sample proposals data
const sampleProposals: Proposal[] = [
  {
    id: 1,
    title: "Change reward token to USDC",
    description: "This proposal aims to change the reward token from AIR to USDC for better stability and user experience.",
    creator: "5LGyBHMMPwzMunxhcBMn6ZWAuqoHUQmcFiboTJidFURP...",
    currentToken: "AIR",
    proposedToken: "USDC",
    votesFor: 5300000,
    votesAgainst: 2100000,
    status: 'active',
    endTime: Date.now() + 86400000 * 2, // 2 days from now
  },
  {
    id: 2,
    title: "Change reward token to BONK",
    description: "Let's use BONK as the reward token for increased community engagement and meme value.",
    creator: "5KjGh7jkUMrPtJdFcA91Z3...",
    currentToken: "AIR",
    proposedToken: "BONK",
    votesFor: 4800000,
    votesAgainst: 6200000,
    status: 'active',
    endTime: Date.now() + 86400000 * 3, // 3 days from now
  },
];

// Add WalletWrapperProps interface
interface WalletWrapperProps {
  children: React.ReactNode;
}

// Add WalletConnectWrapper component
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

// VoteContent component (the main page content)
function VoteContent() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  // States
  const [tabValue, setTabValue] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>(sampleProposals);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [defaiBalance, setDefaiBalance] = useState<string | null>(null);
  const [airBalance, setAirBalance] = useState<string | null>(null);
  const [votingPower, setVotingPower] = useState<number>(0);
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    proposedToken: '',
  });
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [voteAmount, setVoteAmount] = useState('');
  const [voteDirection, setVoteDirection] = useState<'for' | 'against'>('for');
  
  // Add token constants using environment variables
  const DEFAI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DEFAI_CONTRACT_ADDRESS || "5LGyBHMMPwzMunxhcBMn6ZWAuqoHUQmcFiboTJidFURP";
  const AIR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_AIR_CONTRACT_ADDRESS || "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";
  
  // Define fetchTokenBalances similar to dashboard
  const fetchTokenBalances = useCallback(async () => {
    if (!publicKey || !connection) {
      setDefaiBalance(null);
      setAirBalance(null);
      setVotingPower(0);
      return;
    }
    
    try {
      setIsLoadingBalance(true);
      setDefaiBalance("Loading...");
      setAirBalance("Loading...");
      
      // Use Helius approach as in dashboard
      const heliusEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || '';
      
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
      
      // Parse response
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
      
      // Calculate voting power based on both token balances
      // For this example: 1 DEFAI = 1 vote, 1 AIR = 0.5 votes
      const defaiVotes = parseFloat(defaiAmt) || 0;
      const airVotes = (parseFloat(airAmt) || 0) * 0.5;
      setVotingPower(defaiVotes + airVotes);
      
    } catch (error) {
      console.error("Error getting token accounts:", error);
      setDefaiBalance("Error");
      setAirBalance("Error");
      setVotingPower(0);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection, DEFAI_TOKEN_ADDRESS, AIR_TOKEN_ADDRESS]);
  
  // Load token balances on component mount or when wallet changes
  useEffect(() => {
    fetchTokenBalances();
  }, [fetchTokenBalances, publicKey]);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle open proposal dialog
  const handleOpenProposalDialog = () => {
    if (!publicKey) return;
    setIsProposalDialogOpen(true);
  };
  
  // Handle close proposal dialog
  const handleCloseProposalDialog = () => {
    setIsProposalDialogOpen(false);
    setNewProposal({ title: '', description: '', proposedToken: '' });
  };
  
  // Handle create proposal
  const handleCreateProposal = () => {
    const newProposalObj: Proposal = {
      id: proposals.length + 1,
      title: newProposal.title,
      description: newProposal.description,
      creator: publicKey?.toString().slice(0, 16) + '...' || '',
      currentToken: 'AIR',
      proposedToken: newProposal.proposedToken,
      votesFor: 0,
      votesAgainst: 0,
      status: 'active',
      endTime: Date.now() + 86400000 * 5, // 5 days from now
    };
    
    setProposals([...proposals, newProposalObj]);
    handleCloseProposalDialog();
  };
  
  // Handle open vote dialog
  const handleOpenVoteDialog = (proposal: Proposal) => {
    if (!publicKey) return;
    setSelectedProposal(proposal);
    setIsVoteDialogOpen(true);
  };
  
  // Handle close vote dialog
  const handleCloseVoteDialog = () => {
    setIsVoteDialogOpen(false);
    setSelectedProposal(null);
    setVoteAmount('');
    setVoteDirection('for');
  };
  
  // Handle vote submission
  const handleVote = () => {
    if (!selectedProposal || !voteAmount) return;
    
    const voteAmountNum = parseFloat(voteAmount);
    if (isNaN(voteAmountNum) || voteAmountNum <= 0 || voteAmountNum > votingPower) {
      return;
    }
    
    // Update the proposal with the new votes
    const updatedProposals = proposals.map(p => {
      if (p.id === selectedProposal.id) {
        return {
          ...p,
          votesFor: voteDirection === 'for' ? p.votesFor + voteAmountNum : p.votesFor,
          votesAgainst: voteDirection === 'against' ? p.votesAgainst + voteAmountNum : p.votesAgainst,
        };
      }
      return p;
    });
    
    setProposals(updatedProposals);
    handleCloseVoteDialog();
  };
  
  // Format time remaining
  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return "Ended";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h`;
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
          DeFAI Governance
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
              Connect your wallet to view and participate in governance
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
          <>
            {/* User's Voting Power */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(135,206,235,0.2)",
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                  Your Voting Power
                </Typography>
                
                <Box sx={{ 
                  p: 2,
                  bgcolor: "rgba(135,206,235,0.1)",
                  borderRadius: 2,
                  border: "1px solid rgba(135,206,235,0.2)"
                }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between">
                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>Total Voting Power</Typography>
                      {isLoadingBalance ? (
                        <CircularProgress size={16} sx={{ color: "#87CEEB" }} />
                      ) : (
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
                          {votingPower.toLocaleString()} votes
                        </Typography>
                      )}
                    </Stack>
                    
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(135,206,235,0.2)" }} />
                    
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: 'rgba(135,206,235,0.2)',
                          color: '#87CEEB',
                          fontWeight: 'bold'
                        }}>D</Box>
                        <Typography sx={{ color: "#87CEEB" }}>
                          DEFAI: {isLoadingBalance ? "Loading..." : defaiBalance || "0"}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: 'rgba(135,206,235,0.2)',
                          color: '#87CEEB',
                          fontWeight: 'bold'
                        }}>A</Box>
                        <Typography sx={{ color: "#87CEEB" }}>
                          AIR: {isLoadingBalance ? "Loading..." : airBalance || "0"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
                
                {/* Current Rewards Token indicator */}
                <Box sx={{ 
                  p: 2, 
                  mt: 2,
                  borderRadius: 2, 
                  bgcolor: "rgba(0,0,0,0.3)", 
                  border: "1px solid rgba(135,206,235,0.3)",
                }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: "rgba(135,206,235,0.7)" }}>
                      Current Rewards Token:
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: 'rgba(135,206,235,0.2)',
                        color: '#87CEEB',
                        fontWeight: 'bold',
                        border: '1px solid rgba(135,206,235,0.4)'
                      }}>
                        D
                      </Box>
                      <Stack>
                        <Typography sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                          DEFAI
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                          Active since: March 15, 2025
                        </Typography>
                      </Stack>
                      <Chip 
                        label="Active" 
                        size="small"
                        sx={{ 
                          bgcolor: "rgba(46, 125, 50, 0.2)",
                          color: "#4caf50",
                          border: "1px solid rgba(46, 125, 50, 0.3)",
                          ml: 'auto'
                        }} 
                      />
                    </Stack>
                  </Stack>
                </Box>
                
                <Alert severity="info" sx={{ bgcolor: "rgba(13, 59, 85, 0.5)", color: "#87CEEB" }}>
                  Voting power is calculated as: 1 DEFAI = 1 vote and 1 AIR = 0.5 votes
                </Alert>
              </Stack>
            </Paper>
            
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(135,206,235,0.2)' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': { color: 'rgba(135,206,235,0.7)' },
                  '& .Mui-selected': { color: '#87CEEB' },
                  '& .MuiTabs-indicator': { backgroundColor: '#87CEEB' },
                }}
              >
                <Tab label="Active Proposals" />
                <Tab label="Passed Proposals" />
                <Tab label="Rejected Proposals" />
              </Tabs>
            </Box>
            
            {/* Tab Panels */}
            <Box>
              {/* Active Proposals Tab */}
              {tabValue === 0 && (
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                      Active Proposals
                    </Typography>
                    
                    <Button
                      variant="contained"
                      startIcon={<Icon icon="mdi:plus" />}
                      onClick={handleOpenProposalDialog}
                      sx={{ 
                        bgcolor: "rgba(135,206,235,0.2)",
                        color: "#87CEEB",
                        border: "1px solid rgba(135,206,235,0.4)",
                        "&:hover": { 
                          bgcolor: "rgba(135,206,235,0.3)",
                        }
                      }}
                    >
                      Create Proposal
                    </Button>
                  </Stack>
                  
                  {proposals.filter(p => p.status === 'active').length === 0 ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        bgcolor: "rgba(0,0,0,0.2)",
                        border: "1px dashed rgba(135,206,235,0.2)",
                        textAlign: "center"
                      }}
                    >
                      <Typography sx={{ color: "rgba(135,206,235,0.7)" }}>
                        No active proposals at the moment.
                      </Typography>
                    </Paper>
                  ) : (
                    <Stack spacing={2}>
                      {proposals.filter(p => p.status === 'active').map((proposal) => (
                        <Paper
                          key={proposal.id}
                          elevation={0}
                          sx={{
                            p: 3,
                            bgcolor: "rgba(0,0,0,0.2)",
                            border: "1px solid rgba(135,206,235,0.2)",
                            borderRadius: 2,
                          }}
                        >
                          <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                                {proposal.title}
                              </Typography>
                              
                              <Chip 
                                label={`Ends in ${formatTimeRemaining(proposal.endTime)}`} 
                                size="small"
                                sx={{ 
                                  bgcolor: "rgba(135,206,235,0.1)", 
                                  color: "#87CEEB",
                                  border: "1px solid rgba(135,206,235,0.3)" 
                                }}
                              />
                            </Stack>
                            
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              {proposal.description}
                            </Typography>
                            
                            <Box>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Created by: {proposal.creator}
                              </Typography>
                            </Box>
                            
                            <Stack 
                              direction={{ xs: "column", sm: "row" }}
                              spacing={2}
                              alignItems="center"
                            >
                              <Box sx={{ 
                                p: 1, 
                                borderRadius: 1, 
                                bgcolor: "rgba(0,0,0,0.2)",
                                border: "1px solid rgba(135,206,235,0.1)",
                                width: { xs: "100%", sm: "auto" }
                              }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                    Change from:
                                  </Typography>
                                  <Chip 
                                    label={proposal.currentToken} 
                                    size="small" 
                                    sx={{ bgcolor: "rgba(135,206,235,0.1)", color: "#87CEEB" }}
                                  />
                                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                    to:
                                  </Typography>
                                  <Chip 
                                    label={proposal.proposedToken} 
                                    size="small" 
                                    sx={{ bgcolor: "rgba(135,206,235,0.1)", color: "#87CEEB" }}
                                  />
                                </Stack>
                              </Box>
                            </Stack>
                            
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                Votes: {proposal.votesFor.toLocaleString()} for, {proposal.votesAgainst.toLocaleString()} against
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 1,
                                  bgcolor: "rgba(255,255,255,0.1)",
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: "#87CEEB",
                                  },
                                }}
                              />
                            </Box>
                            
                            <Button
                              variant="outlined"
                              onClick={() => handleOpenVoteDialog(proposal)}
                              sx={{ 
                                alignSelf: "flex-start",
                                color: "#87CEEB", 
                                borderColor: "rgba(135,206,235,0.3)",
                                "&:hover": { 
                                  bgcolor: "rgba(135,206,235,0.1)",
                                  borderColor: "rgba(135,206,235,0.5)",
                                }
                              }}
                            >
                              Cast Vote
                            </Button>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Stack>
              )}
              
              {/* Passed Proposals Tab */}
              {tabValue === 1 && (
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                    Passed Proposals
                  </Typography>
                  
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      bgcolor: "rgba(0,0,0,0.2)",
                      border: "1px dashed rgba(135,206,235,0.2)",
                      textAlign: "center"
                    }}
                  >
                    <Typography sx={{ color: "rgba(135,206,235,0.7)" }}>
                      No passed proposals yet.
                    </Typography>
                  </Paper>
                </Stack>
              )}
              
              {/* Rejected Proposals Tab */}
              {tabValue === 2 && (
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                    Rejected Proposals
                  </Typography>
                  
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      bgcolor: "rgba(0,0,0,0.2)",
                      border: "1px dashed rgba(135,206,235,0.2)",
                      textAlign: "center"
                    }}
                  >
                    <Typography sx={{ color: "rgba(135,206,235,0.7)" }}>
                      No rejected proposals yet.
                    </Typography>
                  </Paper>
                </Stack>
              )}
            </Box>
          </>
        )}
      </Stack>
      
      {/* Create Proposal Dialog */}
      <Dialog 
        open={isProposalDialogOpen} 
        onClose={handleCloseProposalDialog}
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(135,206,235,0.2)",
            borderRadius: 2,
            color: "#fff",
            minWidth: { xs: "90%", sm: "500px" }
          }
        }}
      >
        <DialogTitle sx={{ color: "#87CEEB" }}>Create New Proposal</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Proposal Title"
              value={newProposal.title}
              onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(135,206,235,0.7)' },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(135,206,235,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(135,206,235,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(135,206,235,0.7)' },
                }
              }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={newProposal.description}
              onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(135,206,235,0.7)' },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(135,206,235,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(135,206,235,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(135,206,235,0.7)' },
                }
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(135,206,235,0.7)' }}>Proposed Token</InputLabel>
              <Select
                value={newProposal.proposedToken}
                label="Proposed Token"
                onChange={(e) => setNewProposal({...newProposal, proposedToken: e.target.value})}
                sx={{
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.5)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.7)' },
                }}
              >
                <MenuItem value="USDC">USDC</MenuItem>
                <MenuItem value="USDT">USDT</MenuItem>
                <MenuItem value="SOL">SOL</MenuItem>
                <MenuItem value="BONK">BONK</MenuItem>
                <MenuItem value="JUP">JUP</MenuItem>
              </Select>
            </FormControl>
            
            <Alert severity="info" sx={{ bgcolor: "rgba(13, 59, 85, 0.5)", color: "#87CEEB" }}>
              Creating a proposal will require a minimum of 10,000 voting power.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseProposalDialog}
            sx={{ color: 'rgba(135,206,235,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateProposal}
            variant="contained"
            disabled={!newProposal.title || !newProposal.description || !newProposal.proposedToken}
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
            Create Proposal
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Vote Dialog */}
      <Dialog 
        open={isVoteDialogOpen} 
        onClose={handleCloseVoteDialog}
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(135,206,235,0.2)",
            borderRadius: 2,
            color: "#fff",
            minWidth: { xs: "90%", sm: "500px" }
          }
        }}
      >
        <DialogTitle sx={{ color: "#87CEEB" }}>Cast Your Vote</DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ color: "#87CEEB" }}>
                {selectedProposal.title}
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(135,206,235,0.7)' }}>Vote Direction</InputLabel>
                <Select
                  value={voteDirection}
                  label="Vote Direction"
                  onChange={(e) => setVoteDirection(e.target.value as 'for' | 'against')}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.7)' },
                  }}
                >
                  <MenuItem value="for">For</MenuItem>
                  <MenuItem value="against">Against</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: 'rgba(135,206,235,0.7)' }}>Vote Amount</InputLabel>
                <OutlinedInput
                  type="number"
                  value={voteAmount}
                  onChange={(e) => setVoteAmount(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button 
                        size="small"
                        onClick={() => setVoteAmount(votingPower.toString())}
                        sx={{ color: 'rgba(135,206,235,0.7)' }}
                      >
                        MAX
                      </Button>
                    </InputAdornment>
                  }
                  label="Vote Amount"
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(135,206,235,0.7)' },
                  }}
                />
              </FormControl>
              
              <Box sx={{ 
                p: 2, 
                borderRadius: 1, 
                bgcolor: "rgba(135,206,235,0.05)",
                border: "1px solid rgba(135,206,235,0.1)"
              }}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Your Voting Power: {votingPower.toLocaleString()} votes
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseVoteDialog}
            sx={{ color: 'rgba(135,206,235,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVote}
            variant="contained"
            disabled={!voteAmount || parseFloat(voteAmount) <= 0 || parseFloat(voteAmount) > votingPower}
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
            Cast Vote
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// Main component export that wraps everything in the wallet providers
export default function VotePage() {
  return (
    <WalletConnectWrapper>
      <DashboardLayout>
        <VoteContent />
      </DashboardLayout>
    </WalletConnectWrapper>
  );
} 