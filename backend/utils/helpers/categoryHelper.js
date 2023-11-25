import Category from "../../models/categoryModel.js";

const fetchAllCategories = async () => {
  try {
    const categories = await Category.find({});
    return categories;
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw error;
  }
};

const addCategory = async (categoryData) => {
  try {
    console.log("addcategory_______")
    const category = new Category(categoryData);
    await category.save();
    return { success: true, message: "Category added successfully." };

  } catch (error) {
    console.error("Error adding category: ", error);
    throw error; 
  }
};

const updateCategory = async (categoryData) => {

  try {
    const category = await Category.findById(categoryData.categoryId);
    if (!category) {
      return { success: false, message: "Category not found." };
    }

    category.name = categoryData.name;
    category.description = categoryData.description;

    await category.save();
    return { success: true, message: "Category updated successfully." };
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

const unListCategory = async (categoryId) => {
  try {
    const unListedCategory = await Category.findByIdAndUpdate(categoryId,{isListed:false});
    
    if (!unListedCategory) {
      return { success: false, message: "Category not found." };
    }
    return { success: true, message: "Category Unlisted successfully." };
  } catch (error) {
    console.error("Error unlisting category:", error);
    throw error;
  }

};

const reListCategory = async (categoryId) => {
  try {
    const unListedCategory = await Category.findByIdAndUpdate(categoryId, {isListed:true});
    
    if (!unListedCategory) {
      return { success: false, message: "Category not found." };
    }
    return { success: true, message: "Category Unlisted successfully." };
  } catch (error) {
    console.error("Error un listing category:", error);
    throw error;
  }

};

export {
  fetchAllCategories,
  addCategory,
  updateCategory,
  unListCategory,
  reListCategory
};
