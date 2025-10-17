import React from 'react';
import { Box, Container, Heading, useColorModeValue } from '@chakra-ui/react';

const Calendar: React.FC = () => {
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Box
      h="100%"
      w="100%"
      bg={pageBg}
      py={{ base: 4, md: 8 }}
      px={{ base: 4, md: 6 }}
      overflow="auto"
    >
      <Container maxW="1400px">
        <Heading size="lg" mb={6} color={textColor} textAlign="center">
          Events Calendar
        </Heading>
        
        <Box
          bg={cardBg}
          borderRadius="lg"
          shadow="md"
          overflow="hidden"
          h="calc(100vh - 200px)"
        >
          <iframe
            src="https://calendar.google.com/calendar/embed?src=c_fb367df1aefc00b24cdf6952d2fee67f7952ceacc893298137768f91b64f5deb%40group.calendar.google.com&ctz=America%2FChicago"
            style={{ border: 0, width: '100%', height: '100%' }}
            frameBorder="0"
            scrolling="no"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Calendar;