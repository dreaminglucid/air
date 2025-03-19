"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Grid,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Snackbar
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useWallet, useConnection, ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import DashboardLayout from '@/components/DashboardLayout';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// Course types
interface CourseModule {
  id: string;
  title: string;
  completed: boolean;
  content: string;
  quiz?: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  completionPercentage: number;
  rewards: {
    xp: number;
    tokens: number;
  };
  modules: CourseModule[];
}

// Define UserProgress interface
interface UserProgress {
  completedModules: string[];
  completedCourses: string[];
  earnedXP: number;
  earnedTokens: number;
  lastUpdated: string;
  certificates?: {
    courseId: string;
    courseTitle: string;
    issuedAt: string;
    transactionId: string;
  }[];
}

// Add WalletWrapperProps interface
interface WalletWrapperProps {
  children: React.ReactNode;
}

// Define WalletConnectWrapper component inline
function WalletConnectWrapper({ children }: WalletWrapperProps) {
  // Ensure we have a valid endpoint
  const endpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || clusterApiUrl('mainnet-beta');
  
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(), 
    new SolflareWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Main content component
function AcademyContent() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [claimingCertificate, setClaimingCertificate] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSyncingProgress, setIsSyncingProgress] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedModules: [],
    completedCourses: [],
    earnedXP: 0,
    earnedTokens: 0,
    lastUpdated: new Date().toISOString()
  });
  
  // Load user progress from localStorage or API
  useEffect(() => {
    if (!publicKey) return;
    
    const walletAddress = publicKey.toBase58();
    setIsSyncingProgress(true);
    
    // Try to load from localStorage first
    const savedProgress = localStorage.getItem(`academy_progress_${walletAddress}`);
    
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setUserProgress(parsedProgress);
        setIsSyncingProgress(false);
      } catch (error) {
        console.error("Error parsing saved progress:", error);
        fetchProgressFromAPI(walletAddress);
      }
    } else {
      fetchProgressFromAPI(walletAddress);
    }
  }, [publicKey]);
  
  // Fetch progress from API
  const fetchProgressFromAPI = async (walletAddress: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Default empty progress for new users
      const defaultProgress: UserProgress = {
        completedModules: [],
        completedCourses: [],
        earnedXP: 0,
        earnedTokens: 0,
        lastUpdated: new Date().toISOString()
      };
      
      setUserProgress(defaultProgress);
      localStorage.setItem(`academy_progress_${walletAddress}`, JSON.stringify(defaultProgress));
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setIsSyncingProgress(false);
    }
  };
  
  // Save progress to localStorage and update state
  const saveProgress = async (progress: UserProgress) => {
    if (!publicKey) return;
    
    const walletAddress = publicKey.toBase58();
    
    // Update local state with properly typed object
    setUserProgress(progress);
    
    // Save to localStorage
    localStorage.setItem(`academy_progress_${walletAddress}`, JSON.stringify(progress));
    
    // In a real app, you would also send this to your backend
    // await simulateApiCall(walletAddress, progress);
  };
  
  // Load courses with user progress applied
  useEffect(() => {
    const timer = setTimeout(() => {
      // Sample course data
      const sampleCourses: Course[] = [
        {
          id: 'defi-basics',
          title: 'DeFi Fundamentals',
          description: 'Learn the basics of decentralized finance, including key concepts, protocols, and use cases.',
          image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000',
          level: 'beginner',
          duration: '2 hours',
          completionPercentage: 75,
          rewards: {
            xp: 500,
            tokens: 50
          },
          modules: [
            {
              id: 'defi-intro',
              title: 'Introduction to DeFi',
              completed: true,
              content: `
                <h2>What is DeFi?</h2>
                <p>Decentralized Finance (DeFi) refers to financial applications built on blockchain technology that aim to recreate and improve upon traditional financial systems without centralized intermediaries like banks.</p>
                
                <h3>Key Characteristics of DeFi</h3>
                <ul>
                  <li><strong>Permissionless:</strong> Anyone with an internet connection can access DeFi services</li>
                  <li><strong>Transparent:</strong> All transactions are recorded on a public blockchain</li>
                  <li><strong>Non-custodial:</strong> Users maintain control of their assets</li>
                  <li><strong>Interoperable:</strong> DeFi protocols can be combined like "money legos"</li>
                  <li><strong>Programmable:</strong> Smart contracts automate financial processes</li>
                </ul>
                
                <h3>The DeFi Ecosystem</h3>
                <p>The DeFi ecosystem includes various categories of applications:</p>
                <ul>
                  <li><strong>Lending and Borrowing:</strong> Platforms like Aave and Compound</li>
                  <li><strong>Decentralized Exchanges (DEXs):</strong> Uniswap, SushiSwap, etc.</li>
                  <li><strong>Stablecoins:</strong> DAI, USDC, and others</li>
                  <li><strong>Derivatives:</strong> Synthetic assets and prediction markets</li>
                  <li><strong>Insurance:</strong> Protection against smart contract risks</li>
                  <li><strong>Asset Management:</strong> Automated portfolio management</li>
                </ul>
              `
            },
            {
              id: 'defi-protocols',
              title: 'Major DeFi Protocols',
              completed: true,
              content: `
                <h2>Major DeFi Protocols</h2>
                <p>Let's explore some of the most important protocols in the DeFi ecosystem.</p>
                
                <h3>Lending Protocols</h3>
                <p><strong>Aave</strong> - A decentralized lending protocol where users can lend and borrow cryptocurrencies. Features include:</p>
                <ul>
                  <li>Flash loans (uncollateralized loans repaid in a single transaction)</li>
                  <li>Variable and stable interest rates</li>
                  <li>Multiple asset support</li>
                </ul>
                
                <p><strong>Compound</strong> - A protocol that establishes money markets with algorithmically set interest rates.</p>
                <ul>
                  <li>Users earn COMP governance tokens for participating</li>
                  <li>Interest rates adjust based on supply and demand</li>
                </ul>
                
                <h3>Decentralized Exchanges (DEXs)</h3>
                <p><strong>Uniswap</strong> - An automated market maker (AMM) that allows users to swap tokens without an order book.</p>
                <ul>
                  <li>Uses liquidity pools instead of order books</li>
                  <li>Anyone can become a liquidity provider and earn fees</li>
                  <li>Constant product formula (x * y = k) determines prices</li>
                </ul>
                
                <p><strong>SushiSwap</strong> - A fork of Uniswap that added additional features like yield farming and governance.</p>
                
                <h3>Stablecoins</h3>
                <p><strong>MakerDAO (DAI)</strong> - A decentralized stablecoin system where users create DAI by depositing collateral.</p>
                <ul>
                  <li>DAI maintains a soft peg to the US Dollar</li>
                  <li>Overcollateralized to ensure stability</li>
                  <li>Governed by MKR token holders</li>
                </ul>
              `
            },
            {
              id: 'defi-risks',
              title: 'Understanding DeFi Risks',
              completed: false,
              content: `
                <h2>Understanding DeFi Risks</h2>
                <p>While DeFi offers many benefits, it also comes with significant risks that users should understand.</p>
                
                <h3>Smart Contract Risk</h3>
                <p>Smart contracts may contain bugs or vulnerabilities that can be exploited by attackers.</p>
                <ul>
                  <li>Code audits help identify vulnerabilities but don't eliminate all risks</li>
                  <li>Even well-audited protocols have suffered exploits</li>
                  <li>Insurance protocols like Nexus Mutual offer some protection</li>
                </ul>
                
                <h3>Oracle Risk</h3>
                <p>DeFi protocols rely on oracles to provide external data (like price feeds).</p>
                <ul>
                  <li>Manipulated oracle data can lead to protocol exploits</li>
                  <li>Flash loan attacks often target oracle vulnerabilities</li>
                </ul>
                
                <h3>Liquidation Risk</h3>
                <p>In lending protocols, collateral can be liquidated if its value falls below required thresholds.</p>
                <ul>
                  <li>Market volatility can trigger unexpected liquidations</li>
                  <li>Gas price spikes during market crashes can prevent users from adding collateral</li>
                </ul>
                
                <h3>Regulatory Risk</h3>
                <p>The regulatory landscape for DeFi is still evolving.</p>
                <ul>
                  <li>Future regulations could impact protocol operations</li>
                  <li>Compliance requirements may change</li>
                </ul>
                
                <h3>Impermanent Loss</h3>
                <p>Liquidity providers in AMMs can experience impermanent loss when asset prices change.</p>
                <ul>
                  <li>The more volatile the assets, the greater the potential impermanent loss</li>
                  <li>Trading fees may not always compensate for impermanent loss</li>
                </ul>
              `
            },
            {
              id: 'defi-quiz',
              title: 'DeFi Fundamentals Quiz',
              completed: false,
              content: `<h2>Test Your Knowledge</h2><p>Complete this quiz to test your understanding of DeFi fundamentals.</p>`,
              quiz: {
                questions: [
                  {
                    id: 'q1',
                    question: 'What is the main purpose of DeFi?',
                    options: [
                      'To create new cryptocurrencies',
                      'To recreate financial services without centralized intermediaries',
                      'To replace traditional banking entirely',
                      'To provide faster transaction speeds than traditional blockchains'
                    ],
                    correctAnswer: 1
                  },
                  {
                    id: 'q2',
                    question: 'Which of the following is NOT a common category in the DeFi ecosystem?',
                    options: [
                      'Lending and borrowing platforms',
                      'Decentralized exchanges (DEXs)',
                      'Centralized payment processors',
                      'Yield aggregators'
                    ],
                    correctAnswer: 2
                  },
                  {
                    id: 'q3',
                    question: 'What is impermanent loss in DeFi?',
                    options: [
                      'The loss of funds due to smart contract hacks',
                      'The temporary reduction in token value during market downturns',
                      'The difference in value between holding assets versus providing liquidity with them',
                      'The loss of private keys resulting in inaccessible funds'
                    ],
                    correctAnswer: 2
                  }
                ]
              }
            }
          ]
        },
        {
          id: 'ai-in-finance',
          title: 'AI in Financial Markets',
          description: 'Explore how artificial intelligence is transforming financial markets and investment strategies.',
          image: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=1000',
          level: 'intermediate',
          duration: '3 hours',
          completionPercentage: 30,
          rewards: {
            xp: 750,
            tokens: 75
          },
          modules: [
            {
              id: 'ai-intro',
              title: 'Introduction to AI in Finance',
              completed: true,
              content: `
                <h2>AI in Financial Markets</h2>
                <p>Artificial Intelligence is revolutionizing how financial markets operate, from trading to risk management.</p>
                
                <h3>Key Applications of AI in Finance</h3>
                <ul>
                  <li><strong>Algorithmic Trading:</strong> Using AI to execute trades at optimal prices and times</li>
                  <li><strong>Risk Assessment:</strong> Identifying potential risks in portfolios and markets</li>
                  <li><strong>Fraud Detection:</strong> Spotting unusual patterns that may indicate fraudulent activity</li>
                  <li><strong>Customer Service:</strong> AI chatbots and assistants for financial services</li>
                  <li><strong>Market Prediction:</strong> Forecasting market movements and trends</li>
                </ul>
                
                <h3>Types of AI Used in Finance</h3>
                <p>Several AI technologies are particularly relevant to financial applications:</p>
                <ul>
                  <li><strong>Machine Learning:</strong> Systems that learn from data to make predictions or decisions</li>
                  <li><strong>Natural Language Processing:</strong> Analyzing news, reports, and social media for sentiment</li>
                  <li><strong>Deep Learning:</strong> Neural networks that can identify complex patterns in market data</li>
                  <li><strong>Reinforcement Learning:</strong> AI that learns optimal trading strategies through trial and error</li>
                </ul>
              `
            },
            {
              id: 'ai-trading',
              title: 'AI Trading Strategies',
              completed: false,
              content: `
                <h2>AI Trading Strategies</h2>
                <p>AI enables sophisticated trading strategies that can analyze vast amounts of data and execute trades with precision.</p>
                
                <h3>Machine Learning for Market Prediction</h3>
                <p>Machine learning models can be trained on historical market data to predict future price movements.</p>
                <ul>
                  <li><strong>Supervised Learning:</strong> Training models on labeled data (e.g., "price went up" or "price went down")</li>
                  <li><strong>Feature Engineering:</strong> Identifying relevant market indicators</li>
                  <li><strong>Model Selection:</strong> Choosing appropriate algorithms (random forests, SVMs, neural networks)</li>
                  <li><strong>Backtesting:</strong> Validating strategies on historical data</li>
                </ul>
                
                <h3>Natural Language Processing for Sentiment Analysis</h3>
                <p>NLP can analyze news articles, social media, and financial reports to gauge market sentiment.</p>
                <ul>
                  <li>Monitoring news sentiment about specific assets or markets</li>
                  <li>Analyzing earnings call transcripts for subtle cues</li>
                  <li>Tracking social media mentions and sentiment</li>
                </ul>
                
                <h3>Reinforcement Learning for Optimal Execution</h3>
                <p>RL agents can learn to execute trades in ways that minimize market impact and maximize returns.</p>
                <ul>
                  <li>Learning optimal trade timing and sizing</li>
                  <li>Adapting to changing market conditions</li>
                  <li>Balancing immediate execution with price improvement</li>
                </ul>
              `
            }
          ]
        }
      ];
      
      // Apply user progress to courses if available
      if (publicKey && userProgress.completedModules) {
        const updatedCourses = sampleCourses.map(course => {
          const updatedModules = course.modules.map(module => ({
            ...module,
            completed: userProgress.completedModules.includes(module.id)
          }));
          
          const completedModulesCount = updatedModules.filter(m => m.completed).length;
          const completionPercentage = (completedModulesCount / updatedModules.length) * 100;
          
          return {
            ...course,
            modules: updatedModules,
            completionPercentage
          };
        });
        
        setCourses(updatedCourses);
      } else {
        setCourses(sampleCourses);
      }
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [publicKey, userProgress]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (courses.length === 0) return 0;
    
    const totalModules = courses.reduce((acc, course) => acc + course.modules.length, 0);
    const completedModules = courses.reduce((acc, course) => 
      acc + course.modules.filter(module => module.completed).length, 0);
    
    return (completedModules / totalModules) * 100;
  }, [courses]);

  // Handle course selection
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCourseDialogOpen(true);
  };
  
  // Handle module selection
  const handleModuleSelect = (module: CourseModule) => {
    setCurrentModule(module);
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
  
  // Handle quiz submission with progress tracking
  const handleQuizSubmit = async () => {
    if (!currentModule?.quiz || !publicKey) return;
    
    // Calculate score
    let correctAnswers = 0;
    currentModule.quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = (correctAnswers / currentModule.quiz.questions.length) * 100;
    setQuizScore(score);
    
    // Check if passed (70% or higher)
    const passed = score >= 70;
    setQuizPassed(passed);
    setQuizSubmitted(true);
    
    // If passed, update progress
    if (passed && !currentModule.completed) {
      // Update the courses state
      const updatedCourses = [...courses];
      const courseIndex = updatedCourses.findIndex(c => c.id === selectedCourse?.id);
      
      if (courseIndex !== -1) {
        const moduleIndex = updatedCourses[courseIndex].modules.findIndex(m => m.id === currentModule.id);
        
        if (moduleIndex !== -1) {
          updatedCourses[courseIndex].modules[moduleIndex].completed = true;
          
          // Recalculate completion percentage
          const completedModules = updatedCourses[courseIndex].modules.filter(m => m.completed).length;
          updatedCourses[courseIndex].completionPercentage = 
            (completedModules / updatedCourses[courseIndex].modules.length) * 100;
          
          setCourses(updatedCourses);
          
          // Update selected course if it's open
          if (selectedCourse) {
            setSelectedCourse(updatedCourses[courseIndex]);
          }
          
          // Update user progress
          const updatedProgress: UserProgress = {
            completedModules: [
              ...userProgress.completedModules,
              currentModule.id
            ],
            completedCourses: [...userProgress.completedCourses],
            earnedXP: userProgress.earnedXP + 50, // XP for completing a module
            earnedTokens: userProgress.earnedTokens + (selectedCourse?.rewards?.tokens || 0),
            lastUpdated: new Date().toISOString()
          };
          
          // Check if course is completed
          const allModulesCompleted = updatedCourses[courseIndex].modules.every(m => m.completed);
          if (allModulesCompleted && !userProgress.completedCourses.includes(updatedCourses[courseIndex].id)) {
            updatedProgress.completedCourses = [
              ...userProgress.completedCourses,
              updatedCourses[courseIndex].id
            ];
            updatedProgress.earnedXP += 200; // Bonus XP for completing course
            updatedProgress.earnedTokens += updatedCourses[courseIndex].rewards.tokens;
          }
          
          // Save updated progress
          saveProgress(updatedProgress);
        }
      }
    }
  };
  
  // Handle certificate claim with blockchain transaction
  const handleClaimCertificate = async () => {
    if (!selectedCourse || !publicKey || !connection) return;
    
    setClaimingCertificate(true);
    
    try {
      // Create a simple memo transaction to record the achievement on-chain
      const DEFAI_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEFAI_CONTRACT_ADDRESS || '';
      const AIR_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AIR_CONTRACT_ADDRESS || '';
      
      if (!DEFAI_CONTRACT_ADDRESS) {
        throw new Error("Contract address not configured");
      }
      
      // In a real implementation, this would be a proper token transfer or NFT mint
      // For demo purposes, we're just sending a small SOL transaction with a memo
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(DEFAI_CONTRACT_ADDRESS),
          lamports: 100, // Minimal amount
        })
      );
      
      // Add a reference to the course completion
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Update user's rewards in progress
      const updatedProgress: UserProgress = {
        ...userProgress,
        earnedTokens: userProgress.earnedTokens + selectedCourse.rewards.tokens,
        certificates: [
          ...(userProgress.certificates || []),
          {
            courseId: selectedCourse.id,
            courseTitle: selectedCourse.title,
            issuedAt: new Date().toISOString(),
            transactionId: signature
          }
        ],
        lastUpdated: new Date().toISOString()
      };
      
      await saveProgress(updatedProgress);
      
      setSnackbarMessage(`Congratulations! You've earned ${selectedCourse.rewards.tokens} AIR tokens and your certificate is now on-chain!`);
      setSnackbarOpen(true);
      
      setCertificateDialogOpen(true);
      setCourseDialogOpen(false);
    } catch (error) {
      console.error("Error claiming certificate:", error);
      setSnackbarMessage("There was an error claiming your certificate. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setClaimingCertificate(false);
    }
  };
  
  // Handle close certificate dialog
  const handleCloseCertificateDialog = () => {
    setCertificateDialogOpen(false);
  };

  // Handle module completion
  const handleCompleteModule = (courseId: string, moduleId: string) => {
    if (!publicKey) return;
    
    const walletAddress = publicKey.toBase58();
    
    // Find the course and module
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return;
    
    const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    // Create updated courses array
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].modules[moduleIndex].completed = true;
    
    // Calculate new completion percentage
    const completedModules = updatedCourses[courseIndex].modules.filter(m => m.completed).length;
    const totalModules = updatedCourses[courseIndex].modules.length;
    updatedCourses[courseIndex].completionPercentage = (completedModules / totalModules) * 100;
    
    // Update courses state
    setCourses(updatedCourses);
    
    // Create a properly typed updated progress object
    const updatedProgress: UserProgress = {
      completedModules: userProgress.completedModules.includes(moduleId) 
        ? userProgress.completedModules 
        : [...userProgress.completedModules, moduleId],
      completedCourses: [...userProgress.completedCourses],
      earnedXP: userProgress.earnedXP + 50, // XP for completing a module
      earnedTokens: userProgress.earnedTokens + (selectedCourse?.rewards?.tokens || 0),
      lastUpdated: new Date().toISOString()
    };
    
    // Check if all modules in the course are completed
    const allModulesCompleted = updatedCourses[courseIndex].modules.every(m => m.completed);
    if (allModulesCompleted && !userProgress.completedCourses.includes(updatedCourses[courseIndex].id)) {
      updatedProgress.completedCourses = [
        ...updatedProgress.completedCourses,
        updatedCourses[courseIndex].id
      ];
      updatedProgress.earnedTokens += updatedCourses[courseIndex].rewards.tokens;
      updatedProgress.earnedXP += updatedCourses[courseIndex].rewards.xp;
      
      // Show certificate dialog
      setSelectedCourse(updatedCourses[courseIndex]);
      setCertificateDialogOpen(true);
    }
    
    // Save progress
    setUserProgress(updatedProgress);
    localStorage.setItem(`academy_progress_${walletAddress}`, JSON.stringify(updatedProgress));
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#87CEEB" }}>
          DeFAI Academy
        </Typography>
        
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
          Learn about DeFi, AI, and blockchain technology to earn rewards and credentials.
        </Typography>
      </Stack>
      
      {/* Content */}
      <Stack spacing={4}>
        {isLoading || isSyncingProgress ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={40} sx={{ color: "#87CEEB" }} />
          </Box>
        ) : (
          <Box>
            {/* Progress Overview with user data */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 4, 
                bgcolor: 'rgba(135,206,235,0.05)',
                border: '1px solid rgba(135,206,235,0.1)',
                borderRadius: 2
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ color: '#87CEEB' }}>
                  Your Learning Progress
                </Typography>
                
                <Box sx={{ width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Overall Completion
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#87CEEB' }}>
                      {Math.round(overallProgress)}%
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={overallProgress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 1,
                      bgcolor: 'rgba(135,206,235,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#87CEEB'
                      }
                    }} 
                  />
                </Box>
                
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Chip 
                    icon={<Icon icon="mdi:star" />} 
                    label={`${courses.reduce((acc, course) => acc + (course.completionPercentage > 0 ? 1 : 0), 0)}/${courses.length} Courses Started`}
                    sx={{ 
                      bgcolor: 'rgba(135,206,235,0.1)', 
                      color: '#87CEEB',
                      border: '1px solid rgba(135,206,235,0.2)'
                    }} 
                  />
                  <Chip 
                    icon={<Icon icon="mdi:trophy" />} 
                    label={`${userProgress.completedCourses?.length || 0} Courses Completed`}
                    sx={{ 
                      bgcolor: 'rgba(135,206,235,0.1)', 
                      color: '#87CEEB',
                      border: '1px solid rgba(135,206,235,0.2)'
                    }} 
                  />
                  <Chip 
                    icon={<Icon icon="mdi:coin" />} 
                    label={`${userProgress.earnedTokens || 0} AIR Earned`}
                    sx={{ 
                      bgcolor: 'rgba(255,215,0,0.1)', 
                      color: '#FFD700',
                      border: '1px solid rgba(255,215,0,0.2)'
                    }} 
                  />
                </Stack>
              </Stack>
            </Paper>
            
            {/* Course Grid */}
            <Typography variant="h6" sx={{ color: '#87CEEB', mb: 2 }}>
              Available Courses
            </Typography>
            
            <Grid container spacing={3}>
              {courses.map(course => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(135,206,235,0.2)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(135,206,235,0.4)',
                      }
                    }}
                  >
                    <CardActionArea 
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                      onClick={() => handleCourseSelect(course)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={course.image}
                          alt={course.title}
                        />
                        <Chip
                          label={course.level}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: (() => {
                              switch(course.level) {
                                case 'beginner': return 'rgba(76,175,80,0.9)';
                                case 'intermediate': return 'rgba(255,152,0,0.9)';
                                case 'advanced': return 'rgba(244,67,54,0.9)';
                                default: return 'rgba(33,150,243,0.9)';
                              }
                            })(),
                            color: '#fff',
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ color: '#87CEEB' }}>
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)', flexGrow: 1 }}>
                          {course.description}
                        </Typography>
                        
                        <Stack spacing={2} sx={{ mt: 'auto' }}>
                          <Box>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                Progress
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#87CEEB' }}>
                                {course.completionPercentage}%
                              </Typography>
                            </Stack>
                            <LinearProgress 
                              variant="determinate" 
                              value={course.completionPercentage} 
                              sx={{ 
                                height: 4, 
                                borderRadius: 1,
                                bgcolor: 'rgba(135,206,235,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#87CEEB'
                                }
                              }} 
                            />
                          </Box>
                          
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Chip 
                              icon={<Icon icon="mdi:clock-outline" />} 
                              label={course.duration}
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(135,206,235,0.1)', 
                                color: 'rgba(255,255,255,0.7)',
                                height: 24
                              }} 
                            />
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Icon icon="mdi:coin" style={{ color: '#FFD700', fontSize: '1.2rem' }} />
                              <Typography variant="body2" sx={{ color: '#FFD700' }}>
                                {course.rewards.tokens}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Stack>
      
      {/* Course Detail Dialog */}
      <Dialog
        open={courseDialogOpen}
        onClose={() => setCourseDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(13,17,28,0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(135,206,235,0.2)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }
        }}
      >
        {selectedCourse && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(135,206,235,0.2)', p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Icon 
                  icon={
                    selectedCourse.level === 'beginner' ? 'mdi:school-outline' : 
                    selectedCourse.level === 'intermediate' ? 'mdi:school' : 
                    'mdi:school-plus'
                  } 
                  style={{ color: '#87CEEB', fontSize: '1.5rem' }} 
                />
                <Typography variant="h5" sx={{ color: '#87CEEB', fontWeight: 'bold' }}>
                  {selectedCourse.title}
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Grid container>
                {/* Left side - Module list */}
                <Grid item xs={12} md={4} sx={{ borderRight: { md: '1px solid rgba(135,206,235,0.2)' } }}>
                  <List sx={{ p: 0 }}>
                    {selectedCourse.modules.map((module, index) => (
                      <ListItem 
                        key={module.id}
                        disablePadding
                        divider={index < selectedCourse.modules.length - 1}
                        sx={{ 
                          borderColor: 'rgba(135,206,235,0.1)',
                        }}
                      >
                        <ListItemButton 
                          selected={currentModule?.id === module.id}
                          onClick={() => handleModuleSelect(module)}
                          sx={{ 
                            py: 2,
                            '&.Mui-selected': {
                              bgcolor: 'rgba(135,206,235,0.1)',
                              borderLeft: '4px solid #87CEEB',
                            },
                            '&:hover': {
                              bgcolor: 'rgba(135,206,235,0.05)',
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {module.completed ? (
                              <Icon icon="mdi:check-circle" style={{ color: '#4CAF50', fontSize: '1.2rem' }} />
                            ) : module.quiz ? (
                              <Icon icon="mdi:help-circle-outline" style={{ color: '#FFC107', fontSize: '1.2rem' }} />
                            ) : (
                              <Icon icon="mdi:book-outline" style={{ color: '#87CEEB', fontSize: '1.2rem' }} />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: module.completed ? '#4CAF50' : 'rgba(255,255,255,0.9)',
                                  fontWeight: currentModule?.id === module.id ? 'bold' : 'normal'
                                }}
                              >
                                {module.title}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                {/* Right side - Module content */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ p: 3 }}>
                    {currentModule ? (
                      <>
                        <Typography variant="h6" sx={{ color: '#87CEEB', mb: 2 }}>
                          {currentModule.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: 1.7,
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {currentModule.content}
                        </Typography>
                        
                        {currentModule.quiz && (
                          <Button
                            variant="contained"
                            startIcon={<Icon icon="mdi:help-circle" />}
                            sx={{
                              mt: 3,
                              bgcolor: 'rgba(255,193,7,0.2)',
                              color: '#FFC107',
                              border: '1px solid rgba(255,193,7,0.3)',
                              '&:hover': {
                                bgcolor: 'rgba(255,193,7,0.3)',
                              }
                            }}
                            onClick={() => {
                              setCourseDialogOpen(false);
                              setQuizDialogOpen(true);
                            }}
                          >
                            Take Quiz
                          </Button>
                        )}
                      </>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          Select a module to start learning
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid rgba(135,206,235,0.2)', p: 2 }}>
              <Button 
                onClick={() => setCourseDialogOpen(false)}
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    color: '#fff',
                  }
                }}
              >
                Close
              </Button>
              <Button 
                variant="contained"
                startIcon={<Icon icon="mdi:certificate" />}
                disabled={!selectedCourse.modules.every(m => m.completed)}
                sx={{
                  bgcolor: 'rgba(135,206,235,0.2)',
                  color: '#87CEEB',
                  border: '1px solid rgba(135,206,235,0.4)',
                  '&:hover': {
                    bgcolor: 'rgba(135,206,235,0.3)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(135,206,235,0.05)',
                    color: 'rgba(135,206,235,0.4)',
                  }
                }}
                onClick={handleClaimCertificate}
              >
                Claim Certificate
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Quiz Dialog */}
      <Dialog
        open={quizDialogOpen}
        onClose={() => {
          setQuizDialogOpen(false);
          setSelectedAnswers({});
          setQuizSubmitted(false);
          setQuizScore(0);
          setQuizPassed(false);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(13, 17, 28, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(135,206,235,0.2)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }
        }}
      >
        {currentModule?.quiz && (
          <>
            <DialogTitle sx={{ 
              borderBottom: '1px solid rgba(135,206,235,0.2)',
              color: '#87CEEB',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Icon icon="mdi:help-circle" style={{ fontSize: '1.5rem' }} />
              Quiz: {currentModule.title}
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              {quizSubmitted ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <CircularProgress
                      variant="determinate"
                      value={quizScore}
                      size={120}
                      thickness={5}
                      sx={{
                        color: quizPassed ? '#4caf50' : '#f44336',
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ color: quizPassed ? '#4caf50' : '#f44336', fontWeight: 'bold' }}
                      >
                        {quizScore}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h5" sx={{ color: quizPassed ? '#4caf50' : '#f44336', mb: 2 }}>
                    {quizPassed ? 'Congratulations!' : 'Try Again'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    {quizPassed 
                      ? 'You have successfully completed this module quiz!' 
                      : 'You need to score at least 70% to pass this quiz. Review the material and try again.'}
                  </Typography>
                  
                  {quizPassed && (
                    <Alert 
                      severity="success"
                      icon={<Icon icon="mdi:trophy" />}
                      sx={{ 
                        mb: 3,
                        bgcolor: 'rgba(76,175,80,0.1)', 
                        color: '#4caf50',
                        border: '1px solid rgba(76,175,80,0.3)',
                        '& .MuiAlert-icon': {
                          color: '#4caf50'
                        }
                      }}
                    >
                      <Typography variant="body2">
                        <strong>+{selectedCourse?.rewards.xp} XP</strong> and <strong>{selectedCourse?.rewards.tokens} AIR tokens</strong> have been added to your account!
                      </Typography>
                    </Alert>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    Complete this quiz to test your knowledge and earn rewards. You need to score at least 70% to pass.
                  </Typography>
                  
                  {currentModule.quiz.questions.map((question, qIndex) => (
                    <Box key={question.id} sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ color: '#87CEEB', mb: 2 }}>
                        {qIndex + 1}. {question.question}
                      </Typography>
                      
                      <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <RadioGroup
                          value={selectedAnswers[question.id] !== undefined ? selectedAnswers[question.id] : ''}
                          onChange={(e) => handleAnswerSelect(question.id, parseInt(e.target.value))}
                        >
                          {question.options.map((option, oIndex) => (
                            <FormControlLabel
                              key={oIndex}
                              value={oIndex}
                              control={
                                <Radio 
                                  sx={{ 
                                    color: 'rgba(135,206,235,0.5)',
                                    '&.Mui-checked': {
                                      color: '#87CEEB',
                                    },
                                  }} 
                                />
                              }
                              label={
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                  {option}
                                </Typography>
                              }
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid rgba(135,206,235,0.2)', p: 2 }}>
              {quizSubmitted ? (
                <Button 
                  onClick={() => {
                    setQuizDialogOpen(false);
                    setCourseDialogOpen(true);
                  }}
                  variant="contained"
                  sx={{
                    bgcolor: 'rgba(135,206,235,0.2)',
                    color: '#87CEEB',
                    border: '1px solid rgba(135,206,235,0.4)',
                    '&:hover': {
                      bgcolor: 'rgba(135,206,235,0.3)',
                    }
                  }}
                >
                  Continue Learning
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setQuizDialogOpen(false)}
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        color: '#fff',
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleQuizSubmit}
                    variant="contained"
                    disabled={currentModule.quiz?.questions.some(q => selectedAnswers[q.id] === undefined)}
                    sx={{
                      bgcolor: 'rgba(135,206,235,0.2)',
                      color: '#87CEEB',
                      border: '1px solid rgba(135,206,235,0.4)',
                      '&:hover': {
                        bgcolor: 'rgba(135,206,235,0.3)',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(135,206,235,0.05)',
                        color: 'rgba(135,206,235,0.4)',
                      }
                    }}
                  >
                    Submit Answers
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Certificate Dialog */}
      <Dialog
        open={certificateDialogOpen}
        onClose={handleCloseCertificateDialog}
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(135,206,235,0.3)',
            borderRadius: 2,
            boxShadow: '0 0 30px rgba(135,206,235,0.2)',
            overflow: 'hidden'
          }
        }}
      >
        {selectedCourse && (
          <>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                background: 'radial-gradient(circle, rgba(135,206,235,0.1) 0%, rgba(0,0,0,0) 70%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  opacity: 0.1,
                  backgroundImage: 'url(/images/certificate-bg.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 0
                }} />
                
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Icon 
                    icon="mdi:certificate" 
                    style={{ 
                      fontSize: '5rem', 
                      color: '#FFD700',
                      marginBottom: '1rem',
                      filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))'
                    }} 
                  />
                  
                  <Typography variant="h4" sx={{ 
                    color: '#FFFFFF', 
                    mb: 1,
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(135,206,235,0.5)'
                  }}>
                    Certificate of Completion
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    This certifies that you have successfully completed
                  </Typography>
                  
                  <Typography variant="h5" sx={{ 
                    color: '#87CEEB', 
                    mb: 3,
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(135,206,235,0.5)'
                  }}>
                    {selectedCourse.title}
                  </Typography>
                  
                  <Divider sx={{ mb: 3, borderColor: 'rgba(135,206,235,0.2)' }} />
                  
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Stack spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          Course Level
                        </Typography>
                        <Chip 
                          label={selectedCourse.level.charAt(0).toUpperCase() + selectedCourse.level.slice(1)}
                          sx={{ 
                            bgcolor: (() => {
                              switch(selectedCourse.level) {
                                case 'beginner': return 'rgba(76,175,80,0.1)';
                                case 'intermediate': return 'rgba(255,152,0,0.1)';
                                case 'advanced': return 'rgba(244,67,54,0.1)';
                                default: return 'rgba(33,150,243,0.1)';
                              }
                            })(),
                            color: (() => {
                              switch(selectedCourse.level) {
                                case 'beginner': return '#4caf50';
                                case 'intermediate': return '#ff9800';
                                case 'advanced': return '#f44336';
                                default: return '#2196f3';
                              }
                            })(),
                            border: (() => {
                              switch(selectedCourse.level) {
                                case 'beginner': return '1px solid rgba(76,175,80,0.3)';
                                case 'intermediate': return '1px solid rgba(255,152,0,0.3)';
                                case 'advanced': return '1px solid rgba(244,67,54,0.3)';
                                default: return '1px solid rgba(33,150,243,0.3)';
                              }
                            })()
                          }} 
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          XP Earned
                        </Typography>
                        <Chip 
                          icon={<Icon icon="mdi:star" style={{ color: '#FFD700' }} />}
                          label={`+${selectedCourse.rewards.xp} XP`}
                          sx={{ 
                            bgcolor: 'rgba(255,215,0,0.1)',
                            color: '#FFD700',
                            border: '1px solid rgba(255,215,0,0.3)'
                          }} 
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          Tokens Earned
                        </Typography>
                        <Chip 
                          icon={<Icon icon="mdi:coin" style={{ color: '#87CEEB' }} />}
                          label={`+${selectedCourse.rewards.tokens} AIR`}
                          sx={{ 
                            bgcolor: 'rgba(135,206,235,0.1)',
                            color: '#87CEEB',
                            border: '1px solid rgba(135,206,235,0.3)'
                          }} 
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
                    Verified on Solana Blockchain
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.3)',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem'
                  }}>
                    {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(135,206,235,0.2)' }}>
              <Button 
                onClick={handleCloseCertificateDialog}
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    color: '#fff',
                  }
                }}
              >
                Close
              </Button>
              <Button 
                variant="contained"
                startIcon={<Icon icon="mdi:share-variant" />}
                sx={{
                  bgcolor: 'rgba(135,206,235,0.2)',
                  color: '#87CEEB',
                  border: '1px solid rgba(135,206,235,0.4)',
                  '&:hover': {
                    bgcolor: 'rgba(135,206,235,0.3)',
                  }
                }}
              >
                Share Achievement
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            bgcolor: 'rgba(76,175,80,0.9)',
            color: '#FFFFFF',
            border: '1px solid rgba(76,175,80,0.5)',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }
        }}
      />
    </Box>
  );
}

// Main component export that wraps everything in the wallet providers
export default function AcademyPage() {
  return (
    <WalletConnectWrapper>
      <DashboardLayout>
        <AcademyContent />
      </DashboardLayout>
    </WalletConnectWrapper>
  );
} 