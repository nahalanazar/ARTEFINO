import { Box, Text, Flex, Image, ChakraProvider } from '@chakra-ui/react';

const ErrorPage = () => {
  return (
    <ChakraProvider>
      <Flex
        align="center"
        justify="center"
        direction="column"
        h="100vh"
        bgGradient="linear(to-l, #3498db, #7928CA, #FF0080, #e74c3c)"
        color="white"
      >
        <Box textAlign="center">
          <Image
            src="https://cdn.svgator.com/images/2022/01/404-page-animation-example.gif"
            alt="Artistic Error"
            boxSize="300px" 
            mb="2"
            mx="auto" 
          />
          <Text fontSize="3xl" fontWeight="bold" mb="3">
            Oops! Something went wrong.
          </Text>
          <Text fontSize="lg" mb="2">
            The page you are looking for may be in another masterpiece.
          </Text>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default ErrorPage;



      {/* bgGradient="linear(to-l, #7928CA, #FF0080)" */}
