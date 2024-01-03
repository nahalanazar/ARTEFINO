import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap'
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useGetUsersDataMutation } from "../../slices/userApiSlice";
import { useNavigate } from 'react-router-dom';

const SearchDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()
    const [usersData, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { userInfo } = useSelector((state) => state.userAuth);

    const navigate = useNavigate()
    
    const [usersDataFromAPI] = useGetUsersDataMutation();

    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const responseFromApiCall = await usersDataFromAPI();
            const usersArray = responseFromApiCall.data.usersData;
            console.log('usersArray', usersArray);
            setUsersData(usersArray);
        } catch (error) {
            toast.error(error);
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = usersData.filter(
        (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      <Button
        ref={btnRef}
        style={{
          width: '200px',
          backgroundColor: 'white',
          textAlign: 'left',
          color: 'black',
          border: 'none',
        }}
        colorscheme='teal'
        onClick={() => {
          fetchData();
          onOpen();
        }}
      >
        Search...
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Artist</DrawerHeader>

          <DrawerBody>
            <Input
              placeholder='Type here...'
              value={searchQuery}
              onChange={handleSearch}
            />
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {searchQuery && filteredUsers.length > 0 ? (
                  <div style={{ cursor: 'pointer' }}>
                    {filteredUsers.map((user) => (
                      <div
                        className='p-2'
                        key={user._id}
                        style={{ display: 'flex', alignItems: 'center' }}
                        onClick={() => {
                          onClose();
                          setSearchQuery('');
                          userInfo.id === user._id
                            ? navigate('/profile')
                            : navigate(`/profile/${user._id}`);
                        }}
                      >
                        <img
                          src={
                            user.profileImageName
                              ? user.profileImageName
                              : `${VITE_PROFILE_IMAGE_DIR_PATH}defaultImage.jpeg`
                          }
                          alt={user.name}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            marginRight: '10px',
                            objectFit: 'cover',
                          }}
                        />
                        <p style={{ marginBottom: '0' }}>{user.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SearchDrawer
