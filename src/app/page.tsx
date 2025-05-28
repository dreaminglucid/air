"use client";
import { useEffect, useState } from 'react';
import { Container, Stack, Typography, Button, Box, Grid, LinearProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Link from 'next/link';
import { keyframes } from '@mui/system';
import { Icon } from "@iconify/react/dist/iconify.js";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Removed keyframes as particles are gone and typewriter handles its own cursor if needed

// Define marquee keyframes (needed for Our Partners section)
const marquee = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); } // Translate by half (since content is doubled)
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
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

interface SnapshotInfoCardProps {
  title: string;
  progressValue: number;
  progressLabelPosition: string;
  progressLabelText: string;
  description: string;
  details: string[];
}

const SnapshotInfoCard = ({ title, progressValue, progressLabelPosition, progressLabelText, description, details }: SnapshotInfoCardProps) => {
  const primaryButtonBlue = "#2563EB"; // Using brand primary blue
  return (
    <Stack
      sx={{ flex: 1, borderRadius: 2, background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", p: 3, boxSizing: "border-box", height: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
      spacing={2}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: '#000000', fontFamily: "'Orbitron', sans-serif" }}>{title}</Typography>
      <Box sx={{ position: "relative" }}>
        <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: primaryButtonBlue, borderRadius: 5, }, mb: 3, }} />
        <Box sx={{ position: "absolute", left: progressLabelPosition, top: "-25px", transform: "translateX(-50%)", background: 'rgba(255,255,255,0.8)', color: '#000000', px: 1.5, py: 0.5, borderRadius: 1, border: `1px dashed ${primaryButtonBlue}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{progressLabelText}</Typography>
        </Box>
      </Box>
      <Typography sx={{ textAlign: "center", color: '#333333', fontFamily: "'Inter', sans-serif" }}>{description}</Typography>
      <Box sx={{ p: 2, background: "rgba(0,0,0,0.01)", borderRadius: 1, border: "1px dashed rgba(0,0,0,0.08)" }}>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#000000", fontFamily: "'Inter', sans-serif" }}>{`// Snapshot Details`}</Typography>
          {details.map((detail, index) => ( <Typography key={index} variant="caption" sx={{ textAlign: "left", fontFamily: "monospace", color: '#555555' }}>{`> ${detail}`}</Typography> ))}
        </Stack>
      </Box>
    </Stack>
  );
};

const partnerLogos = [
  { src: "/animoca.png", alt: "Animoca Brands Logo", sizeFactor: 1, href: "https://animocabrands.com" },
  { src: "/systems.png", alt: "ElizaSystems Logo", sizeFactor: 0.7, href: "https://eliza.systems" },
  { src: "/transform.png", alt: "Transform Logo", sizeFactor: 1, href: "https://transformgroup.com" },
  { src: "/zokyo.png", alt: "Zokyo Logo", sizeFactor: 1, href: "https://zokyo.io" },
  { src: "/dnafund.png", alt: "DNA Fund Logo", sizeFactor: 1, href: "https://dna.fund" },
  { src: "/omega.png", alt: "Omega Logo", sizeFactor: 1, href: "https://omegadao.chat/" },
  { src: "/boosty.png", alt: "Boosty Logo", sizeFactor: 1, href: "https://boostylabs.com" },
  { src: "/elizaos.png", alt: "Elizaos Logo", sizeFactor: 0.7, href: "https://elizaos.ai" },
];

// Data for the snapshot accordions
const snapshotData = [
  {
    id: 'snapshot1',
    title: "1:10 DeFAI Token Snapshot: March 31, 2025",
    progressValue: 100,
    progressLabelPosition: "100%",
    progressLabelText: "SNAPSHOT TAKEN",
    description: "The snapshot of $DeFAI holders has been taken on March 31, 2025, enabling the 1:10 claim of $AIR tokens via Streamflow. No action is required before the snapshot date.",
    details: [
      "1:10 claim ratio (1 $DeFAI = 10 $AIR)",
      "Streamflow distribution ensures fair and verifiable allocation",
      "Claim window closes 2 weeks after launch",
      "Unclaimed tokens return to community treasury after 7 days"
    ]
  },
  {
    id: 'snapshot2',
    title: "1:1 DeFAI Token Snapshot: May 20, 2025",
    progressValue: 70,
    progressLabelPosition: "70%",
    progressLabelText: "SNAPSHOT SOON!",
    description: "The snapshot of $DeFAI holders will be taked on May 20, 2025, enabling the 1:1 claim of $AIR tokens via Streamflow. No action is required before the snapshot date.",
    details: [
      "1:1 claim ratio (1 $DeFAI = 1 $AIR)", 
      "Streamflow distribution ensures fair and verifiable allocation",
      "Claim window closes 2 weeks after launch",
      "Unclaimed tokens return to community treasury after 7 days"
    ]
  }
];

