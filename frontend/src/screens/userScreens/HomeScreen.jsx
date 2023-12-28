// import Hero from '../../components/userComponents/Hero'
import CategoriesTab from '../../components/userComponents/CategoriesTab'
import Posts from '../../components/userComponents/Posts'
import UserProfile from '../../components/userComponents/UserProfile'
import {lazy, Suspense, useState} from 'react'
// import ArtistsList from '../../components/userComponents/ArtistsList'
const ArtistsList = lazy(() => import('../../components/userComponents/ArtistsList'))

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  return (
    <>
      <CategoriesTab selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
      {/* <Hero /> */}
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
              <ArtistsList />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeScreen