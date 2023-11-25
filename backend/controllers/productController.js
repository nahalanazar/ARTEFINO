import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types;

// desc   Create a Product
// route  GET /api/users/userPosts/:userId
// access Private
const createProduct = asyncHandler(async (req, res) => {
 
console.log('Request Body:', req.body);
    const { title, description, category, latitude, longitude, address } = req.body;
    const images = req.files.map((file) => file.filename);

    let categoryId;
    try {
        categoryId = new ObjectId(category);
    } catch (error) {
        console.error('Invalid category ObjectId:', error);
        return res.status(400).json({ success: false, message: 'Invalid category ObjectId' });
    }

    // Create a new product
    const newProduct = new Product({
        title,
        description,
        category: categoryId,
        images,
        stores: req.user._id,
        latitude,
        longitude,
        address
    });
 
    // Save the product to the database
    const createdProduct = await newProduct.save();
    console.log("createdProduct",createdProduct)


    if (createProduct) {
        res.status(200).json({success: true, message: 'Product added successfully' });
    } else {
        res.status(404);
        throw new Error("Product is not created");
    }

});

// desc   Show all posts in home
// route  GET /api/users/showPosts
// access Private
const showPosts = asyncHandler(async (req, res) => {
    const posts = await Product.find().populate('category stores').exec()
    res.status(200).json(posts)
})

// desc   Show single posts details
// route  GET /api/users/postDetails/:postId
// access Private
const postDetails = asyncHandler(async (req, res) => {
    const postId = req.params.postId
    const post = await Product.findById(postId).populate('category stores').exec()
    res.status(200).json(post)
})

// desc   Get User's Posts inProfile Page 
// route  GET /api/users/userPosts/:userId
// access Private
const getUserPosts = asyncHandler(async (req, res) => {
    const id = req.params.userId
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    const userPosts = await Product.find({ stores: id });
    res.status(200).json({userPosts});
});

export {
    createProduct,
    showPosts,
    postDetails,
    getUserPosts
}
