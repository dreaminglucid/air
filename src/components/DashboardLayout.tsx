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
  Fab,
  Chip,
  Badge,
  Button
} from '@mui/material';
import { Icon } from "@iconify/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationsModal from '@/components/NotificationsModal';
import dynamic from 'next/dynamic';

// Dynamically import WalletMultiButton to prevent SSR issues
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Define the menu item interface
interface MenuItem {
  text: string;
  icon: string;
  path?: string;
  action?: () => void;
  active: boolean;
  badge?: number;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Load notification count
  useEffect(() => {
    // This would typically be an API call to get unread notifications count
    // For now, we'll simulate it
    const fetchNotificationCount = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Random number between 0 and 5 for demo purposes
      setNotificationCount(Math.floor(Math.random() * 6));
    };
    
    fetchNotificationCount();
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  // Menu items
  const menuItems: MenuItem[] = [
    { 
      text: 'Dashboard', 
      icon: 'mdi:view-dashboard', 
      path: '/dashboard',
      active: pathname === '/dashboard'
    },
    { 
      text: 'Portfolio', 
      icon: 'mdi:chart-pie', 
      path: '/dashboard/portfolio',
      active: pathname === '/dashboard/portfolio'
    },
    { 
      text: 'Yield Optimizer', 
      icon: 'mdi:chart-line', 
      path: '/dashboard/yield',
      active: pathname === '/dashboard/yield'
    },
    { 
      text: 'Claim Rewards', 
      icon: 'mdi:gift', 
      path: '/dashboard/claim',
      active: pathname === '/dashboard/claim'
    },
    { 
      text: 'Analytics', 
      icon: 'mdi:chart-bar', 
      path: '/dashboard/analytics',
      active: pathname === '/dashboard/analytics'
    },
    { 
      text: 'Bridge', 
      icon: 'mdi:bridge', 
      path: '/dashboard/bridge',
      active: pathname === '/dashboard/bridge'
    },
    { 
      text: 'AI Insights', 
      icon: 'mdi:robot', 
      path: '/dashboard/insights',
      active: pathname === '/dashboard/insights'
    },
    { 
      text: 'Community', 
      icon: 'mdi:account-group', 
      path: '/dashboard/community',
      active: pathname === '/dashboard/community'
    },
    { 
      text: 'DeFAI Academy', 
      icon: 'mdi:school', 
      path: '/dashboard/academy',
      active: pathname === '/dashboard/academy'
    },
    { 
      text: 'Notifications', 
      icon: 'mdi:bell-outline', 
      action: () => setNotificationsOpen(true),
      active: false,
      badge: notificationCount > 0 ? notificationCount : undefined
    }
  ];

  const drawer = (
    <>
      <Toolbar sx={{ 
        justifyContent: sidebarOpen ? 'flex-start' : 'center', 
        borderBottom: '1px solid rgba(135,206,235,0.2)',
        minHeight: '64px !important',
        px: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={handleSidebarToggle}
          sx={{ color: "#87CEEB" }}
        >
          <Icon icon={sidebarOpen ? "mdi:menu-open" : "mdi:menu"} width={24} height={24} />
        </IconButton>
        {sidebarOpen && (
          <Typography variant="h6" sx={{ color: "#87CEEB", fontWeight: "bold", ml: 1 }}>
            DeFAI Menu
          </Typography>
        )}
      </Toolbar>
      <List sx={{ overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={item.path ? Link : 'button'}
              href={item.path}
              onClick={item.action}
              sx={{ 
                bgcolor: item.active ? 'rgba(135,206,235,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(135,206,235,0.2)'
                },
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                minHeight: 48,
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{ 
                color: item.active ? '#87CEEB' : 'rgba(255,255,255,0.7)',
                minWidth: sidebarOpen ? 40 : 'auto',
                mr: sidebarOpen ? 2 : 0
              }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    <Icon icon={item.icon} width={24} height={24} />
                  </Badge>
                ) : (
                  <Icon icon={item.icon} width={24} height={24} />
                )}
              </ListItemIcon>
              {sidebarOpen && (
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: item.active ? '#87CEEB' : 'rgba(255,255,255,0.7)',
                    '& .MuiListItemText-primary': {
                      fontWeight: item.active ? 'bold' : 'normal'
                    }
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2, borderColor: 'rgba(135,206,235,0.2)' }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/"
            sx={{ 
              '&:hover': {
                bgcolor: 'rgba(135,206,235,0.2)'
              },
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              minHeight: 48,
              px: 2.5,
            }}
          >
            <ListItemIcon sx={{ 
              color: 'rgba(135,206,235,0.7)',
              minWidth: sidebarOpen ? 40 : 'auto',
              mr: sidebarOpen ? 2 : 0
            }}>
              <Icon icon="mdi:arrow-left" width={24} height={24} />
            </ListItemIcon>
            {sidebarOpen && (
              <ListItemText 
                primary="Back to Home" 
                sx={{ 
                  color: 'rgba(135,206,235,0.7)'
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  // Update the notificationCount state when notifications change
  const handleNotificationsUpdate = (unreadCount: number) => {
    setNotificationCount(unreadCount);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      bgcolor: 'rgba(13, 17, 28, 1)'
    }}>
      <CssBaseline />
      
      <AppBar 
        position="fixed"
        sx={{ 
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 64}px)` },
          ml: { md: `${sidebarOpen ? drawerWidth : 64}px` },
          bgcolor: 'rgba(13, 17, 28, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(135,206,235,0.2)',
          boxShadow: 'none',
          transition: 'width 0.3s, margin-left 0.3s',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "#87CEEB", display: { xs: 'flex', md: 'none' } }}
          >
            <Icon icon={mobileOpen ? "mdi:close" : "mdi:menu"} width={24} height={24} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: "#87CEEB" }}>
            DeFAI Dashboard
          </Typography>
          
          <IconButton 
            color="inherit" 
            onClick={() => setNotificationsOpen(true)}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <Icon icon="mdi:bell-outline" width={24} height={24} color="#87CEEB" />
            </Badge>
          </IconButton>
          
          <Box sx={{ display: 'inline-block' }}>
            <WalletMultiButton />
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: sidebarOpen ? drawerWidth : 64 }, flexShrink: { md: 0 } }}
      >
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
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: sidebarOpen ? drawerWidth : 64,
                bgcolor: 'rgba(13, 17, 28, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRight: '1px solid rgba(135,206,235,0.2)',
                height: '100%',
                zIndex: (theme) => theme.zIndex.appBar - 1,
                transition: 'width 0.3s ease',
                overflowX: 'hidden'
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${sidebarOpen ? drawerWidth : 64}px)` },
          ml: { md: `${sidebarOpen ? drawerWidth : 64}px` },
          p: { xs: 2, md: 3 },
          pt: { xs: 10, md: 12 },
          overflowX: 'hidden',
          bgcolor: 'rgba(13, 17, 28, 1)',
          position: 'relative',
          zIndex: 1,
          transition: 'width 0.3s, margin-left 0.3s'
        }}
      >
        {children}
      </Box>
      
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
      
      <NotificationsModal 
        open={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)}
        onNotificationsUpdate={handleNotificationsUpdate}
      />
    </Box>
  );
} 