import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Report from '../models/reportModel.js';
import cloudinary from '../utils/cloudinary.js'


// desc   Create a Product
// route  GET /api/users/userPosts/:userId
// access Private
const createProduct = asyncHandler(async (req, res) => {
    const { title, description, categoryId, accessLatitude, accessLongitude, address } = req.body;
    let images = [...req.body.images]
    let imagesBuffer = []

    for (let i = 0; i < images.length; i++){
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "Products",
            width: 1920,
            crop: "scale"
        })
        imagesBuffer.push({
            public_id: result.public_id,
            url: result.url
        })
    }

    const newProduct = new Product({
        title,
        description, 
        category: categoryId,
        images: imagesBuffer,
        stores: req.user._id,
        latitude: accessLatitude,
        longitude: accessLongitude,
        address
    });
 
    const createdProduct = await newProduct.save();

    if (createProduct) {
        res.status(200).json({success: true, message: 'Product added successfully', postId: createdProduct._id });
    } else {
        res.status(404);
        throw new Error("Product is not created");
    }

});

// desc   Show all posts in home
// route  GET /api/users/showPosts
// access Private
const showPosts = asyncHandler(async (req, res) => {
    try {
        const currentUser = req.user;
        const { category, offset } = req.query;
        const limit = 2      
        const pipeline = [
            {
                $match: {
                    isRemoved: false,
                    ...(category && category !== 'null' &&
                    {
                        $expr: {
                        $eq: ['$category', { $convert: { input: category, to: 'objectId' } }]
                    }})
                    
                }
            }, 
            {
                $lookup: {
                    from: 'users',
                    localField: 'stores', 
                    foreignField: '_id',
                    as: 'stores'
                }
            },
            {
                $match: {
                    $or: [
                        { 'stores.isPrivate': false, 'stores.is_blocked': false },
                        {
                            'stores.isPrivate': true,
                            'stores._id': {
                                $in: currentUser.following
                            }
                        },
                        { 'stores._id': currentUser._id }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                from: 'users',
                localField: 'comments.user',  
                foreignField: '_id',
                as: 'commentUsers'  
                }
            },
            {
                $sort: {
                    dateListed: -1
                }
            },
            {
                $skip: parseInt(offset) || 0
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    images: 1,
                    category: {
                        $cond: {
                            if: { $isArray: "$category" },
                            then: {
                                _id: { $arrayElemAt: ["$category._id", 0] },
                                name: { $arrayElemAt: ["$category.name", 0] },
                                description: { $arrayElemAt: ["$category.description", 0] }
                            },
                            else: {
                                _id: "$category",  
                                name: "$category", 
                                description: null
                            }
                        }
                    },
                    stores: {
                        $cond: {
                            if: { $isArray: "$stores" },
                            then: {
                                _id: { $arrayElemAt: ["$stores._id", 0] },
                                name: { $arrayElemAt: ["$stores.name", 0] },
                                profileImageName: { $arrayElemAt: ["$stores.profileImageName", 0] }
                            },
                            else: null
                        }
                    },
                    latitude: 1,
                    longitude: 1,
                    address: 1,
                    dateListed: 1,
                    likes: 1,
                    comments: {
                        $map: {
                        input: "$comments",
                        as: "comment",
                        in: {
                            _id: "$$comment._id",
                            text: "$$comment.text",
                            date: "$$comment.date",
                            user: {
                            $arrayElemAt: ["$commentUsers", { $indexOfArray: ["$commentUsers._id", "$$comment.user"] }]  // Extract matching user details
                            }
                        }
                        }
                    },
                    reports: 1,
                    isRemoved: 1
                }
            }
        ];

        const products = await Product.aggregate(pipeline);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching and aggregating products:', error);
        res.status(500).json({ error: 'Failed to fetch and aggregate products' });
    }
});


// desc   Show all posts in landing home
// route  GET /api/users/showPosts
// access Public
const showLandingPosts = asyncHandler(async (req, res) => {
    try {
        const { category, offset } = req.query; 
        const limit = 2
        const pipeline = [ 
            {
                $match: {
                    isRemoved: false,
                    ...(category && category !== 'null' &&
                    {
                        $expr: {
                        $eq: ['$category', { $convert: { input: category, to: 'objectId' } }]
                    }})
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'stores',
                    foreignField: '_id',
                    as: 'stores'
                }
            },
            {
                $match: {
                    'stores.isPrivate': false, 'stores.is_blocked': false 
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $sort: {
                    dateListed: -1
                }
            },
            {
                $skip: parseInt(offset) || 0
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    images: 1,
                    category: {
                        $cond: {
                            if: { $isArray: "$category" },
                            then: {
                                _id: { $arrayElemAt: ["$category._id", 0] },
                                name: { $arrayElemAt: ["$category.name", 0] },
                                description: { $arrayElemAt: ["$category.description", 0] }
                            },
                            else: {
                                _id: "$category",
                                name: "$category",
                                description: null
                            }
                        }
                    },
                    stores: {
                        $cond: {
                            if: { $isArray: "$stores" },
                            then: {
                                _id: { $arrayElemAt: ["$stores._id", 0] },
                                name: { $arrayElemAt: ["$stores.name", 0] },
                                profileImageName: { $arrayElemAt: ["$stores.profileImageName", 0] }
                            },
                            else: null
                        }
                    },
                    latitude: 1,
                    longitude: 1,
                    address: 1,
                    dateListed: 1,
                    likes: 1,
                    comments: 1,
                    reports: 1,
                    isRemoved: 1
                }
            }
        ];

        const posts = await Product.aggregate(pipeline);

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching and aggregating landing posts:', error);
        res.status(500).json({ error: 'Failed to fetch and aggregate landing posts' });
    }
});


