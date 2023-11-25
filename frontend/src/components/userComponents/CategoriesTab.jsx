import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { useGetCategoriesMutation } from '../../slices/userApiSlice'

const CategoriesTab = () => {
    const [categories, setCategories] = useState([]);
    const [getCategories] = useGetCategoriesMutation()
    const [selectedCategory, setSelectedCategory] = useState(null);


    useEffect(() => {
    // Fetch categories from your API endpoint
    const fetchCategories = async () => {
        try {
            const response = await getCategories() // 'unwrap' to unwrap the returned promise
            const categoryData = response.data.categoryData
            const listedCategories = categoryData.filter((category) => category.isListed);
            setCategories(listedCategories.map(category => category.name)); 
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
                // href={`/${category.toLowerCase()}`}
                style={{
                    textTransform: 'uppercase',
                    color: 'white',
                    fontWeight: category === selectedCategory ? 'bold' : 'normal',
                }}
                active={category === selectedCategory}
                  onClick={() => {
                    setSelectedCategory(category)
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
