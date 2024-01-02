import CategoriesTab from '../../components/userComponents/CategoriesTab'
import Posts from '../../components/userComponents/Posts'
import UserProfile from '../../components/userComponents/UserProfile'
import {lazy, Suspense, useState} from 'react'
const ArtistsList = lazy(() => import('../../components/userComponents/ArtistsList'))

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleFollowChange = (artistId, isFollowed) => {
    // Update the user profile or perform any necessary actions
    console.log(`Artist ${artistId} is now ${isFollowed ? 'followed' : 'unfollowed'}`);
  };

  return (
    <>
      <CategoriesTab selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
       <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <UserProfile />
          </div>

          <div className="col-md-6 col-12">
            <Posts selectedCategory={selectedCategory} />
          </div>
 
          <div className="col-md-3 d-none d-md-block">
            <Suspense fallback={<div>Loading...</div>}>
              <ArtistsList onFollowChange={handleFollowChange} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeScreen