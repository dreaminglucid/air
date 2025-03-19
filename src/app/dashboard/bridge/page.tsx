"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
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

function BridgeContent() {
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Stack spacing={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
          Asset Bridge
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
              Connect your wallet to use the bridge
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
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={40} sx={{ color: "#87CEEB" }} />
              </Box>
            ) : (
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ color: "#87CEEB" }}>
                  Bridge your assets across chains
                </Typography>
                
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Transfer your tokens between Solana and other blockchains securely and efficiently.
                </Typography>
                
                <Chip 
                  label="Coming Soon" 
                  icon={<Icon icon="mdi:clock-outline" />}
                  sx={{ 
                    alignSelf: 'flex-start',
                    bgcolor: "rgba(135,206,235,0.1)",
                    color: "#87CEEB",
                    border: "1px solid rgba(135,206,235,0.3)",
                  }} 
                />
              </Stack>
            )}
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

// Main component export that wraps everything in the wallet providers
export default function BridgePage() {
  return (
    <WalletConnectWrapper>
      <DashboardLayout>
        <BridgeContent />
      </DashboardLayout>
    </WalletConnectWrapper>
  );
} 