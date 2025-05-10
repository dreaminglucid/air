"use client";
import { useEffect, useState } from 'react';
import { Container, Stack, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { keyframes } from '@mui/system';
import { Icon } from "@iconify/react/dist/iconify.js";

// Removed keyframes as particles are gone and typewriter handles its own cursor if needed

// Define marquee keyframes (needed for Our Partners section)
const marquee = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); } // Translate by half (since content is doubled)
`;

const float = keyframes` // float is already defined, ensuring it stays if needed elsewhere, or removing if truly unused.
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-10px) translateX(5px); }
  50% { transform: translateY(0px) translateX(10px); }
  75% { transform: translateY(10px) translateX(5px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

// IconWithFallback component (copied from tokenomics page)
const IconWithFallback = ({ icon, width, color }: { icon: string, width: number, color: string }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    // Fallback to a simple span or a placeholder character if icon fails
    return <span style={{ width, height: width, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid currentColor', borderRadius: '4px', fontSize: `${width*0.8}px` }}>?</span>;
  }
  return (
    <Icon 
      icon={icon} 
      width={width} 
      color={color} 
      onError={() => {
        console.error(`Error loading icon: ${icon}`);
        setHasError(true);
      }}
    />
  );
};

export default function BankingAILandingPage() {
  const primaryTextColor = "#000000"; // Black text
  const hackerGreen = "#87CEEB"; // Main blue color
  // const orangeNeon = "#FFFFFF"; // No longer explicitly needed for button icons if all blue

  useEffect(() => {
    document.body.style.backgroundColor = '#FFFFFF';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Removed email state and handler

  return (
    <Container
      maxWidth={false} // Full width
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Adjusted justifyContent to allow content to naturally flow and then image, then partners
        paddingTop: '2rem', 
        paddingBottom: '2rem', // Added padding bottom for overall spacing
        width: '100vw',
        backgroundColor: '#FFFFFF', 
        overflow: 'hidden', 
      }}
    >
      <Stack
        spacing={3}
        alignItems="center"
        sx={{
          textAlign: "center",
          zIndex: 1, 
          px: 2,
          width: '100%', // Ensure it takes width for alignment of its children
          maxWidth: '800px', // Max width for the main text content block for readability
        }}
      >
        {/* Logo */}
        <Box sx={{ width: 'auto', height: { xs: 150, sm: 200 }, mb: 2 }}> 
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            style={{ 
              height: '100%', 
              width: 'auto', 
              filter: 'grayscale(100%) brightness(0%) invert(0%)' // Make logo black
            }}
          />
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.0rem' }, // Adjusted size slightly
            fontWeight: 'bold',
            color: primaryTextColor,
            fontFamily: 'Georgia, Times New Roman, serif', // Serif font for this heading
            lineHeight: 1.2,
            mb: 1, // Reduced margin from previous Eliza version
          }}
        >
          Banking AI Agents
        </Typography>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.0rem' }, // Adjusted size slightly
            fontWeight: 'bold',
            color: primaryTextColor,
            fontFamily: 'Georgia, Times New Roman, serif', // Serif font for this heading
            lineHeight: 1.2,
            mb: 1, // Reduced margin from previous Eliza version
          }}
        >
          Rewarding Humans
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mb: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="large"
            sx={{ color: hackerGreen, borderColor: hackerGreen, borderWidth: '2px', padding: "10px 20px", fontSize: "1rem", textTransform: 'none', minHeight: '50px', transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover': { borderColor: hackerGreen, borderWidth: '2px', transform: 'scale(1.05)', boxShadow: `0 0 20px ${hackerGreen}`, backgroundColor: 'rgba(135,206,235,0.1)'} }}
            component="a"
            href="https://dexscreener.com/solana/3jiwexdwzxjva2yd8aherfsrn7a97qbwmdz8i4q6mh7y"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWithFallback icon="mdi:chart-box" width={24} color={hackerGreen} />
            &nbsp;Chart
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ color: hackerGreen, borderColor: hackerGreen, borderWidth: '2px', padding: "10px", fontSize: "1rem", textTransform: 'none', minHeight: '50px', transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover': { borderColor: hackerGreen, borderWidth: '2px', transform: 'scale(1.05)', boxShadow: `0 0 20px ${hackerGreen}`, backgroundColor: 'rgba(135,206,235,0.1)'} }}
            component="a"
            href="https://x.com/defairewards"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (formerly Twitter) profile"
          >
            <IconWithFallback icon="pajamas:x" width={24} color={hackerGreen} />
          </Button>
          <Link href="https://t.me/defairewards" passHref>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: hackerGreen, borderColor: hackerGreen, borderWidth: '2px', padding: "10px", fontSize: "1rem", textTransform: 'none', minHeight: '50px', transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover': { borderColor: hackerGreen, borderWidth: '2px', transform: 'scale(1.05)', boxShadow: `0 0 20px ${hackerGreen}`, backgroundColor: 'rgba(135,206,235,0.1)'} }}
            >
              <IconWithFallback icon="mdi:telegram" width={24} color={hackerGreen} />
            </Button>
          </Link>
        </Stack>

      </Stack>

      {/* Image at the bottom of the main content stack */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px', 
          mt: 2, // Adjusted margin, might need 'auto' if main stack height varies greatly
          alignSelf: 'center', 
          paddingTop: '1rem',
          flexShrink: 0, // Prevent from shrinking
        }}
      >
        <Box 
          component="img"
          src="/tits.png" 
          alt="AI generated art" 
          sx={{
            display: 'block',
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', 
          }}
        />
      </Box>

      {/* Partners Section - Moved from Tokenomics */}
      <Stack
        spacing={2} 
        alignItems="center"
        sx={{ 
          width: "100%", 
          mt: {xs: 4, md: 6}, // Margin top from the image above
          mb: 4, // Margin bottom for spacing at page end
          color: '#666', // Adjust text color for light background
          backgroundColor: '#f9f9f9', // Optional: slight background for this section
          py: 4, // Padding top/bottom for the section
        }}
      >
        <Typography
          variant="h4" 
          sx={{
            fontSize: { xs: 28, md: 36 }, 
            fontWeight: "bold",
            // textShadow: "0 0 15px rgba(0,0,0,0.1)", // Softer shadow for light bg
            color: primaryTextColor, // Use main text color
            mb: 3,
          }}
        >
          Our Partners
        </Typography>
        <Box
          sx={{
            overflow: 'hidden',
            width: '90%', 
            maxWidth: '1000px', 
            mx: 'auto',
            position: 'relative',
            // Adjust fading edges for light background if needed
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
              background: 'linear-gradient(to right, #f9f9f9 0%, transparent 100%)', // Match section bg
            },
            '&::after': {
              right: 0,
              background: 'linear-gradient(to left, #f9f9f9 0%, transparent 100%)', // Match section bg
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: 'fit-content', 
              animation: `${marquee} 30s linear infinite`, 
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {[...Array(2)].map((_, i) => (
              <Stack direction="row" spacing={6} key={i} alignItems="center" sx={{ px: 3}}>
                <Box
                  component="img"
                  src="/animoca.png"
                  alt="Animoca Brands Logo"
                  sx={{ height: { xs: 25, md: 40 }, width: 'auto', verticalAlign: 'middle', filter: 'grayscale(100%) brightness(0%) invert(0%)' }}
                />
                <Box
                  component="img"
                  src="/systems.png"
                  alt="ElizaSystems Logo"
                  sx={{ height: { xs: 15, md: 20 }, width: 'auto', verticalAlign: 'middle', filter: 'grayscale(100%) brightness(0%) invert(0%)' }}
                />
                <Box
                  component="img"
                  src="/transform.png"
                  alt="Transform Logo"
                  sx={{ height: { xs: 25, md: 40 }, width: 'auto', verticalAlign: 'middle', filter: 'grayscale(100%) brightness(0%) invert(0%)' }}
                />
                <Box
                  component="img"
                  src="/dnafund.png"
                  alt="DNA Fund Logo"
                  sx={{ height: { xs: 25, md: 40 }, width: 'auto', verticalAlign: 'middle', filter: 'grayscale(100%) brightness(0%) invert(0%)' }}
                />
                <Box
                  component="img"
                  src="/omega.png"
                  alt="Omega Logo"
                  sx={{ height: { xs: 25, md: 40 }, width: 'auto', verticalAlign: 'middle', filter: 'grayscale(100%) brightness(0%) invert(0%)' }}
                />
                <Box
                  component="img"
                  src="/elizaos.png"
                  alt="Elizaos Logo"
                  sx={{ height: { xs: 15, md: 20 }, width: 'auto', verticalAlign: 'middle', filter: 'grayscale(100%) brightness(0%) invert(0%)' }}
                />
                <Box
                  component="img"
                  src="/zokyo.png"
                  alt="Zokyo Logo"
                  sx={{ height: { xs: 25, md: 40 }, width: 'auto', verticalAlign: 'middle', filter: 'grayscale(100%) brightness(0%) invert(0%)' }}
                />
                <Box
                  component="img"
                  src="/boosty.png"
                  alt="Boosty Logo"
                  sx={{ height: { xs: 25, md: 40 }, width: 'auto', verticalAlign: 'middle', filter: 'grayscale(100%) brightness(0%) invert(0%)' }}
                />
              </Stack>
            ))}
          </Box>
        </Box>
      </Stack>

    </Container>
  );
}
