"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  Typography,
  Stack,
  Container,
  InputAdornment,
  OutlinedInput,
  Box,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [volume, setVolume] = useState(100000);
  const [holdings, setHoldings] = useState(1000000);

  return (
    <Container sx={{ bgcolor: "black", color: "#FFE44D", minHeight: "100vh" }}>
      <Stack
        spacing={4}
        alignItems="center"
        sx={{ textAlign: "center", py: 8 }}
      >
        {/* Token badge */}
        <Typography
          variant="button"
          sx={{
            color: "#FFE44D",
            border: "2px solid #FFE44D",
            padding: "8px 24px",
            borderRadius: "24px",
          }}
        >
          WIN
        </Typography>

        {/* Main title */}
        <Typography
          variant="h1"
          sx={{
            fontSize: 60,
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(255,255,255,0.5)",
          }}
        >
          Wealth Is Next
        </Typography>

        {/* Subtitle */}
        <Typography variant="h5" sx={{ mb: 4 }}>
          Earn USDC rewards every 5 minutes just by holding $WIN tokens
        </Typography>

        {/* Buttons row */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            sx={{ color: "#FFE44D", borderColor: "#FFE44D" }}
          >
            Buy Now
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "#FFE44D", borderColor: "#FFE44D" }}
          >
            <Icon icon="mdi:chart-box" width={30} color="#FFE44D" />
            &nbsp;Chart
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "#FFE44D", borderColor: "#FFE44D" }}
          >
            <Icon icon="mdi:twitter" width={30} color="#FFE44D" />
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "#FFE44D", borderColor: "#FFE44D" }}
          >
            <Icon icon="mdi:telegram" width={30} color="#FFE44D" />
          </Button>
        </Stack>

        {/* Bottom section */}
        <Typography
          variant="h2"
          sx={{
            fontSize: 48,
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(255,255,255,0.5)",
            mb: "20px!important",
            mt: "80px!important",
          }}
        >
          Automatic USDC Rewards
        </Typography>

        <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
          Every 5 minutes, holders receive USDC rewards automatically
          distributed to their wallets _
        </Typography>

        {/* Three column section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ mt: 8, width: "100%" }}
        >
          <Stack direction="column" spacing={2}>
            {/* How It Works */}
            <Stack
              sx={{
                flex: 1,
                borderRadius: 2,
                p: 3,
                bgcolor: "#222",
                border: "1px solid #444",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#2b2b2b",
                },
              }}
              spacing={2}
            >
              <Typography
                variant="h5"
                sx={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}
              >
                [How_It_Works]
              </Typography>
              <Stack spacing={2} sx={{ textAlign: "center" }}>
                <Typography>
                  {">"} 5% tax is collected from every buy and sell transaction
                </Typography>
                <Typography>
                  {">"} Tax is automatically converted to USDC
                </Typography>
                <Typography>
                  {">"} Smart contract distributes USDC to all holders every 5
                  minutes
                </Typography>
                <Typography>
                  {">"} Rewards are proportional to your token holdings
                </Typography>
              </Stack>
            </Stack>

            {/* Benefits */}
            <Stack
              sx={{
                flex: 1,
                borderRadius: 2,
                p: 3,
                bgcolor: "#222",
                border: "1px solid #444",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#2b2b2b",
                },
              }}
              spacing={2}
            >
              <Typography
                variant="h5"
                sx={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}
              >
                [Benefits]
              </Typography>
              <Stack spacing={2} sx={{ textAlign: "center" }}>
                <Typography>
                  {"[+]"} Earn passive income in USDC just by holding
                </Typography>
                <Typography>
                  {"[+]"} No need to claim - rewards are automatic
                </Typography>
                <Typography>
                  {"[+]"} Frequent 5-minute distribution cycles
                </Typography>
                <Typography>
                  {"[+]"} Higher trading volume means more rewards
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Rewards Calculator */}
          <Stack
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#2b2b2b",
              },
            }}
            spacing={2}
          >
            <Typography
              variant="h5"
              sx={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}
            >
              [Rewards_Calculator]
            </Typography>
            <Stack spacing={2} sx={{ fontFamily: "monospace" }}>
              <Typography textAlign="left">24h Volume (USD)</Typography>
              <OutlinedInput
                value={volume?.toLocaleString() || ''}
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start" sx={{ fontWeight: "bold" }}>
                    <span style={{ color: "#FFE44D" }}>$</span>
                  </InputAdornment>
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val == "") {
                    setVolume(0);
                  } else {
                    const value = Number(val.replace(/^0+|,/g, ""));
                    if (value) {
                      setVolume(value);
                    }
                  }
                }}
                label=""
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFE44D",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFE44D",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFE44D",
                  },
                  input: {
                    color: "#FFE44D",
                  },
                }}
              />
              <LinearProgress
                sx={{
                  "& .MuiLinearProgress-bar": { bgcolor: "#FFE44D" },
                  bgcolor: "#444",
                }}
                value={volume / 10000}
                variant="determinate"
              />
              <Typography
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>$0</span>
                <span>$1M</span>
              </Typography>
              <Typography textAlign="left">Your $WIN Holdings</Typography>
              <OutlinedInput
                id="outlined-adornment-amount"
                value={holdings?.toLocaleString() || ""}
                onChange={(e) => {
                  const val = e.target.value; 
                  if (val == "") {
                    setHoldings(0);
                  } else {
                    const value = Number(val.replace(/^0+|,/g, ""));
                    if (value) {
                      setHoldings(value);
                    }
                  }
                }}
                label=""
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFE44D",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFE44D",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFE44D",
                  },
                  input: {
                    color: "#FFE44D",
                  },
                }}
              />
              <LinearProgress
                sx={{
                  "& .MuiLinearProgress-bar": { bgcolor: "#FFE44D" },
                  bgcolor: "#444",
                }}
                value={holdings / 1000000000}
                variant="determinate"
              />
              <Typography
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>$0</span>
                <span>$1B</span>
              </Typography>
              <Stack
                direction="column"
                spacing={2}
                p={1}
                bgcolor="#333"
                className="result"
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderBottom: "1px solid #998B2E" }}
                >
                  <Typography>Daily Rewards Pool:</Typography>
                  <Typography sx={{ color: "#FFE44D", fontWeight: "bold" }}>
                    ${(volume * 0.05).toFixed(2).replace(/\.?0+$/, "")}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderBottom: "1px solid #998B2E" }}
                >
                  <Typography>Your Daily Earnings:</Typography>
                  <Typography sx={{ color: "#FFE44D", fontWeight: "bold" }}>
                    ${((volume * 0.05 * holdings) / 1000000000).toFixed(3).replace(/\.?0+$/, '')}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderBottom: "1px solid #998B2E" }}
                >
                  <Typography>Monthly Projection:</Typography>
                  <Typography sx={{ color: "#FFE44D", fontWeight: "bold" }}>
                    ${((volume * 0.05 * holdings) / 1000000000 * 30).toFixed(3).replace(/\.?0+$/, '')}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Why Choose $IMG Section */}
        {/* <Typography
          variant="h2"
          sx={{
            fontSize: 48,
            fontWeight: "bold",
            mt: "96px!important",
            mb: "20px!important",
          }}
        >
          Why Choose $LUG?
        </Typography> */}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ width: "100%", display: "none" }}
        >
          {/* Tax Distribution */}
          <Stack
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#2b2b2b",
              },
            }}
            spacing={2}
          >
            <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
              {">"}_
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              5% Tax Distribution
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              Every buy and sell transaction contributes to the reward pool
            </Typography>
          </Stack>

          {/* Auto-Claim System */}
          <Stack
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#2b2b2b",
              },
            }}
            spacing={2}
          >
            <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
              [&nbsp;]
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Auto-Claim System
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              Rewards are automatically distributed every 5 minutes
            </Typography>
          </Stack>

          {/* USDC Rewards */}
          <Stack
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#2b2b2b",
              },
            }}
            spacing={2}
          >
            <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
              $_
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              USDC Rewards
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              Earn USDC just by holding $WIN tokens in your wallet
            </Typography>
          </Stack>

          {/* Fair Launch */}
          <Stack
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#2b2b2b",
              },
            }}
            spacing={2}
          >
            <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
              //
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Fair Launch
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              No pre-sale, no team tokens, 100% fair distribution
            </Typography>
          </Stack>
        </Stack>

        {/* Tokenomics Section */}
        <Typography
          variant="h2"
          sx={{
            fontSize: 48,
            fontWeight: "bold",
            mt: "96px!important",
            mb: "20px!important",
          }}
        >
          Tokenomics
        </Typography>

        {/* Stats Grid */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap={2}
          sx={{
            width: "100%",
            mb: 4,
            "& > *": {
              minWidth: 0, // Prevents overflow
            },
          }}
        >
          {/* Total Supply */}
          <Stack
            sx={{
              borderRadius: 2,
              p: { xs: 1, sm: 3 },
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
            }}
            spacing={2}
          >
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              [ 1B ]
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
                fontSize: { xs: "2rem", sm: "3rem" },
                wordWrap: "break-word",
              }}
            >
              1,000,000,000
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              Total Supply
            </Typography>
          </Stack>

          {/* Initial Liquidity */}
          <Stack
            sx={{
              borderRadius: 2,
              p: { xs: 1, sm: 3 },
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
            }}
            spacing={2}
          >
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              =====
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
                fontSize: { xs: "2rem", sm: "3rem" },
                wordWrap: "break-word",
              }}
            >
              100%
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              Initial Liquidity
            </Typography>
          </Stack>

          {/* Tax */}
          <Stack
            sx={{
              borderRadius: 2,
              p: { xs: 1, sm: 3 },
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
            }}
            spacing={2}
          >
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              {"< 5% >"}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
                fontSize: { xs: "2rem", sm: "3rem" },
                wordWrap: "break-word",
              }}
            >
              5%
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              Tax
            </Typography>
          </Stack>

          {/* Fair Launch */}
          <Stack
            sx={{
              borderRadius: 2,
              p: { xs: 1, sm: 3 },
              bgcolor: "#222",
              border: "1px solid #444",
              cursor: "pointer",
            }}
            spacing={2}
          >
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              {">>"}100{"<<"}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
                fontSize: { xs: "2rem", sm: "3rem" },
                wordWrap: "break-word",
              }}
            >
              100%
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              Fair Launch
            </Typography>
          </Stack>
        </Box>

        {/* True Fair Launch Box */}
        <Stack
          sx={{
            borderRadius: 2,
            bgcolor: "#222",
            border: "1px solid #444",
            cursor: "pointer",
            width: { xs: "100%", md: "60%" },
            p: 3,
            boxSizing: "border-box",
          }}
          spacing={2}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}
          >
            True Fair Launch
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            100% of the total supply is added to liquidity at launch, with no
            team tokens, no presale, and no max wallet limits. The 5% tax on
            transactions is automatically distributed as USDC rewards to all
            holders every 5 minutes.
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
