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
  0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-8px) translateX(4px) rotate(1deg); }
  50% { transform: translateY(0px) translateX(8px) rotate(0deg); }
  75% { transform: translateY(8px) translateX(4px) rotate(-1deg); }
  100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
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
  const hackerGreen = "#87CEEB"; 
  return (
    <Stack
      sx={{
        flex: 1, 
        borderRadius: 2,
        background: "rgba(0,0,0,0.02)", 
        border: "1px solid rgba(0,0,0,0.1)", 
        cursor: "pointer",
        p: 3,
        boxSizing: "border-box",
        height: '100%', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
      }}
      spacing={2}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: '#000000' }}>{title}</Typography>
      <Box sx={{ position: "relative" }}>
        <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: hackerGreen, borderRadius: 5, }, mb: 3, }} />
        <Box sx={{ position: "absolute", left: progressLabelPosition, top: "-25px", transform: "translateX(-50%)", background: 'rgba(255,255,255,0.8)', color: '#000000', px: 1.5, py: 0.5, borderRadius: 1, border: `1px dashed ${hackerGreen}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{progressLabelText}</Typography>
        </Box>
      </Box>
      <Typography sx={{ textAlign: "center", color: '#333333' }}>{description}</Typography>
      <Box sx={{ p: 2, background: "rgba(0,0,0,0.01)", borderRadius: 1, border: "1px dashed rgba(0,0,0,0.1)", }}>
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000000" }}>{`// Snapshot Details`}</Typography>
          {details.map((detail, index) => ( <Typography key={index} variant="body2" sx={{ textAlign: "left", fontFamily: "monospace", color: '#333333' }}>{`> ${detail}`}</Typography> ))}
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
    description: "The snapshot of $DeFAI holders will be taked on May 20, 2025, enabling the 1:10 claim of $AIR tokens via Streamflow. No action is required before the snapshot date.",
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
  const hackerGreen = "#87CEEB"; // Main blue color
  // const orangeNeon = "#FFFFFF"; // No longer explicitly needed for button icons if all blue

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

      {/* Partners Section - Bubble Grid Effect */}
      <Stack
        spacing={3} // Increased spacing for title and grid
        alignItems="center"
        sx={{ width: "100%", mt: {xs: 4, md: 8}, mb: 4, backgroundColor: '#f9f9f9', py: {xs: 3, md: 5} }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: "bold", color: primaryTextColor, mb: 2 }}>Our Partners</Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center" sx={{ px: { xs: 1, sm: 2 }, maxWidth: '1000px' }}>
          {partnerLogos.map((partner, index) => (
            <Grid item key={partner.alt} xs={6} sm={4} md={3}>
              <Link href={partner.href} passHref target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    width: { xs: 100, sm: 120 }, // Bubble size
                    height: { xs: 100, sm: 120 },
                    borderRadius: '50%',
                    backgroundColor: '#ffffff', // White background for bubble
                    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '15px',
                    mx: 'auto', // Center bubble in grid item
                    animation: `${float} ${Math.random() * 5 + 15}s infinite ease-in-out`,
                    animationDelay: `${Math.random() * 2}s`,
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0px 6px 20px rgba(0,0,0,0.15)',
                    },
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <img 
                    src={partner.src} 
                    alt={partner.alt} 
                    style={{ 
                      maxWidth: `calc(100% * ${partner.sizeFactor || 0.7})`, // Adjust max width based on factor
                      maxHeight: `calc(100% * ${partner.sizeFactor || 0.7})`, 
                      objectFit: 'contain', 
                      filter: 'grayscale(100%) brightness(0%) invert(0%)'
                    }}
                  />
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* Snapshots Section - Accordion Style */}
      <Stack 
        spacing={2} // Spacing between accordions
        sx={{ 
          width: "100%", 
          maxWidth: '900px', // Max width for accordion section
          mx: 'auto', 
          mt: {xs: 4, md: 6}, 
          mb: 4,
          px: 2, 
        }}
      >
        {snapshotData.map((snapshot) => (
          <Accordion 
            key={snapshot.id} 
            expanded={expandedAccordion === snapshot.id} 
            onChange={handleAccordionChange(snapshot.id)}
            sx={{
              background: "rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              '&.Mui-expanded': {
                margin: '16px 0' // Add margin when expanded
              },
              '&::before': {
                 display: 'none', // Remove default top border from accordion
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{color: primaryTextColor}}/>}
              aria-controls={`${snapshot.id}-content`}
              id={`${snapshot.id}-header`}
              sx={{ '& .MuiAccordionSummary-content': { marginY: '12px'} }}
            >
              <Typography variant="h6" sx={{color: primaryTextColor, fontWeight: 'medium'}}>{snapshot.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: 'rgba(0,0,0,0.01)', paddingTop: 0}}>
              <SnapshotInfoCard 
                title="" // Title is now in AccordionSummary, so pass empty or remove from card if not needed internally
                progressValue={snapshot.progressValue}
                progressLabelPosition={snapshot.progressLabelPosition}
                progressLabelText={snapshot.progressLabelText}
                description={snapshot.description}
                details={snapshot.details}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

    </Container>
  );
}
