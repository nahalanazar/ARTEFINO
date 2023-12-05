import { Navbar, Nav, Form, Container, NavDropdown, Image, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaSignInAlt, FaSignOutAlt, FaComments } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../slices/userApiSlice.js';
import { logout } from '../../slices/userAuthSlice.js';
import { ChatState } from '../context/ChatProvider.jsx';
import { ChakraProvider } from "@chakra-ui/react"
import NotificationBadge from 'react-notification-badge'
import { Effect } from "react-notification-badge"

const Header = () => {
  const {notification, setNotification} = ChatState()
  const { userInfo } = useSelector((state) => state.userAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();


  const VITE_LOGO_IMAGE_DIR_PATH = import.meta.env.VITE_LOGO_IMAGE_DIR_PATH

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ChakraProvider>
      <header>
        <Navbar className='header-bg' variant='dark' expand='lg' collapseOnSelect>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>
                <Image
                  src= {VITE_LOGO_IMAGE_DIR_PATH}
                  alt="ArteFino"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </Navbar.Brand>
            </LinkContainer>
            {userInfo && (
              <Form inline="true">
              <InputGroup>
                <InputGroup.Text id="basic-addon1"><FaSearch /></InputGroup.Text>
                <Form.Control
                  style={{ width: "300px" }}
                  placeholder="Search..."
                  aria-label="Search"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
            </Form>
            )}
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto'>
                {userInfo && (
                  <Nav.Item>
                    <LinkContainer to='/sell'>
                      <Nav.Link>
                        <Button variant="warning" style={{ backgroundColor: '#FF6347', color: 'white', borderColor: 'transparent' }}>Sell +</Button>
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                )}
                {userInfo && (
                  <Nav.Item>
                    <LinkContainer to='/chat'>
                      <Nav.Link>
                        <div style={{ position: 'relative' }}>
                          <NotificationBadge
                            count={notification?.length}
                            effect={Effect.SCALE}
                            style={{ position: 'absolute', top: 0, right: 0 }}
                          />
                          <FaComments style={{fontSize: '34px'}} />
                        </div>
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item> 
                )}
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <>
                    <LinkContainer to='/login'>
                      <Nav.Link>
                        <FaSignInAlt /> Sign In
                      </Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='/register'>
                      <Nav.Link>
                        <FaSignOutAlt /> Sign Up
                      </Nav.Link>
                    </LinkContainer>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </ChakraProvider>
  );
};

export default Header;
