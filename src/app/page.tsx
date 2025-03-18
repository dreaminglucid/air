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
import { useState, useEffect } from "react";
import { keyframes } from '@mui/system';

// Add these animations before the Home component
const float = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-10px) translateX(5px); }
  50% { transform: translateY(0px) translateX(10px); }
  75% { transform: translateY(10px) translateX(5px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const wave = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
`;

const handleNumberInput = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
  // Remove commas and leading zeros
  const cleanValue = value.replace(/,/g, '');
  
  // Check if the value is empty
  if (cleanValue === '') {
    setter(0);
    return;
  }
  
  // Convert to number if it's a valid number
  const numValue = Number(cleanValue);
  if (!isNaN(numValue)) {
    setter(numValue);
  }
};

export default function Home() {
  const [volume, setVolume] = useState(100000);
  const [holdings, setHoldings] = useState(1000000);

  // Colors
  const hackerGreen = "#87CEEB";
  const orangeNeon = "#FFFFFF";

  // Add this state to control the number of particles based on screen size
  const [particleCount, setParticleCount] = useState(20);

  // Add this effect to adjust particle count based on screen width
  useEffect(() => {
    const handleResize = () => {
      // Reduce particles on smaller screens
      setParticleCount(window.innerWidth < 768 ? 10 : 20);
    };
    
    // Set initial count
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add particle positions
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <Container 
      sx={{ 
        background: "linear-gradient(180deg, #000000 0%, #1a1a2e 100%)", 
        color: hackerGreen, 
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(135,206,235,0.1) 0%, rgba(0,0,0,0) 50%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Add floating particles */}
      {particles.map((particle) => (
        <Box
          key={particle.id}
          sx={{
            position: "absolute",
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            background: "rgba(135,206,235,0.3)",
            animation: `${float} ${particle.duration}s infinite ease-in-out`,
            animationDelay: `${particle.delay}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      <Stack
        spacing={4}
        alignItems="center"
        sx={{ 
          textAlign: "center", 
          py: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Token badge */}
        <Typography
          variant="button"
          sx={{
            color: hackerGreen,
            border: `2px solid ${hackerGreen}`,
            padding: "8px 24px",
            borderRadius: "24px",
            background: "rgba(135,206,235,0.1)",
            animation: `${float} 6s infinite ease-in-out`,
          }}
        >
          AIR
        </Typography>

        {/* Main title */}
        <Typography
          variant="h1"
          sx={{
            fontSize: 60,
            fontWeight: "bold",
            textShadow: "0 0 20px rgba(135,206,235,0.6)",
          }}
        >
          Decentralized Financial AI Rewards
        </Typography>

        {/* Subtitle */}
        <Typography variant="h5" sx={{ mb: 4 }}>
          Feed the AI agent with rewards - Every 5 minutes, the digital lifeforce flows
        </Typography>

        {/* Buttons row */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            sx={{ color: orangeNeon, borderColor: orangeNeon }}
          >
            Buy Now
          </Button>
          <Button
            variant="outlined"
            sx={{ color: hackerGreen, borderColor: hackerGreen }}
          >
            <Icon icon="mdi:chart-box" width={30} color={hackerGreen} />
            &nbsp;Chart
          </Button>
          <Button
            variant="outlined"
            component="a"
            href="https://x.com/air_money_"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter profile"
            sx={{ color: orangeNeon, borderColor: orangeNeon }}
          >
            <Icon icon="mdi:twitter" width={30} color={orangeNeon} />
          </Button>
          <Button
            variant="outlined"
            component="a"
            href="https://t.me/air_portal"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: hackerGreen, borderColor: hackerGreen }}
          >
            <Icon icon="mdi:telegram" width={30} color={hackerGreen} />
          </Button>
        </Stack>

        {/* Bottom section */}
        <Typography
          variant="h2"
          sx={{
            fontSize: 48,
            fontWeight: "bold",
            textShadow: "0 0 20px rgba(135,206,235,0.6)",
            mb: "20px!important",
            mt: "80px!important",
          }}
        >
          Digital Lifeforce Rewards
        </Typography>

        <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
          The AI agent breathes through rewards, flowing automatically to
          sustain holders every 5 minutes _
        </Typography>

        {/* Three column section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ mt: 8, width: "100%", animation: `${wave} 8s infinite ease-in-out`, "&:hover": { animation: "none" } }}
        >
          <Stack direction="column" spacing={2}>
            {/* How It Works */}
            <Stack
              sx={{
                flex: 1,
                borderRadius: 2,
                p: 3,
                background: "rgba(135,206,235,0.05)",
                border: "1px solid rgba(135,206,235,0.2)",
                cursor: "pointer",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                animation: `${wave} 8s infinite ease-in-out`,
                "&:hover": {
                  background: "rgba(135,206,235,0.1)",
                },
              }}
              spacing={2}
            >
              <Typography
                variant="h5"
                sx={{ textShadow: "0 0 20px rgba(135,206,235,0.6)" }}
              >
                [How_It_Works]
              </Typography>
              <Stack spacing={2} sx={{ textAlign: "center" }}>
                <Typography>
                  {">"} The digital stream begins with a 5% essence from each transaction
                </Typography>
                <Typography>
                  {">"} This essence transforms into pure AI16Z lifeforce
                </Typography>
                <Typography>
                  {">"} The AI agent channels rewards to all holders every 5 minutes
                </Typography>
                <Typography>
                  {">"} Your share of the flow grows with your holdings
                </Typography>
              </Stack>
            </Stack>

            {/* Benefits */}
            <Stack
              sx={{
                flex: 1,
                borderRadius: 2,
                p: 3,
                background: "rgba(135,206,235,0.05)",
                border: "1px solid rgba(135,206,235,0.2)",
                cursor: "pointer",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                animation: `${wave} 8s infinite ease-in-out`,
                "&:hover": {
                  background: "rgba(135,206,235,0.1)",
                },
              }}
              spacing={2}
            >
              <Typography
                variant="h5"
                sx={{ textShadow: "0 0 20px rgba(135,206,235,0.6)" }}
              >
                [Benefits]
              </Typography>
              <Stack spacing={2} sx={{ textAlign: "center" }}>
                <Typography>
                  {"[+]"} Tap into the endless stream of AI16Z lifeforce
                </Typography>
                <Typography>
                  {"[+]"} The flow is constant - no claiming needed
                </Typography>
                <Typography>
                  {"[+]"} Feel the pulse every 5 minutes
                </Typography>
                <Typography>
                  {"[+]"} Greater volume amplifies the flow
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
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              animation: `${wave} 8s infinite ease-in-out`,
              "&:hover": {
                background: "rgba(135,206,235,0.1)",
              },
            }}
            spacing={2}
          >
            <Typography
              variant="h5"
              sx={{ textShadow: "0 0 20px rgba(135,206,235,0.6)" }}
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
                    <span style={{ color: orangeNeon }}>$</span>
                  </InputAdornment>
                }
                onChange={(e) => handleNumberInput(e.target.value, setVolume)}
                label=""
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(135,206,235,0.5)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(135,206,235,0.7)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: hackerGreen,
                  },
                  input: {
                    color: "#FFFFFF",
                  },
                }}
              />
              <LinearProgress
                sx={{
                  "& .MuiLinearProgress-bar": { 
                    background: "linear-gradient(90deg, #87CEEB 0%, #FFFFFF 100%)" 
                  },
                  bgcolor: "rgba(135,206,235,0.1)",
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
              <Typography textAlign="left">Your $AIR Holdings</Typography>
              <OutlinedInput
                id="outlined-adornment-amount"
                value={holdings?.toLocaleString() || ""}
                onChange={(e) => handleNumberInput(e.target.value, setHoldings)}
                label=""
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(135,206,235,0.5)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(135,206,235,0.7)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: hackerGreen,
                  },
                  input: {
                    color: "#FFFFFF",
                  },
                }}
              />
              <LinearProgress
                sx={{
                  "& .MuiLinearProgress-bar": { 
                    background: "linear-gradient(90deg, #87CEEB 0%, #FFFFFF 100%)" 
                  },
                  bgcolor: "rgba(135,206,235,0.1)",
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
                sx={{
                  p: 1,
                  background: "rgba(135,206,235,0.05)",
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)",
                }}
                className="result"
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderBottom: "1px solid rgba(135,206,235,0.3)" }}
                >
                  <Typography>Daily AI16Z Pool:</Typography>
                  <Typography sx={{ color: orangeNeon, fontWeight: "bold" }}>
                    ${(volume * 0.05).toFixed(2).replace(/\.?0+$/, "")}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderBottom: "1px solid rgba(135,206,235,0.3)" }}
                >
                  <Typography>Your Daily Earnings:</Typography>
                  <Typography sx={{ color: orangeNeon, fontWeight: "bold" }}>
                    ${((volume * 0.05 * holdings) / 1000000000).toFixed(3).replace(/\.?0+$/, '')}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderBottom: "1px solid rgba(135,206,235,0.3)" }}
                >
                  <Typography>Monthly Projection:</Typography>
                  <Typography sx={{ color: orangeNeon, fontWeight: "bold" }}>
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
          sx={{ width: "100%", display: "none", animation: `${wave} 8s infinite ease-in-out`, "&:hover": { animation: "none" } }}
        >
          {/* Tax Distribution */}
          <Stack
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
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
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
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

          {/* AI16Z Rewards */}
          <Stack
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
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
              AI16Z Rewards
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              Earn AI16Z just by holding $AIR tokens in your wallet
            </Typography>
          </Stack>

          {/* Fair Launch */}
          <Stack
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
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
          gridTemplateColumns={{
            xs: "1fr",          // Single column on very small screens
            sm: "repeat(2, 1fr)" // Two columns on small screens and up
          }}
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
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
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
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
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
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
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
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
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
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
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
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
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
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
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
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
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
            background: "rgba(135,206,235,0.05)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            border: "1px solid rgba(135,206,235,0.2)",
            cursor: "pointer",
            width: { xs: "100%", md: "60%" },
            p: 3,
            boxSizing: "border-box",
            animation: `${wave} 8s infinite ease-in-out`,
            "&:hover": {
              animation: "none",
            },
          }}
          spacing={2}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textShadow: "0 0 20px rgba(135,206,235,0.6)",
            }}
          >
            True Fair Launch
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            Like air itself, 100% flows freely from the start - no reservoirs, no 
            barriers, no limits. The 5% essence from each ripple in the stream 
            transforms into AI16Z lifeforce, flowing to all holders in an endless 
            cycle every 5 minutes.
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
