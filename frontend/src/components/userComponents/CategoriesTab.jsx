import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { useGetCategoriesMutation } from '../../slices/userApiSlice';

const CategoriesTab = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [getCategories] = useGetCategoriesMutation();
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(); // 'unwrap' to unwrap the returned promise
        const fetchedCategoryData = response.data.categoryData;
        const listedCategories = ['ALL', ...fetchedCategoryData.filter((category) => category.isListed).map(category => category.name)];
        setCategories(listedCategories);
        setCategoryData(fetchedCategoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Nav className="justify-content-center category-bg" activeKey="/home">
      {categories.map((category) => (
        <Nav.Item key={category}>
          <Nav.Link
            style={{
              textTransform: 'uppercase',
              color: 'white',
              fontWeight: category === selectedCategory.name ? 'bold' : 'normal',
            }}
            onClick={() => {
              const selectedCategoryObject = categoryData.find((cat) => cat.name === category);
              const selectedCategoryId = selectedCategoryObject ? selectedCategoryObject._id : null;
              onCategorySelect({ name: category, _id: selectedCategoryId });
            }}
          >
            {category}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default CategoriesTab;