export default function BankingAILandingPage() {
  const primaryTextColor = "#000000"; // Black text
  const primaryButtonBlue = "#2563EB"; // Brand guideline primary blue
  const buttonIconBlue = "#2563EB"; // Using the same blue for icons in buttons
  const headlineFont = "'Inter', -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif";

  useEffect(() => {
    document.body.style.backgroundColor = '#FFFFFF';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Removed email state and handler

  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const buttonSx = {
    color: primaryButtonBlue, 
    borderColor: primaryButtonBlue, 
    borderRadius: '50px',
    padding: '10px 20px', // Default padding for buttons with text
    fontSize: "1rem", 
    fontWeight: 'bold',
    textTransform: 'none', 
    minHeight: '50px',
    transition: 'transform 0.2s ease-in-out, border-color 0.2s ease, background-color 0.2s ease',
    '&:hover': { 
      borderColor: '#1E4BAD', 
      backgroundColor: 'rgba(37, 99, 235, 0.04)',
      transform: 'scale(1.05)',
    }
  };

  const iconButtonSx = {
    ...buttonSx,
    padding: '10px', // Override padding for icon-only buttons to make them more square
  };

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
        spacing={1} 
        alignItems="center"
        sx={{ textAlign: "center", zIndex: 1, px: 2, width: '100%', maxWidth: '700px', mt: {xs: 8, sm: 10} /* Added top margin to push content down since logo is removed */ }}
      >
        {/* Logo Removed 
        <Box sx={{ width: 'auto', height: { xs: 100, sm: 120 }, mb: 2 }}>  
          <img src="/logo.png" alt="Company Logo" style={{ height: '100%', width: 'auto', filter: 'grayscale(100%) brightness(0%) invert(0%)' }} />
        </Box>
        */}

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.5rem' }, 
            fontWeight: 'bold',
            color: primaryButtonBlue,
            fontFamily: headlineFont,
            lineHeight: 1.1,
            mb: 0,
          }}
        >
          Banking AI Agents.
        </Typography>

        <Typography 
          variant="h1"
          sx={{ 
            fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.5rem' }, 
            fontWeight: 'bold',
            color: primaryTextColor,
            fontFamily: headlineFont, 
            lineHeight: 1.1, 
            mb: 3, 
          }}
        >
          Rewarding Humans
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mb: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined" size="large" sx={buttonSx} component="a" href="https://dexscreener.com/solana/3jiwexdwzxjva2yd8aherfsrn7a97qbwmdz8i4q6mh7y" target="_blank" rel="noopener noreferrer">
            <IconWithFallback icon="mdi:chart-bar" width={24} color={buttonIconBlue} />
            &nbsp;Chart
          </Button>
          <Button variant="outlined" size="large" sx={iconButtonSx} component="a" href="https://x.com/defairewards" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter) profile">
            <IconWithFallback icon="pajamas:x" width={24} color={buttonIconBlue} />
          </Button>
          <Button variant="outlined" size="large" sx={iconButtonSx} component={Link} href="https://t.me/defairewards" aria-label="Telegram">
             <IconWithFallback icon="mdi:telegram" width={24} color={buttonIconBlue} />
          </Button>
          <Button
            variant="contained" // Primary CTA style for Check Claim
            size="large"
            sx={{ 
              ...buttonSx, // Inherit base styles
              backgroundColor: primaryButtonBlue,
              color: '#FFFFFF',
              borderColor: primaryButtonBlue, // Ensure border matches for consistency on hover
              '&:hover': { 
                backgroundColor: '#1E4BAD', 
                borderColor: '#1A3C8A', // Darker border on hover
                transform: 'scale(1.05)',
                boxShadow: `0 6px 15px rgba(37, 99, 235, 0.4)`,
              }
            }} 
            component={Link}
            href="/dashboard/claim"
          >
            Check Claim
          </Button>
        </Stack>

      </Stack>

      {/* Hero Image */}
      <Box 
        sx={{
          width: '100%',
          maxWidth: '400px', 
          mt: {xs: 2, sm: 3, md: 4}, // Responsive margin top
          alignSelf: 'center', 
          flexShrink: 0, 
        }}
      >
        <Box 
          component="img"
          src="/tits.png" // Ensuring this uses /tits.png as per user's file
          alt="AI Hero Image" 
          sx={{
            display: 'block',
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '12px', 
            // boxShadow is intentionally removed here as per user's prior file edit
            animation: `${float} 6s infinite ease-in-out`, 
          }}
        />
      </Box>

      {/* Partners Section - Bubble Grid Effect (styling to be reviewed for consistency) */}
      <Stack
        spacing={3} 
        alignItems="center"
        sx={{ width: "100%", mt: {xs: 6, md: 10}, mb: 4, backgroundColor: 'transparent', py: {xs: 3, md: 5} }} // Transparent bg
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: primaryTextColor, mb: 2, fontFamily: "'Orbitron', sans-serif" }}>Our Partners</Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center" sx={{ px: { xs: 1, sm: 2 }, maxWidth: '800px' }}>
          {partnerLogos.map((partner) => (
            <Grid item key={partner.alt} xs={6} sm={3} md={3}>
              <Link href={partner.href} passHref target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    width: { xs: 100, sm: 120 }, 
                    height: { xs: 100, sm: 120 },
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF', 
                    boxShadow: '0px 3px 10px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    mx: 'auto', 
                    animation: `${float} ${Math.random() * 4 + 10}s infinite ease-in-out`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                     '&:hover': { transform: 'scale(1.1)', boxShadow: '0px 5px 15px rgba(0,0,0,0.12)' },
                  }}
                >
                  <img src={partner.src} alt={partner.alt} style={{ maxWidth: `calc(100% * ${partner.sizeFactor || 0.65})`, maxHeight: `calc(100% * ${partner.sizeFactor || 0.65})`, objectFit: 'contain', filter: 'grayscale(100%) brightness(0%) invert(0%)' }} />
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Stack>
      
      {/* Snapshots Section - Accordion Style (styling to be reviewed for consistency) */}
      <Stack 
        spacing={1} // Reduced spacing between accordions
        sx={{ width: "100%", maxWidth: '700px', mx: 'auto', mt: {xs: 3, md: 5}, mb: 4, px: 2 }}
      >
        {snapshotData.map((snapshot) => (
          <Accordion 
            key={snapshot.id} 
            expanded={expandedAccordion === snapshot.id} 
            onChange={handleAccordionChange(snapshot.id)}
            disableGutters
            elevation={0}
            sx={{
              border: `1px solid rgba(0,0,0,0.1)`,
              borderRadius: '8px !important', // Ensure rounded corners
              backgroundColor: 'transparent',
              '&:not(:last-child)': {
                marginBottom: '8px',
              },
              '&.Mui-expanded': { margin: '0 0 8px 0' }, // Remove extra margin when expanded if not needed
              '&::before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color: primaryTextColor}}/>} aria-controls={`${snapshot.id}-content`} id={`${snapshot.id}-header`} sx={{backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '8px', minHeight: '56px', '& .MuiAccordionSummary-content': { marginY: '10px'} }}>
              <Typography variant="subtitle1" sx={{color: primaryTextColor, fontWeight: '600', fontFamily: "'Orbitron', sans-serif"}}>{snapshot.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#FFFFFF', padding: '16px'}}>
              {/* SnapshotInfoCard is now effectively inlined for easier styling according to guidelines */}
              <Stack spacing={2}>
                  <Box sx={{ position: "relative" }}>
                      <LinearProgress variant="determinate" value={snapshot.progressValue} sx={{ height: 8, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: primaryButtonBlue, borderRadius: 5, }, mb: 3, }} />
                      <Box sx={{ position: "absolute", left: snapshot.progressLabelPosition, top: "-25px", transform: "translateX(-50%)", background: 'rgba(255,255,255,0.9)', color: '#000000', px: 1.5, py: 0.5, borderRadius: 1, border: `1px dashed ${primaryButtonBlue}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{snapshot.progressLabelText}</Typography>
                      </Box>
                  </Box>
                  <Typography sx={{ textAlign: "center", color: '#333333', fontFamily: "'Inter', sans-serif" }}>{snapshot.description}</Typography>
                  <Box sx={{ p: 2, background: "rgba(0,0,0,0.01)", borderRadius: 1, border: "1px dashed rgba(0,0,0,0.08)" }}>
                      <Stack spacing={1}>
                          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#000000", fontFamily: "'Inter', sans-serif" }}>{`// Snapshot Details`}</Typography>
                          {snapshot.details.map((detail, index) => ( <Typography key={index} variant="caption" sx={{ textAlign: "left", fontFamily: "monospace", color: '#555555' }}>{`> ${detail}`}</Typography> ))}
                      </Stack>
                  </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

    </Container>
  );
}
