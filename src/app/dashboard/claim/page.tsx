"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
  Avatar,
  Link as MuiLink,
  LinearProgress,
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

// Define the token program ID as in the dashboard
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

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

// ClaimContent component (the main page content)
function ClaimContent() {
  const { connection } = useConnection();
  const { publicKey, disconnect } = useWallet();
  
  // States for the verification process
  const [activeStep, setActiveStep] = useState(0);
  const [xVerified, setXVerified] = useState(false);
  const [telegramVerified, setTelegramVerified] = useState(false);
  const [isClaimable, setIsClaimable] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [defaiBalance, setDefaiBalance] = useState<number | null>(null);
  const [airBalance, setAirBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [verificationErrors, setVerificationErrors] = useState({
    x: null as string | null,
    telegram: null as string | null
  });
  
  // Constants for token addresses
  const DEFAI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DEFAI_CONTRACT_ADDRESS || '5LGyBHMMPwzMunxhcBMn6ZWAuqoHUQmcFiboTJidFURP';
  const AIR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_AIR_CONTRACT_ADDRESS || 'cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij';

  // Define airdrop amounts
  const airdropAmount = {
    defai: 10000,
    air: 5000
  };

  // Multiplier system to encourage holding and engagement
  const multipliers = {
    hodl: {
      name: "HODL Bonus",
      description: "Hold your tokens for extended periods to earn multipliers",
      levels: [
        { days: 7, multiplier: 1.1, label: "7 Days" },
        { days: 30, multiplier: 1.25, label: "30 Days" },
        { days: 90, multiplier: 1.5, label: "90 Days" },
        { days: 180, multiplier: 2.0, label: "180 Days" }
      ]
    },
    volume: {
      name: "Volume Creator",
      description: "Generate trading volume to earn additional rewards",
      levels: [
        { volume: 1000, multiplier: 1.05, label: "1K Volume" },
        { volume: 10000, multiplier: 1.15, label: "10K Volume" },
        { volume: 100000, multiplier: 1.3, label: "100K Volume" }
      ]
    },
    social: {
      name: "Social Amplifier",
      description: "Share and promote on social media to earn bonus rewards",
      levels: [
        { actions: 1, multiplier: 1.1, label: "1 Post" },
        { actions: 5, multiplier: 1.2, label: "5 Posts" },
        { actions: 20, multiplier: 1.5, label: "20 Posts" }
      ]
    }
  };

  // Add this new state after other state declarations
  const [userMultipliers, setUserMultipliers] = useState({
    hodl: 1.0,
    volume: 1.0, 
    social: 1.0
  });
  const [showMultipliers, setShowMultipliers] = useState(false);

  // Function to load token balances
  const loadTokenBalances = useCallback(async () => {
    if (!publicKey || !connection) {
      setDefaiBalance(null);
      setAirBalance(null);
      return;
    }
    
    try {
      setIsLoadingBalance(true);
      
      // Use Helius endpoint to get token balances
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
      
      let defaiAmt = 0;
      let airAmt = 0;
      
      // Parse the response from Helius
      if (data.result && data.result.value) {
        for (const item of data.result.value) {
          const accountInfo = item.account.data.parsed.info;
          const mintAddress = accountInfo.mint;
          
          if (mintAddress === DEFAI_TOKEN_ADDRESS) {
            defaiAmt = accountInfo.tokenAmount.uiAmount || 0;
          } else if (mintAddress === AIR_TOKEN_ADDRESS) {
            airAmt = accountInfo.tokenAmount.uiAmount || 0;
          }
        }
      }
      
      setDefaiBalance(defaiAmt);
      setAirBalance(airAmt);
    } catch (error) {
      console.error("Error getting token accounts:", error);
      setDefaiBalance(null);
      setAirBalance(null);
      setBalanceError("Failed to load token balances. Please try again later.");
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection]);

  // Load token balances
  useEffect(() => {
    if (publicKey) {
      loadTokenBalances();
    }
  }, [publicKey, loadTokenBalances]);

  // Update claimable status when social verifications change
  useEffect(() => {
    setIsClaimable(xVerified && telegramVerified && !claimed);
  }, [xVerified, telegramVerified, claimed]);

  // Handle step completion
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Function to handle X verification
  const verifyX = () => {
    try {
      // In a real app, you would redirect to Twitter OAuth or validate follow status
      window.open('https://twitter.com/elizadotfinance', '_blank');
      setTimeout(() => {
        setXVerified(true);
        if (activeStep === 0) handleNext();
      }, 2000);
    } catch (error) {
      console.error("Error verifying X:", error);
      // Consider showing an error message to the user
    }
  };

  // Function to handle Telegram verification
  const verifyTelegram = () => {
    // In a real app, you would use Telegram Bot API to verify membership
    // For demo, we'll simulate this with a timeout
    window.open('https://t.me/defai_portal', '_blank');
    setTimeout(() => {
      setTelegramVerified(true);
      if (activeStep === 1) handleNext();
    }, 2000);
  };

  // Function to claim airdrop
  const claimAirdrop = async () => {
    if (!isClaimable || !publicKey) return;
    
    setIsClaiming(true);
    
    try {
      // Simulate API call to claim tokens
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Calculate total multiplier
      const totalMultiplier = userMultipliers.hodl * userMultipliers.volume * userMultipliers.social;
      
      // Apply multiplier to airdrop amounts
      const multipliedDefai = airdropAmount.defai * totalMultiplier;
      const multipliedAir = airdropAmount.air * totalMultiplier;
      
      // Update balances after claiming with multipliers
      setDefaiBalance((prev) => (prev || 0) + multipliedDefai);
      setAirBalance((prev) => (prev || 0) + multipliedAir);
      
      setClaimed(true);
      
      // Simulate unlocking a multiplier after claiming
      if (userMultipliers.social === 1.0) {
        setTimeout(() => {
          setUserMultipliers(prev => ({
            ...prev,
            social: multipliers.social.levels[0].multiplier
          }));
        }, 1000);
      }
    } catch (error) {
      console.error("Error claiming airdrop:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack spacing={4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
            DeFAI Airdrop
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
              Connect your wallet to claim your airdrop
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
            {/* Wallet info */}
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
                }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Wallet Address
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ fontWeight: "bold", fontFamily: "monospace", color: "#87CEEB" }}
                  >
                    {publicKey.toString().slice(0, 16)}...{publicKey.toString().slice(-8)}
                  </Typography>
                </Box>
                
                {/* Token balances */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Box sx={{ 
                    flex: 1,
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: "rgba(0,0,0,0.3)", 
                    border: "1px solid rgba(135,206,235,0.15)",
                  }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      $DEFAI Balance
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ fontWeight: "bold", color: "#87CEEB" }}
                    >
                      {isLoadingBalance ? (
                        <CircularProgress size={16} sx={{ color: "#87CEEB" }} />
                      ) : (
                        defaiBalance?.toLocaleString() || "0"
                      )}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    flex: 1,
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: "rgba(0,0,0,0.3)", 
                    border: "1px solid rgba(135,206,235,0.15)",
                  }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      $AIR Balance
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ fontWeight: "bold", color: "#87CEEB" }}
                    >
                      {isLoadingBalance ? (
                        <CircularProgress size={16} sx={{ color: "#87CEEB" }} />
                      ) : (
                        airBalance?.toLocaleString() || "0"
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
            
            {/* Airdrop claim steps */}
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
              <Typography variant="h6" sx={{ mb: 2, color: "#87CEEB" }}>
                Claim Your Airdrop
              </Typography>
              
              {claimed ? (
                <Alert 
                  severity="success" 
                  icon={<Icon icon="mdi:check-circle" />}
                  sx={{ 
                    bgcolor: "rgba(46, 125, 50, 0.1)", 
                    color: "#4caf50",
                    border: "1px solid rgba(46, 125, 50, 0.2)",
                  }}
                >
                  <Typography variant="subtitle2">
                    Success! Your airdrop has been claimed.
                  </Typography>
                  <Typography variant="body2">
                    You've received {airdropAmount.defai.toLocaleString()} DEFAI and {airdropAmount.air.toLocaleString()} AIR tokens!
                  </Typography>
                </Alert>
              ) : (
                <Stepper 
                  activeStep={activeStep} 
                  orientation="vertical"
                  sx={{ 
                    '& .MuiStepLabel-label': { 
                      color: "rgba(135,206,235,0.7)",
                      '&.Mui-active': { color: "#87CEEB" }
                    },
                    '& .MuiStepLabel-iconContainer': {
                      '& .MuiStepIcon-root': { color: "rgba(135,206,235,0.5)" },
                      '& .MuiStepIcon-root.Mui-active': { color: "#87CEEB" },
                      '& .MuiStepIcon-root.Mui-completed': { color: "rgba(135,206,235,0.7)" },
                      '& .MuiStepIcon-text': { fill: "#000" }
                    }
                  }}
                >
                  {/* Step 1: Follow on X */}
                  <Step>
                    <StepLabel sx={{ color: "#87CEEB" }}>
                      <Typography sx={{ color: xVerified ? "#87CEEB" : "inherit" }}>
                        Follow DeFAI on X (Twitter)
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Stack spacing={2}>
                        <Typography variant="body2">
                          Follow DeFAI on X (Twitter) to stay updated with the latest news and announcements.
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Icon icon="mdi:twitter" />}
                          onClick={verifyX}
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
                          Follow on X
                        </Button>
                        {xVerified && (
                          <Alert 
                            severity="success"
                            icon={<Icon icon="mdi:check-circle" />}
                            sx={{ 
                              bgcolor: "rgba(46, 125, 50, 0.1)", 
                              color: "#4caf50",
                              border: "1px solid rgba(46, 125, 50, 0.2)",
                            }}
                          >
                            Verified! Thanks for following.
                          </Alert>
                        )}
                        <Stack direction="row" spacing={1}>
                          <Button
                            disabled
                            sx={{ color: 'rgba(135,206,235,0.4)' }}
                          >
                            Back
                          </Button>
                          <Button
                            onClick={handleNext}
                            disabled={!xVerified}
                            sx={{ 
                              color: xVerified ? "#87CEEB" : 'rgba(135,206,235,0.4)'
                            }}
                          >
                            Next
                          </Button>
                        </Stack>
                      </Stack>
                    </StepContent>
                  </Step>
                  
                  {/* Step 2: Join Telegram */}
                  <Step>
                    <StepLabel>
                      <Typography sx={{ color: telegramVerified ? "#87CEEB" : "inherit" }}>
                        Join DeFAI Telegram Group
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Stack spacing={2}>
                        <Typography variant="body2">
                          Join our Telegram community to connect with other members and get help from the team.
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Icon icon="mdi:telegram" />}
                          onClick={verifyTelegram}
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
                          Join Telegram
                        </Button>
                        {telegramVerified && (
                          <Alert 
                            severity="success"
                            icon={<Icon icon="mdi:check-circle" />}
                            sx={{ 
                              bgcolor: "rgba(46, 125, 50, 0.1)", 
                              color: "#4caf50",
                              border: "1px solid rgba(46, 125, 50, 0.2)",
                            }}
                          >
                            Verified! Welcome to our community.
                          </Alert>
                        )}
                        <Stack direction="row" spacing={1}>
                          <Button
                            onClick={handleBack}
                            sx={{ color: "#87CEEB" }}
                          >
                            Back
                          </Button>
                          <Button
                            onClick={handleNext}
                            disabled={!telegramVerified}
                            sx={{ 
                              color: telegramVerified ? "#87CEEB" : 'rgba(135,206,235,0.4)'
                            }}
                          >
                            Next
                          </Button>
                        </Stack>
                      </Stack>
                    </StepContent>
                  </Step>
                  
                  {/* Step 3: Claim Airdrop */}
                  <Step>
                    <StepLabel>
                      <Typography sx={{ color: claimed ? "#87CEEB" : "inherit" }}>
                        Claim Your Tokens
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Stack spacing={2}>
                        <Typography variant="body2">
                          You're eligible to claim your airdrop! Click the button below to receive:
                        </Typography>
                        
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <Chip 
                            label={`${airdropAmount.defai.toLocaleString()} DEFAI`} 
                            sx={{ 
                              bgcolor: "rgba(135,206,235,0.1)",
                              color: "#87CEEB",
                              border: "1px solid rgba(135,206,235,0.3)",
                              fontWeight: "bold"
                            }} 
                          />
                          <Chip 
                            label={`${airdropAmount.air.toLocaleString()} AIR`} 
                            sx={{ 
                              bgcolor: "rgba(135,206,235,0.1)",
                              color: "#87CEEB",
                              border: "1px solid rgba(135,206,235,0.3)",
                              fontWeight: "bold"
                            }} 
                          />
                        </Stack>
                        
                        <Button
                          variant="contained"
                          onClick={claimAirdrop}
                          disabled={!isClaimable || isClaiming}
                          startIcon={isClaiming ? <CircularProgress size={20} sx={{ color: "#87CEEB" }} /> : <Icon icon="mdi:gift" />}
                          sx={{ 
                            mt: 1,
                            alignSelf: "flex-start",
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
                          {isClaiming ? "Claiming..." : "Claim Airdrop"}
                        </Button>
                        
                        <Stack direction="row" spacing={1}>
                          <Button
                            onClick={handleBack}
                            sx={{ color: "#87CEEB" }}
                          >
                            Back
                          </Button>
                        </Stack>
                      </Stack>
                    </StepContent>
                  </Step>
                </Stepper>
              )}
            </Paper>

            {/* Multipliers section */}
            <Divider sx={{ my: 3, borderColor: "rgba(135,206,235,0.2)" }} />

            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
                  Reward Multipliers
                </Typography>
                <Button 
                  size="small"
                  endIcon={showMultipliers ? <Icon icon="mdi:chevron-up" /> : <Icon icon="mdi:chevron-down" />}
                  onClick={() => setShowMultipliers(!showMultipliers)}
                  sx={{
                    color: "rgba(135,206,235,0.7)",
                    "&:hover": {
                      color: "#87CEEB",
                      bgcolor: "rgba(135,206,235,0.1)",
                    }
                  }}
                >
                  {showMultipliers ? "Hide Details" : "Show Details"}
                </Button>
              </Stack>
              
              {/* Current multiplier summary */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ 
                  p: 2, 
                  borderRadius: 1,
                  bgcolor: "rgba(135,206,235,0.05)",
                  border: "1px solid rgba(135,206,235,0.15)"
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    HODL Bonus
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                    {(userMultipliers.hodl * 100).toFixed(0)}%
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Volume Bonus
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                    {(userMultipliers.volume * 100).toFixed(0)}%
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Social Bonus
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                    {(userMultipliers.social * 100).toFixed(0)}%
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, borderLeft: "1px solid rgba(135,206,235,0.2)", pl: 2 }}>
                  <Typography variant="caption" sx={{ color: "rgba(135,206,235,0.7)" }}>
                    Total Multiplier
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
                    {((userMultipliers.hodl * userMultipliers.volume * userMultipliers.social) * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Stack>
              
              {/* Detailed multiplier information */}
              {showMultipliers && (
                <Stack spacing={3} sx={{ mt: 1 }}>
                  {/* HODL Multiplier */}
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Icon icon="mdi:timer-sand" style={{ color: "#87CEEB" }} />
                      <Typography variant="subtitle2" sx={{ color: "#87CEEB" }}>
                        {multipliers.hodl.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#87CEEB", mb: 1, opacity: 0.7 }}>
                      {multipliers.hodl.description}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {multipliers.hodl.levels.map((level, index) => (
                        <Chip
                          key={index}
                          label={`${level.label}: ${(level.multiplier * 100).toFixed(0)}%`}
                          sx={{
                            bgcolor: userMultipliers.hodl >= level.multiplier ? "rgba(135,206,235,0.2)" : "rgba(135,206,235,0.05)",
                            color: "#87CEEB",
                            border: "1px solid rgba(135,206,235,0.3)",
                            opacity: userMultipliers.hodl >= level.multiplier ? 1 : 0.6,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  
                  {/* Volume Multiplier */}
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Icon icon="mdi:chart-line" style={{ color: "#87CEEB" }} />
                      <Typography variant="subtitle2" sx={{ color: "#87CEEB" }}>
                        {multipliers.volume.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#87CEEB", mb: 1, opacity: 0.7 }}>
                      {multipliers.volume.description}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {multipliers.volume.levels.map((level, index) => (
                        <Chip
                          key={index}
                          label={`${level.label}: ${(level.multiplier * 100).toFixed(0)}%`}
                          sx={{
                            bgcolor: userMultipliers.volume >= level.multiplier ? "rgba(135,206,235,0.2)" : "rgba(135,206,235,0.05)",
                            color: "#87CEEB",
                            border: "1px solid rgba(135,206,235,0.3)",
                            opacity: userMultipliers.volume >= level.multiplier ? 1 : 0.6,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  
                  {/* Social Multiplier */}
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Icon icon="mdi:share-variant" style={{ color: "#87CEEB" }} />
                      <Typography variant="subtitle2" sx={{ color: "#87CEEB" }}>
                        {multipliers.social.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#87CEEB", mb: 1, opacity: 0.7 }}>
                      {multipliers.social.description}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {multipliers.social.levels.map((level, index) => (
                        <Chip
                          key={index}
                          label={`${level.label}: ${(level.multiplier * 100).toFixed(0)}%`}
                          sx={{
                            bgcolor: userMultipliers.social >= level.multiplier ? "rgba(135,206,235,0.2)" : "rgba(135,206,235,0.05)",
                            color: "#87CEEB",
                            border: "1px solid rgba(135,206,235,0.3)",
                            opacity: userMultipliers.social >= level.multiplier ? 1 : 0.6,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  
                  <Alert 
                    severity="info" 
                    icon={<Icon icon="mdi:information-outline" style={{ color: "#87CEEB" }} />}
                    sx={{ 
                      bgcolor: "rgba(13, 59, 85, 0.3)", 
                      color: "#87CEEB", 
                      border: "1px solid rgba(135,206,235,0.2)",
                      ".MuiAlert-message": { color: "#87CEEB" }
                    }}
                  >
                    Multipliers are applied to your rewards distribution every 24 hours. Maintain your position to maximize earnings!
                  </Alert>
                </Stack>
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

// Main component export that wraps everything in the wallet providers
export default function ClaimPage() {
  return (
    <WalletConnectWrapper>
      <ClaimContent />
    </WalletConnectWrapper>
  );
} 