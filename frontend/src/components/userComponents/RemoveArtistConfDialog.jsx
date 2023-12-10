import { Box, Text, Button } from '@chakra-ui/react';

function ConfirmationDialog({ onConfirm, onCancel, followerName }) {
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      backgroundColor="white"
      padding="16px"
      borderRadius="8px"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
      zIndex="2000"
    >
      <Text>Are you sure you want to remove {followerName}?</Text>
      <Button onClick={onConfirm}>Yes, remove</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </Box>
  );
}

export default ConfirmationDialog;
