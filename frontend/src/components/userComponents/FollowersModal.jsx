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
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useFollowedUsersMutation, useRemoveArtistMutation, useFollowArtistMutation, useUnFollowArtistMutation } from "../../slices/userApiSlice";
import ConfirmationDialog from "./RemoveArtistConfDialog";
import { useSelector } from "react-redux";

function FollowModal({ userDetails, isOwnProfile }) {
  const { userInfo } = useSelector((state) => state.userAuth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
  const [confirmation, setConfirmation] = useState(false);
  const [followerToRemove, setFollowerToRemove] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followerStates, setFollowerStates] = useState({});
  
  const [fetchingFollowedUsers] = useFollowedUsersMutation()
  const [removeArtist] = useRemoveArtistMutation();
  const [followArtist] = useFollowArtistMutation();
  const [unFollowArtist] = useUnFollowArtistMutation();

    useEffect(() => {
      const fetchFollowedUsers = async () => {
        try {
          const response = await fetchingFollowedUsers();
          console.log("response fetchingFollowedUsers followersMod:", response);
            const followingIds = response.data.followers.map((follower) => follower._id);

            // Move the followingIds processing here
            const followerIds = userDetails.followers?.map((follower) => follower._id);
            if (followerIds) {
                setFollowedUsers(followerIds);
                const followerStatesObj = {};

                // Initialize followerStates based on whether the current user follows each artist or not.
                followerIds.forEach((id) => {
                    // Check if the current user follows this artist (id).
                    const isCurrentUserFollowing = followingIds?.includes(id);

                    // Set the following state accordingly.
                    followerStatesObj[id] = isCurrentUserFollowing;
                });
                setFollowerStates(followerStatesObj);
            }
        } catch (error) {
            toast.error(error?.data?.message || error?.error);
            console.error('Error fetching followed users:', error);
        }
      };

      fetchFollowedUsers();
    }, [userDetails.followers, userInfo, fetchingFollowedUsers]);
  
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

  const handleFollow = async (userIdToFollow, follower) => {
    try {
        const artistId = String(userIdToFollow);
        const response = await followArtist(artistId);
        console.log("followersModal: ", response);
        if (response.data.status === 'success') {
            toast.success(`Started Following ${follower.name}`)
            console.log(follower.name);
            setFollowedUsers([...followedUsers, userIdToFollow]);
            setFollowerStates((prevStates) => ({ ...prevStates, [userIdToFollow]: true }));
        } else {
            console.error('Error following user:', response);
            toast.error("Failed to follow artist");
        }
    } catch (err) {
        console.error('Error following user:', err);
        toast.error(err?.data?.message || err?.error);
    }
  };

  const handleUnFollow = async (userIdToUnFollow, follower) => {
      try {
          const artistId = String(userIdToUnFollow);
          const response = await unFollowArtist(artistId);

          if (response.data.status === 'success') {
              toast.warning(`Un Followed ${follower.name}`);
              setFollowedUsers((prevFollowedUsers) => prevFollowedUsers.filter((id) => id !== userIdToUnFollow));
              setFollowerStates((prevStates) => ({ ...prevStates, [userIdToUnFollow]: false }));
          } else {
              console.error('Error un Following user:', response);
              toast.error("Failed to un Follow artist");
          }
      } catch (err) {
          console.error('Error un Following user:', err);
          toast.error(err?.data?.message || err?.error);
      }
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
                        src={
                          VITE_PROFILE_IMAGE_DIR_PATH +
                          follower.profileImageName
                        }
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
                        <button
                          className="followButton"
                          style={{
                            color: followerStates[follower._id] ? "black" : "white",
                            backgroundColor: followerStates[follower._id] ? "#CCCCCC" : "#007BFF",
                            fontSize: 16,
                            fontFamily: 'Roboto',
                            fontWeight: '700',
                            padding: '8px 16px',
                            marginRight: '10px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          onClick={() => (followerStates[follower._id] ? handleUnFollow(follower._id, follower) : handleFollow(follower._id, follower))}
                        >
                          {followerStates[follower._id] ? 'Following' : 'Follow'}
                        </button>
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
