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
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { useFollowedUsersMutation, useFollowArtistMutation, useUnFollowArtistMutation } from '../../slices/userApiSlice';


function FollowingModal({ userDetails }) {
    const { userInfo } = useSelector((state) => state.userAuth);
    const [followedUsers, setFollowedUsers] = useState([]);
    const [followerStates, setFollowerStates] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;

    const [fetchingFollowedUsers] = useFollowedUsersMutation()
    const [followArtist] = useFollowArtistMutation();
    const [unFollowArtist] = useUnFollowArtistMutation();

    useEffect(() => {
        const fetchFollowedUsers = async () => {
            try {
                const response = await fetchingFollowedUsers();
                console.log("following modal fetchFollowedUsers", response);
                const followingIds = response.data.followers.map((follower) => follower._id);

                // Move the followingIds processing here
                const followerIds = userDetails.following?.map((follower) => follower._id);
                if (followerIds) {
                    setFollowedUsers(followerIds);
                    const followerStatesObj = {};

                    // Initialize followerStates based on whether the current user follows each artist or not.
                    followerIds.forEach((id) => {
                        const isCurrentUserFollowing = followingIds?.includes(id);
                        followerStatesObj[id] = {
                        isFollowing: isCurrentUserFollowing,
                        isRequested: response.data.followRequestsSend.some((request) => request._id === id),
                        };
                    });
                    setFollowerStates(followerStatesObj);
                }
            } catch (error) {
                toast.error(error?.data?.message || error?.error);
                console.error('Error fetching followed users:', error);
            }
        };

        fetchFollowedUsers();
    }, [userDetails.following, userInfo, fetchingFollowedUsers]);


    const handleFollow = async (userIdToFollow, follower) => {
        try {
            const artistId = String(userIdToFollow);
            const response = await followArtist(artistId);
            if (response.data.status === 'success') {
                toast.success(`Started Following ${follower.name}`)
                setFollowedUsers([...followedUsers, userIdToFollow]);
                setFollowerStates((prevStates) => ({
                    ...prevStates,
                    [userIdToFollow]: { isFollowing: true, isRequested: false },
                }));
            } else if (response.data.status === 'requested') {
                toast.info('Follow Request sent')
                setFollowerStates((prevStates) => ({
                    ...prevStates,
                    [userIdToFollow]: { isFollowing: false, isRequested: true },
                }));
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
                setFollowerStates((prevStates) => ({
                    ...prevStates,
                    [userIdToUnFollow]: { isFollowing: false, isRequested: false },
                }));
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
                                                onClick={() => (followerStates[follower._id]?.isFollowing ? handleUnFollow(follower._id, follower) : handleFollow(follower._id, follower))}
                                                disabled={followerStates[follower._id]?.isRequested}
                                            >
                                                {followerStates[follower._id]?.isRequested
                                                    ? 'Requested'
                                                    : followerStates[follower._id]?.isFollowing
                                                    ? 'Following'
                                                    : 'Follow'}
                                            </button>
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

