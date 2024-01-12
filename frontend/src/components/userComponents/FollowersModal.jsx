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
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRemoveArtistMutation } from "../../slices/userApiSlice";
import ConfirmationDialog from "./RemoveArtistConfDialog";
import { useSelector } from "react-redux";
import FollowButton from "./FollowButton";
function FollowModal({ userDetails, isOwnProfile, onUpdateFollowersCount, fetchUserDetails }) {
  const { userInfo } = useSelector((state) => state.userAuth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
  const [confirmation, setConfirmation] = useState(false);
  const [followerToRemove, setFollowerToRemove] = useState(null);

  const [removeArtist] = useRemoveArtistMutation();
  
  const handleRemove = async (follower) => {
    setFollowerToRemove(follower);
    setConfirmation(true);
  };

  const handleConfirmation = async () => {
    try {
      const artistId = String(followerToRemove._id);
      const response = await removeArtist(artistId);
      if (response.data.status === "success") {
        toast.warning(`Removed ${followerToRemove.name}`);
        onUpdateFollowersCount(followerToRemove._id);
        // fetchUserDetails();
      } else {
        console.error("Error Removing artist:", response);
        toast.error("Failed to Remove artist");
      }
    } catch (err) {
        console.error("Error Removing user:", err);
        toast.error(err?.data?.message || err?.error);
    } finally {
        setConfirmation(false);
        setFollowerToRemove(null);
    }
  };

  const handleCancelConfirmation = () => {
    setConfirmation(false);
    setFollowerToRemove(null);
  };


  return (
    <>
      <div ref={btnRef} onClick={() => onOpen()} style={{ cursor: "pointer" }}>
        Followers
      </div>

      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Followers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4}>
              {userDetails.followers?.length > 0 ? (
                userDetails.followers.map((follower) => (
                  <Box
                    key={follower._id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    w="100%"
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        name={follower.name}
                        src={follower.profileImageName ? follower.profileImageName : VITE_PROFILE_IMAGE_DIR_PATH}
                      />
                      <Text ml={4}>{follower.name}</Text>
                    </Box>
                    {isOwnProfile ? (
                      <Button
                        colorScheme="red"
                        onClick={() => handleRemove(follower)}
                      >
                        Remove
                      </Button>
                    ) : (
                      follower._id !== userInfo.id && (
                        <FollowButton artistId={follower._id} fetchUserDetails={fetchUserDetails} />
                      )
                    )}
                  </Box>
                ))
              ) : (
                <Text>No Followers</Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            {!confirmation && <Button onClick={onClose}>Close</Button>}
          </ModalFooter>
        </ModalContent>
      </Modal>
      {confirmation && (
        <ConfirmationDialog
          onConfirm={handleConfirmation}
          onCancel={handleCancelConfirmation}
          followerName={followerToRemove?.name}
        />
      )}
    </>
  );
}

export default FollowModal;
