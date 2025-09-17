import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/Auth";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getUserData } from "../Api/getData";
import { useToast } from "@chakra-ui/react";
import EmailVerificationRequired from "./EmailVerificationRequired";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    requireEmailVerification?: boolean;
}

const ProtectedRoute = ({ 
    allowedRoles = [], 
    requireEmailVerification = true 
}: ProtectedRouteProps) => {
    const { authToken, username } = useAuth();
    const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
    const [userHasEmail, setUserHasEmail] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const role = localStorage.getItem("role");

    // Check authentication first
    if (!authToken) {
        return (
            <Box textAlign="center" py={20}>
                <Text fontSize="xl" color="red.500">
                    You must be logged in to view this page.
                </Text>
            </Box>
        );
    }

    // Check role authorization
    if (allowedRoles.length > 0 && !allowedRoles.includes(role as string)) {
        return <Navigate to="/unauthorized" />;
    }

    // Email verification check effect
    useEffect(() => {
        const checkEmailVerificationStatus = async () => {
            if (!username || !requireEmailVerification) {
                setLoading(false);
                return;
            }

            try {
                await getUserData({
                    username,
                    setUserData: (userData) => {
                        const hasEmail = userData.email && userData.email.trim() !== '';
                        const isVerified = userData.email_verified || false;
                        
                        setUserHasEmail(hasEmail);
                        setIsEmailVerified(isVerified);
                    },
                    toast,
                });
            } catch (error) {
                console.error('Error checking email verification status:', error);
                setIsEmailVerified(false);
            } finally {
                setLoading(false);
            }
        };

        checkEmailVerificationStatus();
    }, [username, requireEmailVerification, toast]);

    // Don't check email verification if not required
    if (!requireEmailVerification) {
        return <Outlet />;
    }

    // Still loading verification status
    if (loading) {
        return (
            <Box textAlign="center" py={20}>
                <Spinner size="xl" />
                <Text mt={4}>Checking verification status...</Text>
            </Box>
        );
    }

    // User has email but it's not verified
    if (userHasEmail && !isEmailVerified) {
        return <EmailVerificationRequired />;
    }

    // User is verified or has no email, proceed with normal route
    return <Outlet />;
};

export default ProtectedRoute;