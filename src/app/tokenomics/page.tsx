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
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define marquee keyframes
const marquee = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); } // Translate by half (since content is doubled)
`;

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

// Near the top of the file, add this function to handle icon loading errors
const IconWithFallback = ({ icon, width, color }: { icon: string, width: number, color: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <span style={{ width, height: width, display: 'inline-block', backgroundColor: 'rgba(135,206,235,0.2)' }} />;
  }

  return (
    <Icon 
      icon={icon} 
      width={width} 
      color={color} 
      onError={() => setHasError(true)}
    />
  );
};

// Define props interface for the new component
interface SnapshotInfoCardProps {
  title: string;
  progressValue: number;
  progressLabelPosition: string;
  progressLabelText: string;
  description: string;
  details: string[]; // Array of strings for the bullet points
}

// Define the reusable component
const SnapshotInfoCard = ({
  title,
  progressValue,
  progressLabelPosition,
  progressLabelText,
  description,
  details,
}: SnapshotInfoCardProps) => {
  const hackerGreen = "#87CEEB"; // Assuming hackerGreen is accessible or pass as prop

  return (
    <Stack
      sx={{
        flex: 1, // Make stacks share space
        borderRadius: 2,
        background: "rgba(135,206,235,0.05)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        border: "1px solid rgba(135,206,235,0.2)",
        cursor: "pointer",
        p: 3,
        boxSizing: "border-box",
        height: '100%' // Try to make height consistent
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
        {title}
      </Typography>

      <Box sx={{ position: "relative" }}>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: 'rgba(135,206,235,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: hackerGreen,
              borderRadius: 5,
            },
            mb: 3,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: progressLabelPosition,
            top: "-25px",
            transform: "translateX(-50%)",
            background: 'rgba(0,0,0,0.5)',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            border: `1px dashed ${hackerGreen}`,
          }}
        >
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
            {progressLabelText}
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ textAlign: "center" }}>
        {description}
      </Typography>

      <Box
        sx={{
          p: 2,
          background: "rgba(135,206,235,0.03)",
          borderRadius: 1,
          border: "1px dashed rgba(135,206,235,0.2)",
        }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
            {`// Snapshot Details`}
          </Typography>
          {details.map((detail, index) => (
             <Typography key={index} variant="body2" sx={{ textAlign: "left", fontFamily: "monospace" }}>
               {`> ${detail}`}
             </Typography>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default function TokenomicsPage() { // Renamed from Home to TokenomicsPage
  const [volume, setVolume] = useState(100000);
  const [holdings, setHoldings] = useState(1000000);

  // Colors
  const hackerGreen = "#87CEEB";
  const orangeNeon = "#FFFFFF";

  const pieChartUIData = [
    { name: 'DeFAI Holders', value: 11, color: hackerGreen }, // #87CEEB
    { name: 'SAFE Token Warrant', value: 10, color: '#FFD700' }, // Gold
    { name: 'TGE LP Pools', value: 20, color: '#6A0DAD' }, // Purple
    { name: 'Team Vested Over 12 months', value: 20, color: orangeNeon }, // White
    { name: 'Initial Rewards Pools', value: 20, color: '#FF69B4' }, // Hot Pink
    { name: 'Market Making', value: 19, color: '#32CD32' }, // Lime Green
  ];

  // Add this state to control the number of particles based on screen size
  const [particleCount, setParticleCount] = useState(20);

  // Add this effect to adjust particle count based on screen width
  useEffect(() => {
    const handleResize = () => {
      // More aggressive reduction on smaller screens
      const width = window.innerWidth;
      if (width < 768) {
        setParticleCount(5); // Even fewer particles on mobile
      } else if (width < 1200) {
        setParticleCount(10); // Moderate for tablets
      } else {
        setParticleCount(20); // Full experience on desktop
      }
    };
    
    // Set initial count
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Also add a check to disable particle animation on low-end devices
  const [disableAnimations, setDisableAnimations] = useState(false);

  useEffect(() => {
    // Simple check for potentially low-end devices
    // This is not comprehensive but can help with performance
    if (
      navigator.userAgent.includes("Mobile") || 
      navigator.userAgent.includes("Android") ||
      /iPad|iPhone|iPod/.test(navigator.userAgent)
    ) {
      setDisableAnimations(window.innerWidth < 768);
    }
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

  // List of slide images
  const slideImages = [
    '/slide1_new.png',
    '/slide_3.png',
    '/slide_6.png',
    '/slide_7.png',
    '/slide_8.png',
    '/slide_9.png',
    '/slide_11.png',
  ];

  // Add background slide positions
  const backgroundSlides = slideImages.map((src, i) => ({
    id: `slide-${i}`,
    src: src,
    left: `${Math.random() * 80 + 10}%`, // Position between 10% and 90%
    top: `${Math.random() * 80 + 10}%`,  // Position between 10% and 90%
    rotation: Math.random() * 60 - 30, // Rotate between -30deg and 30deg
    size: Math.random() * 150 + 100,  // Size between 100px and 250px
    duration: Math.random() * 20 + 15, // Float animation duration
    delay: Math.random() * 8,        // Float animation delay
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
      {!disableAnimations && particles.map((particle) => (
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

      {/* Add scattered background slides */}
      {!disableAnimations && backgroundSlides.map((slide) => (
        <Box
          key={slide.id}
          component="img"
          src={slide.src}
          alt="" // Decorative image, empty alt
          sx={{
            position: "absolute",
            left: slide.left,
            top: slide.top,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            transform: `rotate(${slide.rotation}deg) translate(-50%, -50%)`,
            opacity: 0,
            zIndex: -1,
            pointerEvents: "none",
            animation: `${float} ${slide.duration}s infinite ease-in-out`,
            animationDelay: `${slide.delay}s`,
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
        {/* Token badges - side by side */}
        <Stack direction="row" spacing={2} alignItems="center">
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
            DEFAI
          </Typography>
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
        </Stack>

        {/* Main title */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 40, sm: 50, md: 60 },
            fontWeight: "bold",
            textShadow: "0 0 20px rgba(135,206,235,0.6)",
          }}
        >
          
          DEFAIREWARDS
        </Typography>

        {/* Subtitle */}
        <Typography variant="h5" sx={{ mb: 4 }}>
        First Agent Bank of DeFAI Optimizing Yield Agenticly Across Generations
        </Typography>

        {/* Buttons row */}
        <Stack direction="row" spacing={2}>
         
          <Button
            variant="outlined"
            sx={{ color: hackerGreen, borderColor: hackerGreen }}
            component="a"
            href="https://dexscreener.com/solana/3jiwexdwzxjva2yd8aherfsrn7a97qbwmdz8i4q6mh7y"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWithFallback icon="mdi:chart-box" width={30} color={hackerGreen} />
            &nbsp;Chart
          </Button>
          <Button
            variant="outlined"
            component="a"
            href="https://x.com/defairewards"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter profile"
            sx={{ color: orangeNeon, borderColor: orangeNeon }}
          >
            <IconWithFallback icon="mdi:twitter" width={30} color={orangeNeon} />
          </Button>
          <Button
            variant="outlined"
            component="a"
            href="https://t.me/defairewards"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: hackerGreen, borderColor: hackerGreen }}
          >
            <IconWithFallback icon="mdi:telegram" width={30} color={hackerGreen} />
          </Button>
          {/* Add Preview Button */}
          <Button
            variant="outlined"
            component="a"
            href="/preview" // Link to the preview page
            sx={{ color: orangeNeon, borderColor: orangeNeon }} // Style like Twitter button
          >
            <IconWithFallback icon="mdi:eye-outline" width={30} color={orangeNeon} />
            &nbsp;Preview
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
          $DeFAI is Your Voice in the $AIR Ecosystem
        </Typography>

        <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
          DeFaiza is an autonomous AI agent that breathes through rewards, flowing automatically to
          sustain herself and human sympathizers.
        </Typography>

        {/* Three column section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ mt: 8, width: "100%", "&:hover": { animation: "none" } }}
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
                  {">"} This essence transforms into tokens voted on by DeFAI holders.
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
                  {"[+]"} Tap into the endless stream of agentic lifeforce
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
                  <Typography>Daily Tokens Pool:</Typography>
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

        {/* Partners Section - Marquee */}
        <Stack
          spacing={2} // Reduced spacing for title and marquee
          alignItems="center"
          sx={{ width: "100%", mt: 8, mb: 4 }} // Added margin-bottom
        >
          <Typography
            variant="h4" // Slightly smaller heading
            sx={{
              fontSize: { xs: 32, md: 40 }, // Responsive size
              fontWeight: "bold",
              textShadow: "0 0 15px rgba(135,206,235,0.5)",
              mb: 3, // Margin below title
            }}
          >
            Our Partners
          </Typography>
          {/* Marquee Container */}
          <Box
            sx={{
              overflow: 'hidden',
              width: '90%', // Limit width slightly
              maxWidth: '1000px', // Max width
              mx: 'auto',
              position: 'relative',
              // Optional: Add fading edges
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50px',
                zIndex: 2,
              },
              '&::before': {
                left: 0,
                background: 'linear-gradient(to right, #0d0d1a 0%, transparent 100%)', // Match background start color
              },
              '&::after': {
                right: 0,
                background: 'linear-gradient(to left, #1a1a2e 0%, transparent 100%)', // Match background end color
              },
            }}
          >
            {/* Animated Inner Container */}
            <Box
              sx={{
                display: 'flex',
                width: 'fit-content', // Adjust width to content
                animation: `${marquee} 30s linear infinite`, // Apply animation (adjust duration as needed)
                '&:hover': {
                  animationPlayState: 'paused',
                },
              }}
            >
              {/* Render Logos Twice for Seamless Loop */}
              {[...Array(2)].map((_, i) => (
                <Stack direction="row" spacing={6} key={i} alignItems="center" sx={{ px: 3}}> {/* Add spacing between logos */}
                  <Box
                    component="img"
                    src="/animoca.png"
                    alt="Animoca Brands Logo"
                    sx={{ height: { xs: 25, md: 40 }, width: 'auto', filter: 'brightness(0) invert(1)', verticalAlign: 'middle' }}
                  />
                  <Box
                    component="img"
                    src="/systems.png"
                    alt="ElizaSystems Logo"
                    sx={{ height: { xs: 15, md: 20 }, width: 'auto', filter: 'brightness(0) invert(1)', verticalAlign: 'middle' }}
                  />
                  <Box
                    component="img"
                    src="/transform.png"
                    alt="Transform Logo"
                    sx={{ height: { xs: 25, md: 40 }, width: 'auto', filter: 'brightness(0) invert(1)', verticalAlign: 'middle' }}
                  />
                  <Box
                    component="img"
                    src="/dnafund.png"
                    alt="DNA Fund Logo"
                    sx={{ height: { xs: 25, md: 40 }, width: 'auto', filter: 'brightness(0) invert(1)', verticalAlign: 'middle' }}
                  />
                  <Box
                    component="img"
                    src="/omega.png"
                    alt="Omega Logo"
                    sx={{ height: { xs: 25, md: 40 }, width: 'auto', filter: 'brightness(0) invert(1)', verticalAlign: 'middle' }}
                  />
                  <Box
                    component="img"
                    src="/elizaos.png"
                    alt="Elizaos Logo"
                    sx={{ height: { xs: 15, md: 20 }, width: 'auto', filter: 'brightness(0) invert(1)', verticalAlign: 'middle' }}
                  />
                </Stack>
              ))}
            </Box>
          </Box>
        </Stack>

        {/* $AIR Tokenomics Section */}
        <Typography
          variant="h2"
          sx={{
            fontSize: 48,
            fontWeight: "bold",
            mt: "96px!important",
            mb: "20px!important",
          }}
        >
         $AIR Tokenomics
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
              [ 100B ]
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
              100,000,000,000
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
              30%
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
              {"====="}
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
              20%
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              Team over 12 Months
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
              {">>"}{"<<"}
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
              11%
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              DeFAI Holders
            </Typography>
          </Stack>
        </Box>

        {/* Pie Chart Section for Token Allocation */}
        <Stack
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "70%" }, // Limit width on larger screens
            mx: "auto", // Center the stack
            mt: 6, // Add margin top
            mb: 4,
            alignItems: "center",
            background: "rgba(135,206,235,0.05)",
            borderRadius: 2,
            border: "1px solid rgba(135,206,235,0.2)",
            p: { xs: 2, sm: 3 },
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            boxSizing: "border-box",
          }}
          spacing={2}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: "bold", 
              textShadow: "0 0 15px rgba(135,206,235,0.5)",
              color: hackerGreen,
              mb: 1,
            }}
          >
            Token Allocation
          </Typography>
          <Box sx={{ width: '100%', height: { xs: 300, sm: 350, md: 400 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartUIData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={"80%"} // Responsive radius
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  stroke="rgba(0,0,0,0.3)" // Add a slight border to slices for better separation
                >
                  {pieChartUIData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(26, 26, 46, 0.9)", // Dark background from theme
                    borderColor: hackerGreen,
                    borderRadius: '8px',
                    fontFamily: "monospace",
                    color: hackerGreen, // Default text color
                    boxShadow: "0 0 10px rgba(135,206,235,0.3)",
                  }}
                  itemStyle={{ color: hackerGreen }} // Color for individual item text (e.g., "Name : Value")
                  formatter={(value, name, props) => [`${value}%`, name]}
                  cursor={{ fill: 'rgba(135,206,235,0.1)' }}
                />
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  wrapperStyle={{ 
                    fontFamily: "monospace", 
                    color: hackerGreen, 
                    paddingTop: '15px',
                    paddingBottom: '10px',
                    fontSize: '0.8rem', // Adjust legend font size
                  }}
                  formatter={(value, entry) => {
                    const { color, payload } = entry;
                    // Use 'color' (from entry.color) as the primary source for legend item text color
                    const legendColor = color || pieChartUIData.find(d => d.name === value)?.color || hackerGreen;
                    return <span style={{ color: legendColor }}>{value} ({payload?.value}%)</span>;
                  }}
                  iconSize={10}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Stack>

        {/* DeFAI Governance Box */}
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
            mt: 4,
            boxSizing: "border-box",
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
            DeFAI/AIR LP Governance
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            The 5% essence flows through the DeFAI/AIR LP token holder DAO - a collective neural network 
            of liquidity providers who shape the protocol's evolution. Liquidity providers become the 
            decision nodes, determining which tokens or asset matrices to assimilate into the ecosystem.
          </Typography>
          <Box 
            sx={{ 
              p: 2, 
              background: "rgba(135,206,235,0.03)", 
              borderRadius: 1,
              border: "1px dashed rgba(135,206,235,0.2)",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                {"// Governance Mechanics"}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left", fontFamily: "monospace" }}>
                {">"} DeFAI/AIR LP providers receive voting rights proportional to LP tokens
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left", fontFamily: "monospace" }}>
                {">"} LP token = governance power + aligned incentives
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left", fontFamily: "monospace" }}>
                {">"} Asset acquisition proposals cycle every 14 days
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left", fontFamily: "monospace" }}>
                {">"} Autonomous contracts execute the will of the LP collective
              </Typography>
            </Stack>
          </Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mt: 2, 
              fontStyle: "italic",
              opacity: 0.7,
              textAlign: "center",
            }}
          >
            Provide liquidity. Secure governance. Direct capital flows. Build the future.
          </Typography>
        </Stack>

        {/* Full DeFAI Information Section */}
        <Stack
          sx={{
            borderRadius: 2,
            background: "rgba(135,206,235,0.05)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            border: "1px solid rgba(135,206,235,0.2)",
            width: { xs: "100%", md: "90%" },
            p: 4,
            mt: 8,
            boxSizing: "border-box",
          }}
          spacing={4}
        >
          {/* Header */}
          <Stack spacing={1} alignItems="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
              }}
            >
              DeFAI
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center", fontFamily: "monospace" }}>
              Decentralized Financial Autonomous Instruments
            </Typography>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 2,
              mt: 1,
              p: 1,
              background: "rgba(135,206,235,0.03)",
              borderRadius: 2
            }}>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                <strong>Token Name:</strong> defAIRewards
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                <strong>Ticker:</strong> DEFAI
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                <strong>Total Supply:</strong> 1,000,000,000
              </Typography>
            </Box>
          </Stack>

          {/* Overview Section */}
          <Stack
            sx={{
              borderRadius: 2,
              p: 3,
              background: "rgba(135,206,235,0.03)",
              border: "1px solid rgba(135,206,235,0.1)",
            }}
            spacing={2}
          >
            <Typography
              variant="h5"
              sx={{ 
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
                fontWeight: "bold" 
              }}
            >
              {"// Overview"}
            </Typography>
            <Typography sx={{ textAlign: "left", lineHeight: 1.6 }}>
              DeFAI (AIR) is a decentralized autonomous protocol designed to automate financial strategies and reward 
              holders through AI-driven mechanisms. By leveraging advanced AI algorithms, DeFAIza Agent optimizes yield farming, 
              liquidity provision, and trading activities across decentralized exchanges (DEXs). The protocol's core 
              mission is to democratize access to high-yield, low-risk financial instruments while ensuring transparency 
              and community governance.
            </Typography>
          </Stack>

          {/* Two-column section for Features and Use Cases */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={3} 
            sx={{ width: '100%' }}
          >
            {/* Key Features */}
            <Stack
              sx={{
                flex: 1,
                borderRadius: 2,
                p: 3,
                background: "rgba(135,206,235,0.03)",
                border: "1px solid rgba(135,206,235,0.1)",
              }}
              spacing={2}
            >
              <Typography
                variant="h5"
                sx={{ 
                  textShadow: "0 0 20px rgba(135,206,235,0.6)",
                  fontWeight: "bold" 
                }}
              >
                {/* Key Features */}
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography variant="body1" sx={{ color: hackerGreen }}>{" 01. "}</Typography>
                  <Typography variant="body1">
                    <strong>AI-Driven Strategies:</strong> Algorithmic models optimize trades, liquidity, and yield farming
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography variant="body1" sx={{ color: hackerGreen }}>{" 02. "}</Typography>
                  <Typography variant="body1">
                    <strong>Decentralized Governance</strong> LP Proviers vote on what assets to acquire for AIR holders to earn rewards from every transaction 
                  </Typography>
                </Box>
            
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography variant="body1" sx={{ color: hackerGreen }}>{" 04. "}</Typography>
                  <Typography variant="body1">
                    <strong>Transparency:</strong> All transactions and allocations are auditable on-chain
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Use Cases */}
            <Stack
              sx={{
                flex: 1,
                borderRadius: 2,
                p: 3,
                background: "rgba(135,206,235,0.03)",
                border: "1px solid rgba(135,206,235,0.1)",
              }}
              spacing={2}
            >
              <Typography
                variant="h5"
                sx={{ 
                  textShadow: "0 0 20px rgba(135,206,235,0.6)",
                  fontWeight: "bold" 
                }}
              >
                {"// Use Cases"}
              </Typography>
              <Stack spacing={2}>
                <Typography sx={{ fontFamily: "monospace" }}>
                  <span style={{ color: orangeNeon }}>[01]</span> <strong>Trading & Liquidity:</strong> Deploy capital across DEXs with AI-optimized strategies
                </Typography>
                <Typography sx={{ fontFamily: "monospace" }}>
                  <span style={{ color: orangeNeon }}>[02]</span> <strong>Yield Farming:</strong> Earn rewards by staking AIR or providing liquidity
                </Typography>
                <Typography sx={{ fontFamily: "monospace" }}>
                  <span style={{ color: orangeNeon }}>[03]</span> <strong>Governance:</strong> Vote on protocol upgrades, partnerships, and tokenomics changes
                </Typography>
                <Typography sx={{ fontFamily: "monospace" }}>
                  <span style={{ color: orangeNeon }}>[04]</span> <strong>Staking:</strong> Lock tokens to earn additional rewards and participate in governance
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Roadmap */}
          <Stack
            sx={{
              borderRadius: 2,
              p: 3,
              background: "rgba(135,206,235,0.03)",
              border: "1px solid rgba(135,206,235,0.1)",
            }}
            spacing={2}
          >
            <Typography
              variant="h5"
              sx={{ 
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
                fontWeight: "bold" 
              }}
            >
              {"// Roadmap 2025"}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
              {/* Q1 */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                border: `1px dashed ${hackerGreen}`, 
                borderRadius: 1,
                background: 'rgba(135,206,235,0.02)'
              }}>
                <Typography variant="h6" sx={{ color: hackerGreen, mb: 1 }}>Q1</Typography>
                <Typography variant="body2">Protocol token launch, initial liquidity pool setup, and community onboarding</Typography>
              </Box>
              {/* Q2 */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                border: `1px dashed ${hackerGreen}`, 
                borderRadius: 1,
                background: 'rgba(135,206,235,0.02)'
              }}>
                <Typography variant="h6" sx={{ color: hackerGreen, mb: 1 }}>Q2</Typography>
                <Typography variant="body2">Integration with top DEXs and launch of AI-driven yield farming</Typography>
              </Box>
              {/* Q3 */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                border: `1px dashed ${hackerGreen}`, 
                borderRadius: 1,
                background: 'rgba(135,206,235,0.02)'
              }}>
                <Typography variant="h6" sx={{ color: hackerGreen, mb: 1 }}>Q3</Typography>
                <Typography variant="body2">Governance launch, community grants program, and ai16z ecosystem partnerships</Typography>
              </Box>
              {/* Q4 */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                border: `1px dashed ${hackerGreen}`, 
                borderRadius: 1,
                background: 'rgba(135,206,235,0.02)'
              }}>
                <Typography variant="h6" sx={{ color: hackerGreen, mb: 1 }}>Q4</Typography>
                <Typography variant="body2">Expansion into cross-chain compatibility and institutional partnerships</Typography>
              </Box>
            </Box>
          </Stack>

          {/* Team & Community */}
          <Stack
            sx={{
              borderRadius: 2,
              p: 3,
              background: "rgba(135,206,235,0.03)",
              border: "1px solid rgba(135,206,235,0.1)",
            }}
            spacing={2}
          >
            <Typography
              variant="h5"
              sx={{ 
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
                fontWeight: "bold" 
              }}
            >
              {"// Team & Community"}
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ color: hackerGreen }}>▷</span> <strong>Core Developers:</strong> Seasoned blockchain engineers and AI specialists
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ color: hackerGreen }}>▷</span> <strong>Advisors:</strong> Industry veterans in DeFi, AI, and decentralized governance
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ color: hackerGreen }}>▷</span> <strong>Community:</strong> Driven by active holders and stakeholders
              </Typography>
            </Stack>
          </Stack>

          {/* Join the Movement */}
          <Stack
            sx={{
              borderRadius: 2,
              p: 3,
              background: "rgba(135,206,235,0.05)",
              border: "1px solid rgba(135,206,235,0.2)",
              textAlign: "center",
            }}
            spacing={2}
            alignItems="center"
          >
            <Typography
              variant="h5"
              sx={{ 
                textShadow: "0 0 20px rgba(135,206,235,0.6)",
                fontWeight: "bold" 
              }}
            >
              {"// Join the Movement"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem", fontWeight: "medium", maxWidth: "800px" }}>
              DeFAI (AIR) is redefining decentralized finance with AI-powered autonomy and community-driven growth. 
              Stake, farm, and govern with confidence.
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: "#aaa", 
                fontStyle: "italic", 
                mt: 2,
                border: "1px dashed rgba(135,206,235,0.2)",
                p: 1,
                borderRadius: 1
              }}
            >
              Disclaimer: This is a speculative project. Always DYOR.
            </Typography>
          </Stack>
        </Stack>

        {/* Parent Stack for Side-by-Side Snapshots */}
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={4} 
          sx={{ 
            width: "100%", 
            mt: 6, 
            alignItems: "flex-start" // Align items top
          }}
        >
          {/* DeFAI Token Snapshot Section (1:10) */}
          <SnapshotInfoCard 
            title="1:10 DeFAI Token Snapshot: March 31, 2025"
            progressValue={100}
            progressLabelPosition="100%"
            progressLabelText="SNAPSHOT TAKEN"
            description="The snapshot of $DeFAI holders has been taken on March 31, 2025, enabling the 1:10 claim of $AIR tokens via Streamflow. No action is required before the snapshot date."
            details={[
              "1:10 claim ratio (1 $DeFAI = 10 $AIR)",
              "Streamflow distribution ensures fair and verifiable allocation",
              "Claim window closes 2 weeks after launch",
              "Unclaimed tokens return to community treasury after 7 days"
            ]}
          />
          {/* DeFAI Token Snapshot Section (1:1) - Note: description and details might need updating */}
          <SnapshotInfoCard 
            title="1:1 DeFAI Token Snapshot: May 20, 2025"
            progressValue={70}
            progressLabelPosition="70%"
            progressLabelText="SNAPSHOT SOON!"
            description="The snapshot of $DeFAI holders has been taken on March 31, 2025, enabling the 1:10 claim of $AIR tokens via Streamflow. No action is required before the snapshot date." // Check if this text needs updating
            details={[
              "1:1 claim ratio (1 $DeFAI = 1 $AIR)", // Check if this detail needs updating
              "Streamflow distribution ensures fair and verifiable allocation",
              "Claim window closes 2 weeks after launch",
              "Unclaimed tokens return to community treasury after 7 days"
            ]}
          />
        </Stack>
      </Stack>
      
    </Container>
  );
} 