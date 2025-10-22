import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Heading,
	Stack,
	Center,
	Text,
	useColorModeValue,
	Alert,
	AlertIcon,
	InputGroup,
	InputRightElement,
	IconButton,
	Progress,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { Eye, EyeOff } from "react-feather";
import api from "../Api/api";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword: React.FC = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isValidating, setIsValidating] = useState(true);
	const [isValidToken, setIsValidToken] = useState(false);
	const [username, setUsername] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();
	const toast = useToast();

	// Color mode values
	const bgColor = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.800", "white");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const formLabelColor = useColorModeValue("gray.700", "gray.300");
	const inputBorderColor = useColorModeValue("gray.300", "gray.600");
	const inputHoverBorderColor = useColorModeValue("gray.400", "gray.500");
	const inputFocusBorderColor = useColorModeValue("gray.500", "gray.400");
	const buttonBgColor = useColorModeValue("gray.500", "gray.600");
	const buttonHoverBgColor = useColorModeValue("gray.600", "gray.700");
	const buttonActiveBgColor = useColorModeValue("gray.700", "gray.800");
	const pageBgColor = useColorModeValue("gray.50", "gray.900");
	const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

	// Password strength indicator
	const getPasswordStrength = (password: string) => {
		if (password.length === 0) return { strength: 0, label: "", color: "gray" };
		if (password.length < 8) return { strength: 25, label: "Weak", color: "red" };
		
		let strength = 25;
		if (password.length >= 12) strength += 25;
		if (/[A-Z]/.test(password)) strength += 25;
		if (/[0-9]/.test(password)) strength += 15;
		if (/[^A-Za-z0-9]/.test(password)) strength += 10;
		
		if (strength < 50) return { strength, label: "Weak", color: "red" };
		if (strength < 75) return { strength, label: "Good", color: "yellow" };
		return { strength, label: "Strong", color: "green" };
	};

	const passwordStrength = getPasswordStrength(newPassword);

	// Verify token on component mount
	useEffect(() => {
		const verifyToken = async () => {
			if (!token) {
				toast({
					title: "Invalid Link",
					description: "No reset token provided",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				navigate("/login");
				return;
			}

			try {
				const response = await api.get(
					`${API_URL}/users/verify-reset-token?token=${token}`
				);

				if (response.data.valid) {
					setIsValidToken(true);
					setUsername(response.data.username);
				} else {
					toast({
						title: "Invalid or Expired Link",
						description: response.data.message || "This password reset link is no longer valid",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
					setTimeout(() => navigate("/forgot-password"), 2000);
				}
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to verify reset link",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				setTimeout(() => navigate("/forgot-password"), 2000);
			} finally {
				setIsValidating(false);
			}
		};

		verifyToken();
	}, [token, navigate, toast]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			toast({
				title: "Passwords don't match",
				description: "Please make sure both passwords are identical",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		if (newPassword.length < 8) {
			toast({
				title: "Password too short",
				description: "Password must be at least 8 characters long",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		setIsLoading(true);

		try {
			await api.post(`${API_URL}/users/reset-password`, {
				token,
				new_password: newPassword,
			});

			toast({
				title: "Password Reset Successful",
				description: "You can now log in with your new password",
				status: "success",
				duration: 5000,
				isClosable: true,
			});

			setTimeout(() => navigate("/login"), 2000);
		} catch (error: any) {
			toast({
				title: "Reset Failed",
				description:
					error.response?.data?.detail || "Failed to reset password",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isValidating) {
		return (
			<Center h="100vh" bg={pageBgColor}>
				<Box textAlign="center">
					<Progress size="xs" isIndeterminate colorScheme="gray" mb={4} />
					<Text color={secondaryTextColor}>Verifying reset link...</Text>
				</Box>
			</Center>
		);
	}

	if (!isValidToken) {
		return null; // Will redirect
	}

	return (
		<Center h="100vh" bg={pageBgColor}>
			<Box
				p={8}
				width="30vw"
				minWidth="350px"
				shadow="lg"
				borderRadius="md"
				bg={bgColor}
				borderWidth="1px"
				borderColor={borderColor}
			>
				<Heading mb={2} textAlign="center" fontSize="3xl" color={textColor}>
					Reset Password
				</Heading>
				<Text
					textAlign="center"
					fontSize="sm"
					color={secondaryTextColor}
					mb={6}
				>
					Enter a new password for {username}
				</Text>

				<form onSubmit={handleSubmit}>
					<Stack spacing={4}>
						<FormControl id="newPassword" isRequired>
							<FormLabel
								fontSize="md"
								fontWeight="medium"
								color={formLabelColor}
							>
								New Password
							</FormLabel>
							<InputGroup>
								<Input
									name="newPassword"
									type={showPassword ? "text" : "password"}
									placeholder="Enter new password"
									size="lg"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									borderColor={inputBorderColor}
									_hover={{ borderColor: inputHoverBorderColor }}
									_focus={{
										borderColor: inputFocusBorderColor,
										boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
									}}
								/>
								<InputRightElement height="100%">
									<IconButton
										aria-label={showPassword ? "Hide password" : "Show password"}
										icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										onClick={() => setShowPassword(!showPassword)}
										variant="ghost"
										size="sm"
									/>
								</InputRightElement>
							</InputGroup>
							{newPassword && (
								<Box mt={2}>
									<Progress
										value={passwordStrength.strength}
										size="sm"
										colorScheme={passwordStrength.color}
										borderRadius="full"
									/>
									<Text fontSize="xs" color={secondaryTextColor} mt={1}>
										Password strength: {passwordStrength.label}
									</Text>
								</Box>
							)}
						</FormControl>

						<FormControl id="confirmPassword" isRequired>
							<FormLabel
								fontSize="md"
								fontWeight="medium"
								color={formLabelColor}
							>
								Confirm Password
							</FormLabel>
							<InputGroup>
								<Input
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm new password"
									size="lg"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									borderColor={inputBorderColor}
									_hover={{ borderColor: inputHoverBorderColor }}
									_focus={{
										borderColor: inputFocusBorderColor,
										boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
									}}
								/>
								<InputRightElement height="100%">
									<IconButton
										aria-label={
											showConfirmPassword ? "Hide password" : "Show password"
										}
										icon={
											showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />
										}
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										variant="ghost"
										size="sm"
									/>
								</InputRightElement>
							</InputGroup>
						</FormControl>

						{confirmPassword && newPassword !== confirmPassword && (
							<Alert status="error" borderRadius="md">
								<AlertIcon />
								Passwords do not match
							</Alert>
						)}

						<Button
							mt={4}
							bgColor={buttonBgColor}
							color="white"
							size="lg"
							type="submit"
							width="full"
							fontSize="md"
							fontWeight="bold"
							isLoading={isLoading}
							isDisabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
							_hover={{ bgColor: buttonHoverBgColor }}
							_active={{ bgColor: buttonActiveBgColor }}
							borderRadius="md"
							boxShadow="sm"
						>
							Reset Password
						</Button>
					</Stack>
				</form>
			</Box>
		</Center>
	);
};

export default ResetPassword;