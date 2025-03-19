"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Box,
  Chip,
  Tab,
  Tabs,
  Badge,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { Icon } from '@iconify/react';

// Notification types
type NotificationType = 'transaction' | 'price' | 'governance' | 'security' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon?: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ open, onClose }: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Load notifications (simulated)
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'price',
          title: 'Price Alert: DeFAI Token',
          message: 'DeFAI token price increased by 15% in the last 24 hours.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false,
          icon: 'mdi:chart-line',
          severity: 'success'
        },
        {
          id: '2',
          type: 'transaction',
          title: 'Transaction Confirmed',
          message: 'Your stake of 500 DeFAI tokens has been confirmed.',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          read: false,
          icon: 'mdi:check-circle',
          severity: 'success'
        },
        {
          id: '3',
          type: 'governance',
          title: 'New Governance Proposal',
          message: 'Proposal #42: Increase yield farming rewards for DeFAI/SOL pool.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          read: true,
          icon: 'mdi:gavel',
          actionUrl: '/dashboard/governance',
          severity: 'info'
        },
        {
          id: '4',
          type: 'security',
          title: 'Security Alert',
          message: 'New device logged into your account. Please verify if this was you.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
          read: false,
          icon: 'mdi:shield-alert',
          severity: 'warning'
        },
        {
          id: '5',
          type: 'system',
          title: 'System Maintenance',
          message: 'Scheduled maintenance in 24 hours. Services may be temporarily unavailable.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          read: true,
          icon: 'mdi:cog',
          severity: 'info'
        },
        {
          id: '6',
          type: 'price',
          title: 'AI Prediction Alert',
          message: 'AI model predicts 10% increase in SOL price within 48 hours.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
          read: true,
          icon: 'mdi:robot',
          severity: 'info'
        },
        {
          id: '7',
          type: 'transaction',
          title: 'Yield Harvested',
          message: 'Your yield strategy harvested 12.5 USDC in rewards.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
          read: false,
          icon: 'mdi:cash-multiple',
          severity: 'success'
        },
        {
          id: '8',
          type: 'governance',
          title: 'Voting Period Ending',
          message: 'Proposal #41 voting ends in 12 hours. You have not voted yet.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
          read: true,
          icon: 'mdi:calendar-clock',
          severity: 'warning'
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter notifications based on active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === 0) return notifications;
    
    const typeMap: Record<number, NotificationType[]> = {
      1: ['transaction'],
      2: ['price'],
      3: ['governance'],
      4: ['security', 'system']
    };
    
    return notifications.filter(notification => 
      typeMap[activeTab]?.includes(notification.type)
    );
  }, [activeTab, notifications]);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Get icon and color based on notification type
  const getNotificationStyle = (notification: Notification) => {
    const typeStyles: Record<NotificationType, { color: string, bgColor: string }> = {
      transaction: { color: '#4caf50', bgColor: 'rgba(76,175,80,0.1)' },
      price: { color: '#ff9800', bgColor: 'rgba(255,152,0,0.1)' },
      governance: { color: '#9c27b0', bgColor: 'rgba(156,39,176,0.1)' },
      security: { color: '#f44336', bgColor: 'rgba(244,67,54,0.1)' },
      system: { color: '#2196f3', bgColor: 'rgba(33,150,243,0.1)' }
    };
    
    return typeStyles[notification.type];
  };

  // Count unread notifications
  const unreadCount = useMemo(() => 
    notifications.filter(notification => !notification.read).length,
  [notifications]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: 'rgba(13, 17, 28, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(135,206,235,0.2)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          color: '#fff'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(135,206,235,0.2)',
        pb: 1
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Icon icon="mdi:bell" style={{ color: '#87CEEB', fontSize: '1.5rem' }} />
          <Typography variant="h6" sx={{ color: '#87CEEB' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip 
              label={unreadCount} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(135,206,235,0.2)',
                color: '#87CEEB',
                border: '1px solid rgba(135,206,235,0.4)',
                height: 24,
                minWidth: 24
              }} 
            />
          )}
        </Stack>
        <Box>
          <Button 
            size="small" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            sx={{ 
              color: 'rgba(135,206,235,0.7)',
              mr: 1,
              '&:hover': { color: '#87CEEB' },
              '&.Mui-disabled': { color: 'rgba(135,206,235,0.3)' }
            }}
          >
            Mark all as read
          </Button>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(135,206,235,0.2)' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '.MuiTabs-indicator': { backgroundColor: '#87CEEB' },
            '.MuiTab-root': { color: 'rgba(135,206,235,0.7)' },
            '.Mui-selected': { color: '#87CEEB' } 
          }}
        >
          <Tab label="All" />
          <Tab label="Transactions" />
          <Tab label="Price Alerts" />
          <Tab label="Governance" />
          <Tab label="System" />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ p: 0, maxHeight: '60vh' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={40} sx={{ color: "#87CEEB" }} />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Icon icon="mdi:bell-off" style={{ fontSize: '3rem', color: 'rgba(135,206,235,0.5)', marginBottom: '1rem' }} />
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              No notifications to display
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => {
              const style = getNotificationStyle(notification);
              
              return (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{ 
                      p: 2,
                      bgcolor: notification.read ? 'transparent' : 'rgba(135,206,235,0.05)',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(135,206,235,0.1)'
                      }
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: style.bgColor,
                          color: style.color
                        }}
                      >
                        <Icon icon={notification.icon || 'mdi:bell'} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ 
                            color: notification.read ? 'rgba(255,255,255,0.9)' : '#87CEEB',
                            fontWeight: notification.read ? 'normal' : 'bold'
                          }}>
                            {notification.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {formatTimeAgo(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255,255,255,0.7)',
                              display: 'inline',
                              wordBreak: 'break-word'
                            }}
                          >
                            {notification.message}
                          </Typography>
                          
                          {notification.actionUrl && (
                            <Button
                              size="small"
                              sx={{ 
                                mt: 1,
                                color: '#87CEEB',
                                p: 0,
                                minWidth: 'auto',
                                textTransform: 'none',
                                '&:hover': {
                                  bgcolor: 'transparent',
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              View details
                            </Button>
                          )}
                          
                          {notification.severity && (
                            <Chip
                              size="small"
                              label={notification.severity}
                              sx={{
                                ml: 1,
                                height: 20,
                                fontSize: '0.7rem',
                                bgcolor: (() => {
                                  switch(notification.severity) {
                                    case 'success': return 'rgba(76,175,80,0.1)';
                                    case 'warning': return 'rgba(255,152,0,0.1)';
                                    case 'error': return 'rgba(244,67,54,0.1)';
                                    default: return 'rgba(33,150,243,0.1)';
                                  }
                                })(),
                                color: (() => {
                                  switch(notification.severity) {
                                    case 'success': return '#4caf50';
                                    case 'warning': return '#ff9800';
                                    case 'error': return '#f44336';
                                    default: return '#2196f3';
                                  }
                                })(),
                                border: (() => {
                                  switch(notification.severity) {
                                    case 'success': return '1px solid rgba(76,175,80,0.3)';
                                    case 'warning': return '1px solid rgba(255,152,0,0.3)';
                                    case 'error': return '1px solid rgba(244,67,54,0.3)';
                                    default: return '1px solid rgba(33,150,243,0.3)';
                                  }
                                })()
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredNotifications.length - 1 && (
                    <Divider component="li" sx={{ borderColor: 'rgba(135,206,235,0.1)' }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
} 