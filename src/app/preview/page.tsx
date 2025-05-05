"use client";
import { Container, Typography, Box, Paper, Grid, Card, CardContent, Button, Stack } from '@mui/material';
import { Icon } from '@iconify/react';

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
      <Box sx={{ position: 'relative', zIndex: 1 }}> {/* Ensure content is above glow */}
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
            description="Visualize key metrics like your portfolio performance, overall protocol health, reward distribution history, and market trends."
          >
            {/* Placeholder for Analytics Component */}
             <Card sx={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(135, 206, 235, 0.2)', textAlign: 'center', p: 3 }}>
              <Icon icon="mdi:chart-areaspline" width="80" color={hackerGreen} style={{ marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ color: orangeNeon }}>Performance Chart</Typography>
              <Typography variant="body2" sx={{ color: orangeNeon, opacity: 0.7 }}>[Chart Mockup Area]</Typography>
               <Button variant="text" sx={{ color: hackerGreen, mt: 2 }}>View Detailed Report</Button>
             </Card>
          </HighlightedSection>
        </Grid>
      </Grid>
    </Container>
  );
} 