import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';

const Hero = () => {
  const { adminInfo } = useSelector( (state) => state.adminAuth);

  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>

          { adminInfo ? 
            <>
              <h2 className='text-center mb-4'> Welcome {adminInfo.name} </h2>
              <p className='text-center mb-4'> Email: {adminInfo.email} </p>
              <div className='d-flex'>
                <LinkContainer to='/admin/manage-users'>
                    <Button variant='primary' className='me-3'>
                    User Management
                    </Button>
                </LinkContainer>
              </div>
            </>
            : 
            <>
              <h2 className='text-center mb-4'> ArteFino Admin  </h2>
              <p className='text-center mb-4'> Please Login to access Dashboard </p>
              <div className='d-flex'>
                <LinkContainer to='/admin/login'>
                    <Button variant='primary' className='me-3'>
                    Login
                    </Button>
                </LinkContainer>
              </div>
            </> 
          }

        </Card>
      </Container>
    </div>
  );
};

export default Hero;