"use client";
import { Container, Typography, Box, Paper, Grid, Card, CardContent, Button, Stack, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import Link from 'next/link';

// Helper component for highlighted sections
const HighlightedSection = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4, 
        border: '2px solid #87CEEB', // Highlight border
        backgroundColor: 'rgba(135, 206, 235, 0.05)', // Slight background tint
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&::before': { // Subtle glow effect
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(135, 206, 235, 0.15) 0%, transparent 70%)',
          animation: 'rotateGlow 10s linear infinite',
        },
        '@keyframes rotateGlow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: '#87CEEB', fontWeight: 'bold', mb: 1 }}>{title}</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: '#FFFFFF' }}>{description}</Typography>
      <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}> {/* Allow content box to grow */}
        {children}
      </Box>
    </Paper>
  );
};

export default function PreviewPage() {
  const hackerGreen = "#87CEEB";
  const orangeNeon = "#FFFFFF";

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 6, 
        minHeight: '100vh', 
        color: hackerGreen,
        background: "linear-gradient(180deg, #000000 0%, #1a1a2e 100%)", // Match homepage background
      }}
    >
      {/* Back Button */}
      <Box sx={{ mb: 2 }}> {/* Add some margin below the button */}
        <Link href="/" passHref>
          <IconButton sx={{ color: hackerGreen }} aria-label="Go back to homepage">
            <Icon icon="mdi:arrow-left" />
          </IconButton>
        </Link>
      </Box>

      <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6, textShadow: "0 0 20px rgba(135,206,235,0.6)" }}>
        Dashboard Preview
      </Typography>

      <Grid container spacing={4}>
        {/* 1. Yield Farming Preview */}
        <Grid item xs={12} md={6}>
          <HighlightedSection 
            title="Automated Yield Farming"
            description="Our AI agent, DeFAIza, automatically harvests rewards from various pools and distributes them. Monitor your passive income generation here."
          >
            {/* Placeholder for Yield Component */}
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(135, 206, 235, 0.2)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: orangeNeon }}>Your Total Yield</Typography>
                <Typography variant="h4" sx={{ color: hackerGreen, my: 1 }}>$1,234.56</Typography>
                <Typography variant="body2" sx={{ color: orangeNeon, opacity: 0.7, mb: 2 }}>Updated every 5 minutes</Typography>
                 <Stack direction="row" spacing={2}>
                    <Button variant="outlined" sx={{ color: hackerGreen, borderColor: hackerGreen }}>View Pools</Button>
                     <Button variant="contained" sx={{ bgcolor: hackerGreen, '&:hover': { bgcolor: '#6aa8c1'} }}>Maximize</Button>
                 </Stack>
              </CardContent>
            </Card>
          </HighlightedSection>
        </Grid>

        {/* 2. Claim Rewards Preview */}
        <Grid item xs={12} md={6}>
          <HighlightedSection 
            title="Claim Airdrops & Rewards"
            description="Claim tokens from partner airdrops or special reward events directly through the dashboard."
          >
            {/* Placeholder for Claim Component */}
             <Card sx={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(135, 206, 235, 0.2)' }}>
              <CardContent>
                 <Typography variant="h6" sx={{ color: orangeNeon }}>Available Claims</Typography>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2, py: 1, borderBottom: '1px dashed grey' }}>
                     <Typography sx={{ color: orangeNeon }}>Snapshot 1:10 $AIR</Typography>
                     <Button variant="contained" size="small" sx={{ bgcolor: hackerGreen, '&:hover': { bgcolor: '#6aa8c1'} }}>Claim</Button>
                 </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2, py: 1 }}>
                     <Typography sx={{ color: orangeNeon }}>Partner Token Drop</Typography>
                     <Button variant="contained" size="small" disabled>Claim Opens Soon</Button>
                 </Box>
              </CardContent>
            </Card>
          </HighlightedSection>
        </Grid>

        {/* 3. Governance Voting Preview */}
        <Grid item xs={12} md={6}>
          <HighlightedSection 
            title="DAO Governance"
            description="Use your DeFAI/AIR LP tokens to vote on proposals, such as which assets the protocol should acquire next or changes to parameters."
          >
            {/* Placeholder for Vote Component */}
             <Card sx={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(135, 206, 235, 0.2)' }}>
               <CardContent>
                <Typography variant="h6" sx={{ color: orangeNeon, mb: 2 }}>Active Proposal</Typography>
                <Typography sx={{ color: orangeNeon, mb: 1 }}>Proposal #007: Acquire ExampleToken (EXT)</Typography>
                 <Box sx={{ border: '1px solid grey', p: 2, borderRadius: 1, mb: 2}}>
                    <Typography variant="body2" sx={{ color: orangeNeon, opacity: 0.9 }}>Details: Allocate 5% of the treasury to acquire EXT for the rewards pool...</Typography>
                 </Box>
                 <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<Icon icon="mdi:check-circle-outline" />} sx={{ color: hackerGreen, borderColor: hackerGreen, flexGrow: 1 }}>Vote YES</Button>
                     <Button variant="outlined" startIcon={<Icon icon="mdi:close-circle-outline" />} sx={{ color: orangeNeon, borderColor: orangeNeon, flexGrow: 1 }}>Vote NO</Button>
                 </Stack>
                 <Typography variant="caption" display="block" sx={{ color: orangeNeon, opacity: 0.7, mt: 1, textAlign: 'center' }}>Voting ends in 3 days</Typography>
               </CardContent>
             </Card>
          </HighlightedSection>
        </Grid>
        
        {/* 4. Analytics & Insights Preview */}
        <Grid item xs={12} md={6}>
          <HighlightedSection 
            title="Analytics & Insights"
            description="Visualize key metrics like your portfolio performance."
          >
            {/* Placeholder for Analytics Component */}
             <Card sx={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(135, 206, 235, 0.2)', textAlign: 'center', p: 3 }}>
              <Icon icon="mdi:chart-areaspline" width="80" color={hackerGreen} style={{ marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ color: orangeNeon }}>Performance Chart</Typography>
              {/* Improved Chart Mockup Area */}
              <Box sx={{ height: 100, border: '1px dashed grey', borderRadius: 1, p: 1, mt: 1, mb: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', overflow: 'hidden' }}>
                <Box sx={{ width: '15%', height: '60%', bgcolor: 'rgba(135, 206, 235, 0.3)' }} />
                <Box sx={{ width: '15%', height: '80%', bgcolor: 'rgba(135, 206, 235, 0.5)' }} />
                <Box sx={{ width: '15%', height: '40%', bgcolor: 'rgba(135, 206, 235, 0.2)' }} />
                <Box sx={{ width: '15%', height: '70%', bgcolor: 'rgba(135, 206, 235, 0.4)' }} />
              </Box>
              {/* <Typography variant="body2" sx={{ color: orangeNeon, opacity: 0.7 }}>[Chart Mockup Area]</Typography> */}
             </Card>
          </HighlightedSection>
        </Grid>

        {/* 5. Agentic RWA Creation & Inheritance Preview */}
        <Grid item xs={12} md={12}>
          <HighlightedSection 
            title="Agentic RWA Creation & Inheritance"
            description="Leverage DeFAIza to autonomously create and manage Real World Assets (RWAs) represented on-chain. Set up inheritance protocols for seamless asset transfer."
          >
            {/* Placeholder for RWA Component */}
             <Card sx={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(135, 206, 235, 0.2)', textAlign: 'center', p: 3 }}>
              <Icon icon="mdi:cube-send" width="80" color={hackerGreen} style={{ marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ color: orangeNeon }}>Manage Your Digital Assets</Typography>
              <Typography variant="body2" sx={{ color: orangeNeon, opacity: 0.7, my: 2 }}>Create, manage, and transfer tokenized RWAs with agentic assistance.</Typography>
             </Card>
          </HighlightedSection>
        </Grid>

      </Grid>
    </Container>
  );
} 