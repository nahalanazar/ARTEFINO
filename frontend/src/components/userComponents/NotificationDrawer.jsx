import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { IoIosNotifications } from 'react-icons/io'
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge'
import { useFetchUserNotificationsMutation, useAcceptRequestMutation, useRejectRequestMutation } from '../../slices/userApiSlice.js';
import { Effect } from "react-notification-badge"


const NotificationDrawer = (userInfo) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [userNotification, setUserNotification] = useState([])
    const [fetchUserNotification] = useFetchUserNotificationsMutation();
    const [acceptRequestMutation] = useAcceptRequestMutation();
    const [rejectREquestMutation] = useRejectRequestMutation();
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH

    useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetchUserNotification();
        console.log("response notif", response);
        setUserNotification(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userInfo) {
      fetchNotifications();
    }
  }, [userInfo]);
  
  const handleAccept = async (artistId, notificationId) => {
    try {
      const response = await acceptRequestMutation(artistId);
      console.log("response accept", response);
      setUserNotification((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error accepting Request', error);
    }
  };

  const handleReject = async (artistId, notificationId) => {
    try {
      const response = await acceptRequestMutation(artistId);
      console.log("response reject", response);
      setUserNotification((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error accepting Request', error);
    }
  };
  
  return (
    <>
      <div style={{ position: 'relative' }}>
          <NotificationBadge
              count={userNotification?.length}
              effect={Effect.SCALE}
              style={{ position: 'absolute'}}
          />
          <IoIosNotifications onClick={onOpen} style={{ fontSize: '34px' }}><NotificationDrawer /></IoIosNotifications>
      </div>
      <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Notifications</DrawerHeader>
            <DrawerBody>
              <div style={{ cursor: 'pointer' }}>
                {userNotification?.map((notification) => (
                  <div key={notification._id}>
                  {notification.type === 'follow_request' && (
                    <>
                      <div
                        className='pt-2'
                        key={notification._id}
                        style={{ display: 'flex', alignItems: 'center' }}
                        onClick={() => {
                          onClose();
                        }}
                      >
                        <img 
                          src={
                          notification.sender.profileImageName
                            ? notification.sender.profileImageName
                            : VITE_PROFILE_IMAGE_DIR_PATH + 'defaultImage.jpeg'
                        }
                          alt='Profile' 
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            marginRight: '15px',
                            objectFit: 'cover',
                          }}
                        />
                        <p>{`You have a new follow request from ${notification.sender.name}`}</p>
                      </div>
                      <div style={{ display: 'flex',justifyContent: 'center' }}>
                        <Button 
                          colorScheme="blue" 
                          size="sm" 
                          style={{ marginRight: '10px' }}
                          onClick={() => {
                            onClose();
                            handleAccept(notification.sender._id, notification._id)
                          }}
                        >
                        Accept
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => {
                            onClose();
                            handleReject(notification.sender._id, notification._id)
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                ))}
              </div>
            </DrawerBody>
          </DrawerContent>
      </Drawer>
    </>
  )
}

export default NotificationDrawer
