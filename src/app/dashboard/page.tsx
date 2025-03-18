"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { keyframes } from "@mui/system";

// Animation keyframes
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Message types
type MessageType = {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
};

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      text: "Hello! I'm DeFAIza, your AI assistant. How can I help you manage your rewards today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Handle message submission
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response with common DeFAI-related responses
    setTimeout(() => {
      const responses = [
        "The essence flows every 5 minutes! Your rewards are being distributed automatically to your wallet.",
        "Your AI16Z lifeforce is continuously growing. No need to claim - the stream is automatic.",
        "The 5% transaction essence powers the entire reward ecosystem. It's the digital lifeforce that sustains us all.",
        "According to my calculations, with current volume, your holdings should generate passive rewards at approximately 0.05% daily.",
        "The protocol is functioning optimally. All essence collection and distribution systems are online.",
        "Remember, your rewards scale with your holdings. The more $AIR you hold, the greater your share of the flow.",
        "I'm detecting healthy network activity. The ecosystem is thriving and the reward pool is being continuously replenished.",
      ];

      // Generate agent response based on user input
      let responseText = "";
      if (input.toLowerCase().includes("reward") || input.toLowerCase().includes("earn")) {
        responseText = responses[0];
      } else if (input.toLowerCase().includes("claim")) {
        responseText = responses[1];
      } else if (input.toLowerCase().includes("tax") || input.toLowerCase().includes("fee")) {
        responseText = responses[2];
      } else if (input.toLowerCase().includes("calculate") || input.toLowerCase().includes("how much")) {
        responseText = responses[3];
      } else if (input.toLowerCase().includes("status") || input.toLowerCase().includes("working")) {
        responseText = responses[4];
      } else if (input.toLowerCase().includes("hold") || input.toLowerCase().includes("more")) {
        responseText = responses[5];
      } else {
        // Default response for anything else
        responseText = responses[6];
      }

      const agentMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "agent",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container 
      sx={{ 
        background: "linear-gradient(180deg, #000000 0%, #1a1a2e 100%)", 
        minHeight: "100vh",
        py: 4,
        color: "#87CEEB",
      }}
    >
      <Stack spacing={3} sx={{ height: "100%" }}>
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: "bold",
            textShadow: "0 0 20px rgba(135,206,235,0.6)",
            textAlign: "center",
            mb: 3
          }}
        >
          DeFAI Rewards Dashboard
        </Typography>

        {/* Chat container */}
        <Paper 
          elevation={0}
          sx={{
            height: "70vh", 
            bgcolor: "rgba(0,0,0,0.5)",
            borderRadius: 2,
            border: "1px solid rgba(135,206,235,0.2)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Message area */}
          <Box 
            sx={{ 
              p: 2, 
              flexGrow: 1, 
              overflow: "auto",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxHeight: "calc(70vh - 130px)",
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                {message.sender === "agent" && (
                  <Avatar 
                    sx={{ 
                      mr: 1, 
                      bgcolor: "rgba(135,206,235,0.2)",
                      border: "1px solid rgba(135,206,235,0.4)",
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>AI</Typography>
                  </Avatar>
                )}
                
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: message.sender === "user" 
                      ? "rgba(255,255,255,0.1)" 
                      : "rgba(135,206,235,0.1)",
                    border: message.sender === "user"
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid rgba(135,206,235,0.2)",
                    animation: message.sender === "agent" ? `${float} 4s infinite ease-in-out` : "none",
                    fontFamily: message.sender === "agent" ? "monospace" : "inherit",
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {message.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: "block", 
                      mt: 1, 
                      color: "rgba(255,255,255,0.7)",
                      fontWeight: "500"
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                
                {message.sender === "user" && (
                  <Avatar 
                    sx={{ 
                      ml: 1, 
                      bgcolor: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>YOU</Typography>
                  </Avatar>
                )}
              </Box>
            ))}
            
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  mb: 2,
                }}
              >
                <Avatar 
                  sx={{ 
                    mr: 1, 
                    bgcolor: "rgba(135,206,235,0.2)",
                    border: "1px solid rgba(135,206,235,0.4)",
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>AI</Typography>
                </Avatar>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(135,206,235,0.1)",
                    border: "1px solid rgba(135,206,235,0.2)",
                    width: 80,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography 
                    sx={{ 
                      animation: `${pulse} 1.5s infinite ease-in-out`,
                      fontSize: "1.5rem",
                    }}
                  >
                    ...
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          
          {/* Input area */}
          <Box 
            sx={{ 
              p: 2, 
              borderTop: "1px solid rgba(135,206,235,0.2)",
              bgcolor: "rgba(0,0,0,0.3)",
            }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask about your rewards..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    borderRadius: 2,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(135,206,235,0.5)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(135,206,235,0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(135,206,235,0.5)",
                    },
                  },
                }}
              />
              <IconButton 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                sx={{ 
                  bgcolor: "rgba(135,206,235,0.1)",
                  border: "1px solid rgba(135,206,235,0.3)",
                  color: "#87CEEB",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    bgcolor: "rgba(135,206,235,0.2)",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(135,206,235,0.3)",
                  }
                }}
              >
                <Icon icon="mdi:send" width={24} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>

        {/* Navigation back to home */}
        <Button
          variant="outlined"
          component="a"
          href="/"
          startIcon={<Icon icon="mdi:arrow-left" />}
          sx={{ 
            color: "#87CEEB", 
            borderColor: "rgba(135,206,235,0.3)",
            alignSelf: "center",
            mt: 2,
            "&:hover": {
              borderColor: "rgba(135,206,235,0.6)",
              bgcolor: "rgba(135,206,235,0.1)",
            }
          }}
        >
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
} 