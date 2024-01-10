import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box, Avatar, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react'; 
import { useLikedUsersMutation } from '../../slices/userApiSlice';

const LikedUsersModal = ({ postId, onClose }) => {
    const [likedUsers, setLikedUsers] = useState([]);
    const [usersLiked] = useLikedUsersMutation();
    
    useEffect(() => {
        const fetchLikedUsers = async () => {
            try {
                if (postId !== null) {
                    const response = await usersLiked(postId);
                    setLikedUsers(response.data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchLikedUsers();
    }, [postId, usersLiked]);

    return (
        <Modal isOpen={postId !== null} onClose={onClose} size="sm">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Liked Users</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {likedUsers.length > 0 ? (
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                            {likedUsers.map((user) => (
                                <Box key={user._id} textAlign="left" m="2" style={{ display: "flex", alignItems: "center" }}>
                                    <Avatar name={user.name} src={user.profileImageName} size="md" mb="2" />
                                    <Text ml="2">{user.name}</Text>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Text>No liked users yet.</Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LikedUsersModal;
