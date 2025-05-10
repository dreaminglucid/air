"use client";
import { useEffect, useState } from 'react';
import { Container, Stack, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

// Removed keyframes as particles are gone and typewriter handles its own cursor if needed

export default function BankingAILandingPage() {
  const primaryTextColor = "#000000"; // Black text
  const hackerGreen = "#87CEEB"; // For original buttons

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
        justifyContent: "space-between", // Pushes content to top & image towards bottom
        paddingTop: '2rem', 
        paddingBottom: '0', 
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
        }}
      >
        {/* Logo */}
        <Box sx={{ width: 'auto', height: { xs: 60, sm: 200 }, mb: 2 }}> 
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

        <Stack direction={{ xs: 'column', sm: 'row'}} spacing={2} sx={{ mb: 4 }}>
          <Link href="/tokenomics" passHref>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: hackerGreen,
                borderColor: hackerGreen,
                borderWidth: '2px',
                padding: "10px 30px",
                fontSize: "1.1rem",
                textTransform: 'none',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  borderColor: hackerGreen,
                  borderWidth: '2px',
                  transform: 'scale(1.05)',
                  boxShadow: `0 0 20px ${hackerGreen}`,
                  backgroundColor: 'rgba(135,206,235,0.1)'
                },
              }}
            >
              Explore
            </Button>
          </Link>
          <Link href="https://t.me/defairewards" passHref>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: hackerGreen, 
                borderColor: hackerGreen,
                borderWidth: '2px',
                padding: "10px 30px",
                fontSize: "1.1rem",
                textTransform: 'none',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  borderColor: hackerGreen,
                  borderWidth: '2px',
                  transform: 'scale(1.05)',
                  boxShadow: `0 0 20px ${hackerGreen}`,
                  backgroundColor: 'rgba(135,206,235,0.1)'
                },
              }}
            >
              Telegram
            </Button>
          </Link>
        </Stack>

      </Stack>

      {/* Image at the bottom */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px', 
          mt: 'auto',      
          alignSelf: 'center', 
          paddingTop: '1rem', // Reduced padding above image
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
    </Container>
  );
}
