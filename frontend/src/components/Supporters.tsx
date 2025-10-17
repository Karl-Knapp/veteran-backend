import React from 'react';
import {
  Box,
  Text,
  Heading,
  Container,
  SimpleGrid,
  Link,
  Image,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';

// Import images from public folder
import bartlettFoundation from '/bartlett-foundation.avif';
import commonwealthOfPA from '/commonwealth-of-pennsylvania.avif';
import dsfCharitable from '/dsf-charitable-foundation.avif';
import paHealthWellness from '/pa-health-and-wellness.avif';
import rotaryClub from '/rotary-club-of-colonial-park-foundation.avif';
import stonebridgeFinancial from '/stonebridge-financial-group.avif';
import walmart from '/walmart.avif';
import wawa from '/wawa-logo.avif';

const Donators: React.FC = () => {
  // Color mode values matching Profile component
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const subTextColor = useColorModeValue('gray.500', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Array of supporter data
  const supporters = [
    {
      imageUrl: bartlettFoundation,
      linkUrl: 'https://www.bartlettgroup.com/giving-back/',
      name: 'Bartlett Foundation',
      size: 'lg'
    },
    {
      imageUrl: commonwealthOfPA,
      linkUrl: 'https://www.pa.gov/',
      name: 'Commonwealth of Pennsylvania',
      size: 'xl'
    },
    {
      imageUrl: dsfCharitable,
      linkUrl: 'https://www.dsfcf.org/',
      name: 'DSF Charitable Foundation',
      size: 'lg'
    },
    {
      imageUrl: paHealthWellness,
      linkUrl: 'https://www.pahealthwellness.com/',
      name: 'PA Health and Wellness',
      size: 'md'
    },
    {
      imageUrl: rotaryClub,
      linkUrl: 'https://colonialparkrotaryfoundation.org/',
      name: 'Rotary Club of Colonial Park Foundation',
      size: 'md'
    },
    {
      imageUrl: stonebridgeFinancial,
      linkUrl: 'https://stonebridgefg.com/',
      name: 'Stonebridge Financial Group',
      size: 'lg'
    },
    {
      imageUrl: walmart,
      linkUrl: 'https://www.walmart.org/',
      name: 'Walmart',
      size: 'md'
    },
    {
      imageUrl: wawa,
      linkUrl: 'https://www.wawa.com/thewawafoundation',
      name: 'Wawa',
      size: 'xl'
    }
  ];

  // Helper function to get size in pixels based on size prop
  const getSizeConfig = (size: string) => {
    const configs = {
      sm: { maxW: '120px', maxH: '100px' },
      md: { maxW: '160px', maxH: '120px' },
      lg: { maxW: '200px', maxH: '140px' },
      xl: { maxW: '280px', maxH: '160px' }
    };
    return configs[size as keyof typeof configs] || configs.md;
  };

  return (
    <Box
      h="100%"
      w="100%"
      bg={pageBg}
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 6 }}
      overflow="auto"
    >
      <Container maxW="1200px">
        <VStack spacing={8} align="center">
          {/* Header Section */}
          <VStack spacing={4} textAlign="center" maxW="800px">
            <Heading
              size="xl"
              color={textColor}
              letterSpacing="tight"
            >
              SUPPORTERS
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={subTextColor}
              lineHeight="1.8"
            >
              We are grateful for the support of our partners and supporters who share our commitment to improving the well-being of Veterans. Together, we work towards building a strong community for Veterans and raising awareness about veteran health issues. Our collaborative efforts enable us to provide comprehensive services to Veterans, ensuring they receive the support they deserve.
            </Text>
          </VStack>

          {/* Supporters Collage */}
          <Box
            bg={cardBg}
            p={{ base: 6, md: 10 }}
            borderRadius="lg"
            shadow="md"
            w="100%"
            maxW="1000px"
            transition="all 0.2s"
            _hover={{ shadow: "lg" }}
          >
            <SimpleGrid
              columns={{ base: 2, md: 3, lg: 4 }}
              spacing={{ base: 6, md: 8 }}
              justifyItems="center"
              alignItems="center"
            >
              {supporters.map((supporter, index) => {
                const sizeConfig = getSizeConfig(supporter.size);
                return (
                  <Link
                    key={index}
                    href={supporter.linkUrl}
                    isExternal
                    _hover={{ transform: 'scale(1.05)', opacity: 0.8 }}
                    transition="all 0.2s"
                  >
                    <Box
                      p={4}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={borderColor}
                      bg={pageBg}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      {...sizeConfig}
                      h="auto"
                    >
                      <Image
                        src={supporter.imageUrl}
                        alt={supporter.name}
                        maxW="100%"
                        maxH="100%"
                        objectFit="contain"
                        loading="lazy"
                      />
                    </Box>
                  </Link>
                );
              })}
            </SimpleGrid>
          </Box>
                    <VStack spacing={4} textAlign="center" maxW="800px">
            <Heading
              size="x0.5"
              color={textColor}
              letterSpacing="tight"
            >
              Special Thanks to the University of Pennsylvania
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={subTextColor}
              lineHeight="1.8"
            >
              We extend our heartfelt gratitude to the University of Pennsylvania for their foundational role in creating our initial application. Their work laid the groundwork for the tools we continue to develop in support of Veterans’ health and well-being. We are deeply appreciative of their early partnership and lasting contribution.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Donators;