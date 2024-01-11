import asyncHandler from 'express-async-handler'
import categoryModel from '../models/categoryModel.js'
import {
    fetchAllCategories,
    addCategory,
    updateCategory,
    unListCategory,
    reListCategory
} from '../utils/helpers/categoryHelper.js';

// desc    GET all categories
// route   GET /api/admin/getCategories
// access  PRIVATE
const getAllCategories = asyncHandler(async (req, res) => {
    const categoryData = await fetchAllCategories();
    if(categoryData){
        res.status(200).json({ categoryData });
    }else{
        res.status(404);
        throw new Error("Categories data fetch failed.");
    }
});

// desc    create categories
// route   POST /api/admin/addCategory
// access  PRIVATE
const addCategoryData = asyncHandler( async (req, res) => {
    try {
        const name = req.body.name.toLowerCase()
        const existingCategory = await categoryModel.findOne({ name: name })

        if(existingCategory){
            throw new Error("Category already exists");
        } 

        const { description = '' } = req.body;

        if(!name || !description || name.trim().length === 0) {
            throw new Error("Name and description are required for category creation.");
        }

        const categoryData = { name, description };
        const result = await addCategory(categoryData);
        if (result) {
            res.status(201).json({result});
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(400).json({"success" :false, "message" : error.message});
    }
});

// desc    update category
// route   PUT /api/admin/updateCategory
// access  PRIVATE
const updateCategoryData = asyncHandler( async (req, res) => {

    const categoryId = req.body.categoryId;
    const name = req.body.name.toLowerCase();
    const description = req.body.description;

    if(!categoryId){
        res.status(404);;
        throw new Error("categoryId not received in request. Category update failed.");
    }

    if(!name || !description || name.trim().length === 0) {
        res.status(400);
        throw new Error("Name and description are required for updating category.");
    }

    const existingCategory = await categoryModel.findOne({ name: name, _id: { $ne: categoryId } })

        if(existingCategory){
            throw new Error("Category already exists");
        }
    
    const categoryData = {categoryId: categoryId, name: name, description: description};
    const result = await updateCategory(categoryData);

    if(result){
        const response = result;
        res.status(200).json({ response });
    }else{
        res.status(404);;
        throw new Error("User update failed.");
    }
});

// desc    UN LIST category
// route   PUT /api/admin/unListCategory
// access  PRIVATE
const unListCategoryData = asyncHandler( async (req, res) => {
    const categoryId = req.body.categoryId;
    const categoryListStatus = await unListCategory(categoryId);
    if(categoryListStatus.success){
        const response = categoryListStatus.message;
        res.status(200).json({ message:response });
    }else{
        res.status(404);
        const response = categoryListStatus.message;
        throw new Error(response);
    }
});

// desc    LIST category
// route   PUT /api/admin/reListCategory
// access  PRIVATE
const reListCategoryData = asyncHandler( async (req, res) => {
    const categoryId = req.body.categoryId;
    const categoryListStatus = await reListCategory(categoryId);
    if(categoryListStatus.success){
        const response = categoryListStatus.message;
        res.status(200).json({ message:response });
    }else{
        res.status(404);
        const response = categoryListStatus.message;
        throw new Error(response);
    }
});

export {
    getAllCategories,
    addCategoryData,
    updateCategoryData,
    unListCategoryData,
    reListCategoryData
}