// desc   Show single posts details
// route  GET /api/users/postDetails/:postId
// access Private
const postDetails = asyncHandler(async (req, res) => {
    const postId = req.params.postId
    const post = await Product.findById(postId).populate('category stores reports').exec()
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
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

// desc    Remove a Post
// route   DELETE /api/users/removePost/:postId
// access  Private
const removePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const post = await Product.findById(postId);

    if (!post) {
        res.status(404);
        throw new Error("Requested Post not found.");
    }

    await Product.deleteOne({ _id: postId });
    res.status(200).json({ status: 'success', message: 'Removed Post successfully' });
})

// desc   update post
// route  POST /api/users/updatePost/:postId
// access Private
const updatePost = asyncHandler(async (req, res) => {

    const post = await Product.findById(req.params.postId);

    if (post) {
        post.title = req.body.title || post.title;
        post.description = req.body.description || post.description;
        post.category = req.body.category || post.category;
        post.latitude = req.body.latitude || post.latitude;
        post.longitude = req.body.longitude || post.longitude;
        post.address = req.body.address || post.address;

        let images = [...req.body.images];
        let imagesBuffer = [];

        for (let i = 0; i < images.length; i++) {
            if (images[i].isNew) {
                // Handle newly added images
                const result = await cloudinary.uploader.upload(images[i].url, {
                    folder: "Products",
                    width: 1920,
                    crop: "scale",
                });
                imagesBuffer.push({
                    public_id: result.public_id,
                    url: result.url,
                });
            } else {
                // Use existing Cloudinary images
                imagesBuffer.push({
                    public_id: images[i].public_id,
                    url: images[i].url,
                });
            }
        }

        post.images = imagesBuffer;

        const updatedPost = await post.save();
        res.status(200).json({ status: 'success', message: "Post updated", postId: updatedPost._id });
    } else {
        res.status(404);
        throw new Error("Requested Post not found.");
    }
});

// desc   add like to the Post
// route  POST /api/users/likePost/:postId
// access Private
const likePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const post = await Product.findById(postId)

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    post.likes.push(userId)
    await post.save()

    res.status(200).json({ message: 'Like added successfully', likes: post.likes })
})

// desc   remove like to the Post
// route  DELETE /api/users/unlikePost/:postId
// access Private
const unlikePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const post = await Product.findById(postId)

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const indexOfUser = post.likes.indexOf(userId);
    if (indexOfUser === -1) {
        return res.status(400).json({ message: 'User has not liked the post' });
    }

    // Remove the user from the likes array
    post.likes.splice(indexOfUser, 1);
    await post.save();

    res.status(200).json({ message: 'Like removed successfully', likes: post.likes });
})

// desc   fetch liked users
// route  POST /api/users/likedUsers/:postId
// access Private
const fetchLikedUsers = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const post = await Product.findById(postId).populate('likes');

    if (!post) {
        res.status(404);
        throw new Error('Liked post not found');
    }
    const likedUsers = post.likes;
    const likedUsersDetails = await User.find({ _id: { $in: likedUsers } }, 'name profileImageName');
    res.status(200).json(likedUsersDetails)
})

// desc   add comment to the Post
// route  POST /api/users/commentPost/:postId
// access Private
const commentPost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const text = req.body.text;
    const post = await Product.findById(postId)

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(userId).select('name profileImageName');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const newComment = {
        user: user,
        text,
        date: new Date()
    }

    post.comments.push(newComment);
    await post.save();
    // Fetch the newly added comment from the post object
    const addedComment = post.comments[post.comments.length - 1];

    res.status(200).json({ message: 'Comment added successfully', comment: addedComment });
});

// desc   add comment to the Post
// route  DELETE /api/users/commentDelete/:postId
// access Private
const commentDelete = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.body.commentId;
    const result = await Product.updateOne(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
    );
    if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// desc   Report Post
// route  POST /api/users/reportPost/:postId
// access Private
const reportPost = asyncHandler(async (req, res) => {
    const { postId, data } = req.body;
    const { reason, description } = data || {};

    const reporter = req.user._id;
    const post = await Product.findById(postId)

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const newReport = new Report({
      reporter,
      reportedPost: postId,
      reason,
      description
    });

    await newReport.save();

    post.reports.push(newReport);
    await post.save();

    res.status(201).json({ message: 'Report submitted successfully' })
})


export {
    createProduct,
    showLandingPosts,
    showPosts,
    postDetails,
    getUserPosts,
    removePost,
    updatePost,
    likePost,
    unlikePost,
    fetchLikedUsers,
    commentPost,
    commentDelete,
    reportPost
}
