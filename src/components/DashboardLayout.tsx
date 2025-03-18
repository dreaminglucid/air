"use client";

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Fab
} from '@mui/material';
import { Icon } from "@iconify/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  // Force drawer to open when component mounts on non-mobile
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { 
      text: 'Dashboard',
      icon: 'mdi:view-dashboard',
      path: '/dashboard',
      active: pathname === '/dashboard'
    },
    { 
      text: 'Claim Airdrop', 
      icon: 'mdi:gift-outline', 
      path: '/dashboard/claim',
      active: pathname === '/dashboard/claim'
    },
    { 
      text: 'Vote & Governance', 
      icon: 'mdi:vote-outline', 
      path: '/dashboard/vote',
      active: pathname === '/dashboard/vote'
    },
    { 
      text: 'Analytics', 
      icon: 'mdi:chart-bar', 
      path: '/dashboard/analytics',
      active: pathname === '/dashboard/analytics'
    }
  ];

  const drawer = (
    <>
      <Toolbar sx={{ 
        justifyContent: 'center', 
        borderBottom: '1px solid rgba(135,206,235,0.2)'
      }}>
        <Typography variant="h6" sx={{ color: "#87CEEB", fontWeight: "bold" }}>
          DeFAI Menu
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link} 
              href={item.path}
              sx={{ 
                bgcolor: item.active ? 'rgba(135,206,235,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(135,206,235,0.2)'
                },
                borderLeft: item.active ? '3px solid #87CEEB' : '3px solid transparent'
              }}
            >
              <ListItemIcon sx={{ 
                color: item.active ? '#87CEEB' : 'rgba(135,206,235,0.7)',
                minWidth: '48px' 
              }}>
                <Icon icon={item.icon} width={24} height={24} />
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  color: item.active ? '#87CEEB' : 'rgba(135,206,235,0.7)'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2, borderColor: 'rgba(135,206,235,0.2)' }} />
      
      {/* Back to Home button at bottom */}
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/"
            sx={{ 
              '&:hover': {
                bgcolor: 'rgba(135,206,235,0.2)'
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: 'rgba(135,206,235,0.7)',
              minWidth: '48px' 
            }}>
              <Icon icon="mdi:arrow-left" width={24} height={24} />
            </ListItemIcon>
            <ListItemText 
              primary="Back to Home" 
              sx={{ 
                color: 'rgba(135,206,235,0.7)'
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      bgcolor: 'rgba(13, 17, 28, 1)'  // Dark background
    }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar 
        position="fixed"
        sx={{ 
          width: { md: mobileOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: mobileOpen ? `${drawerWidth}px` : 0 },
          bgcolor: 'rgba(13, 17, 28, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(135,206,235,0.2)',
          boxShadow: 'none',
          transition: 'width 0.3s, margin-left 0.3s',
          zIndex: (theme) => theme.zIndex.drawer + 1  // Ensure AppBar is above drawer
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "#87CEEB" }}
          >
            <Icon icon={mobileOpen ? "mdi:close" : "mdi:menu"} width={24} height={24} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: "#87CEEB" }}>
            DeFAI Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Drawer container */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer - temporary */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                bgcolor: 'rgba(13, 17, 28, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRight: '1px solid rgba(135,206,235,0.2)'
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          /* For desktop - always visible */
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                bgcolor: 'rgba(13, 17, 28, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRight: '1px solid rgba(135,206,235,0.2)',
                height: '100%',
                zIndex: (theme) => theme.zIndex.appBar - 1 // Below app bar
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          p: { xs: 2, md: 3 },
          pt: { xs: 10, md: 12 },
          overflowX: 'hidden',
          bgcolor: 'rgba(13, 17, 28, 1)', // Dark background
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </Box>
      
      {/* Floating action button - only on mobile */}
      <Fab
        color="primary"
        aria-label="open menu"
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' },
          zIndex: 2000,
          bgcolor: 'rgba(135,206,235,0.9)',
          color: '#0D111C',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          '&:hover': {
            bgcolor: '#87CEEB',
          }
        }}
      >
        <Icon icon={mobileOpen ? "mdi:close" : "mdi:menu"} width={24} height={24} />
      </Fab>
    </Box>
  );
} 