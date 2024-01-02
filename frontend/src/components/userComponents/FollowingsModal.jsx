import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Avatar,
  Box,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useSelector } from 'react-redux';
import FollowButton from "./FollowButton";

function FollowingModal({ userDetails }) {
    const { userInfo } = useSelector((state) => state.userAuth);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;


    return (
        <>
            <div ref={btnRef} onClick={() => { onOpen() }} style={{ cursor: 'pointer' }}>
                Following
            </div>

            <Modal onClose={onClose} finalFocusRef={btnRef} isOpen={isOpen} scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Following</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align="start" spacing={4}>
                            {userDetails.following?.length > 0 ? (
                                userDetails.following.map((follower) => (
                                    <Box key={follower._id} display="flex" alignItems="center" justifyContent="space-between" w="100%">
                                        <Box display="flex" alignItems="center">
                                            <Avatar name={follower.name} src={follower.profileImageName ? follower.profileImageName : VITE_PROFILE_IMAGE_DIR_PATH + 'defaultImage.jpeg'} />
                                            <Text ml={4}>{follower.name}</Text>
                                        </Box>
                                        {follower._id !== userInfo.id && (
                                            <FollowButton artistId={follower._id} />
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Text>Not Following Anyone</Text>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default FollowingModal;

