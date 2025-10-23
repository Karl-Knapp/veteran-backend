import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import api from '../Api/api';

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword: React.FC = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

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
	const linkColor = useColorModeValue("gray.500", "gray.400");
	const linkHoverColor = useColorModeValue("gray.700", "gray.200");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// SECURE: Send as JSON body with Pydantic model
			await api.post(`${API_URL}/users/forgot-password`, {
				email: email.trim()
			});
			setSuccess(true);
		} catch (error) {
			console.error("Error:", error);
			// Still show success message (don't reveal if email exists)
			setSuccess(true);
		} finally {
			setIsLoading(false);
		}
	};

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
				<Button
					variant="ghost"
					leftIcon={<ArrowLeft size={18} />}
					onClick={() => navigate("/login")}
					mb={4}
					color={linkColor}
					_hover={{ color: linkHoverColor, bg: "transparent" }}
				>
					Back to Login
				</Button>

				<Heading mb={2} textAlign="center" fontSize="3xl" color={textColor}>
					Forgot Password
				</Heading>
				<Text
					textAlign="center"
					fontSize="sm"
					color={secondaryTextColor}
					mb={6}
				>
					Enter your email address and we'll send you a link to reset your
					password.
				</Text>

				{success ? (
					<Alert status="success" borderRadius="md" mb={4}>
						<AlertIcon />
						<Box>
							<Text fontWeight="bold">Check your email</Text>
							<Text fontSize="sm">
								If an account exists with {email}, you will receive password reset instructions.
							</Text>
						</Box>
					</Alert>
				) : (
					<form onSubmit={handleSubmit}>
						<Stack spacing={4}>
							<FormControl id="email" isRequired>
								<FormLabel
									fontSize="md"
									fontWeight="medium"
									color={formLabelColor}
								>
									Email Address
								</FormLabel>
								<Input
									name="email"
									type="email"
									placeholder="Enter your email"
									size="lg"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									borderColor={inputBorderColor}
									_hover={{ borderColor: inputHoverBorderColor }}
									_focus={{
										borderColor: inputFocusBorderColor,
										boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
									}}
								/>
							</FormControl>

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
								_hover={{ bgColor: buttonHoverBgColor }}
								_active={{ bgColor: buttonActiveBgColor }}
								borderRadius="md"
								boxShadow="sm"
							>
								Send Reset Link
							</Button>
						</Stack>
					</form>
				)}

				<Box mt={6} textAlign="center">
					<Text fontSize="sm" color={secondaryTextColor}>
						Remember your password?{" "}
						<Button
							variant="link"
							color={linkColor}
							fontWeight="semibold"
							fontSize="sm"
							_hover={{ color: linkHoverColor }}
							onClick={() => navigate("/login")}
						>
							Sign In
						</Button>
					</Text>
				</Box>
			</Box>
		</Center>
	);
};

export default ForgotPassword;