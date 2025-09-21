import React, { useState } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    Alert,
    AlertIcon,
    useColorModeValue,
    useToast,
    Icon
} from '@chakra-ui/react';
import { Mail } from 'react-feather';
import { useAuth } from '../Auth/Auth';
import api from '../Api/api';

const EmailVerificationRequired: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { username } = useAuth();
    const toast = useToast();

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

    const handleResendEmail = async () => {
        if (!username) return;

        setIsLoading(true);
        try {
            // Get user's email first
            const userResponse = await api.get(`/users/${username}/visit`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (!userResponse.data.email) {
                toast({
                    title: "No Email Found",
                    description: "Please contact support to add an email to your account.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // Send verification email
            await api.post(`/users/resend-verification?email=${userResponse.data.email}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            setEmailSent(true);
            toast({
                title: "Verification Email Sent!",
                description: "Please check your inbox and spam folder.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: "Failed to Send Email",
                description: error.response?.data?.detail || "Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center" p={4}>
            <Box maxW="md" w="full" bg={cardBg} rounded="lg" shadow="md" p={8}>
                <VStack spacing={6} textAlign="center">
                    <Icon as={Mail} boxSize={12} color="blue.500" />
                    
                    <Heading size="lg" color={textColor}>
                        Email Verification Required
                    </Heading>
                    
                    <Text color={textColor}>
                        Welcome to BTH Fitness! To access all features of our veterans community, 
                        please verify your email address by clicking the button below.
                    </Text>

                    {emailSent && (
                        <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <Text fontWeight="bold">Email Sent!</Text>
                                <Text fontSize="sm">Check your inbox and spam folder for the verification link.</Text>
                            </Box>
                        </Alert>
                    )}

                    <VStack spacing={3} w="full">
                        <Button
                            colorScheme="blue"
                            size="lg"
                            w="full"
                            onClick={handleResendEmail}
                            isLoading={isLoading}
                            loadingText="Sending..."
                        >
                            Send Verification Email
                        </Button>
                        
                        <Text fontSize="sm" color={mutedTextColor}>
                            The verification link will expire in 24 hours for security reasons.
                        </Text>
                    </VStack>
                </VStack>
            </Box>
        </Box>
    );
};

export default EmailVerificationRequired;