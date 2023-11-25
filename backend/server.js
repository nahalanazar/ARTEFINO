// ===================== Importing necessary modules =====================
import express from 'express'
import dotenv from 'dotenv'

// to run the config method
dotenv.config()

import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

// Server port configuration
const port = process.env.PORT || 5000


// Express app configuration
const app = express()


// ===================== Database Configuration =====================
import connectDB from './config/db.js'
connectDB();


// ========================================== Middleware's ==========================================
app.use(express.json()) // to parse raw json
app.use(express.urlencoded({extended: true})) // to send form data
app.use(cookieParser()); // CookieParser Middleware


// ========================================== Serve static files ==========================================
app.use(express.static("./public"));


//? ===================== Application Home Route =====================
app.get('/', (req, res) => res.send('Server is ready'))


//? ===================== Routes Configuration =====================
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)


//? ===================== Error handler middleware configuration =====================
app.use(notFound)
app.use(errorHandler)


//NOTE ===================== Starting Server =====================
app.listen(port, () => console.log(`server started on port ${port}`))