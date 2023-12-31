import { Navbar, Nav, Form, Container, NavDropdown, Image, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaComments } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../slices/userApiSlice.js';
import { logout } from '../../slices/userAuthSlice.js';
import { ChatState } from '../context/ChatProvider.jsx';
import { ChakraProvider } from "@chakra-ui/react"
import NotificationBadge from 'react-notification-badge'
import { Effect } from "react-notification-badge"
import NotificationDrawer from './NotificationDrawer.jsx';
import {lazy, Suspense} from 'react'
const SearchDrawer = lazy(() => import('./SearchDrawer.jsx'))
const Header = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const { notification } = ChatState()
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // const VITE_LOGO_IMAGE_DIR_PATH = import.meta.env.VITE_FAVICON_IMAGE_DIR_PATH

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
                  src= "/favicon.png"
                  alt="ArteFino"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '0%',
                    objectFit: 'cover'
                  }}
                />
              </Navbar.Brand>
            </LinkContainer>
            {userInfo && (
              <Suspense fallback={<div>Loading...</div>}>
                <Form inline="true">
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1"><FaSearch /></InputGroup.Text>
                      <SearchDrawer />
                  </InputGroup>
                </Form>
              </Suspense>
            )}
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto'>
                {userInfo && (
                  <Nav.Item>
                    <Nav.Link>
                      <div style={{ position: 'relative', marginTop: '5px' }}>                          
                        <NotificationDrawer userInfo={userInfo} />
                      </div>
                    </Nav.Link>
                  </Nav.Item> 
                )}
                {userInfo && (
                  <> 
                    <Nav.Item>
                      <LinkContainer to='/sell'>
                        <Nav.Link>
                          <Button variant="warning" style={{ backgroundColor: '#FF6347', color: 'white', borderColor: 'transparent' }}>Sell +</Button>
                        </Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                  </>
                )}
                {userInfo && (
                  <Nav.Item>
                    <LinkContainer to='/chat'>
                      <Nav.Link>
                        <div style={{ position: 'relative', marginTop: '5px' }}>
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
                  <div style={{ position: 'relative', marginTop: '5px' }}>
                    <NavDropdown title={userInfo.name} id='username'>
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </div>
                ) : (
                  <>
                    <LinkContainer to='/login'>
                      <Nav.Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        <span>Sign In</span>
                      </Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='/register'>
                      <Nav.Link>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                        Sign Up
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
