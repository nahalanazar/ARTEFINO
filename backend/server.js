// ===================== Importing necessary modules =====================
import express from 'express'
import dotenv from 'dotenv'

// to run the config method
dotenv.config()

import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import path from 'path'
// Server port configuration
const port = process.env.PORT || 5000


// Express app configuration
const app = express()


// ===================== Database Configuration =====================
import connectDB from './config/db.js'
connectDB();


// ========================================== Middleware's ==========================================
// app.use(express.json()) // to parse raw json
// app.use(express.urlencoded({extended: true})) // to send form data
app.use(cookieParser()); // CookieParser Middleware

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// ========================================== Serve static files ==========================================
app.use(express.static("./public"));


//? ===================== Application Home Route =====================


//? ===================== Routes Configuration =====================
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)

if(process.env.NODE_ENV==='production'){
    const __dirname= path.resolve() 
    app.use(express.static(path.join(__dirname,'../frontend/dist')))
    
    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'..','frontend','dist','index.html')))
}else{
    
    //? ===================== Application Home Route =====================
    app.get('/', (req, res) => res.send('Server is ready'))

}

//? ===================== Error handler middleware configuration =====================
app.use(notFound)
app.use(errorHandler)


//NOTE ===================== Starting Server =====================
const server = app.listen(port, () => console.log(`server started on port ${port}`))

import { storeNotification } from './controllers/notificationController.js';
import User from './models/userModel.js';

import("socket.io").then((socketIO) => {
    const io = new socketIO.Server(server, {
        pingTimeout: 60000,  // amount of time it will wait while being inactive. So after one minute of inactivity(not send any message), it will close the connection to save the bandwidth
        cors: {
            origin: "https://www.nahalasm.shop"
        }
    });
    
    // Your socket.io configuration and event handling can go here
    io.on("connection", (socket) => {
        console.log("connected to socket.io")
        let userInfo;

        socket.on("setup", async (user) => {
            // console.log("User set up:", user);
            userInfo = { ...user, online: true } // Include online status
            socket.join(userInfo.id)
            socket.emit("connected")
            // Emit online status to all clients
            // socket.emit("userStatus", { userId: userInfo.id, online: true, lastSeen: new Date()  });
            io.to(user.id).emit("userStatus", { userId: user.id, online: true, lastSeen: new Date() });
        })

        // Joining a chat by taking chat room id from frontend
        socket.on("join chat", (room) => {
            socket.join(room)
            console.log("User joined Room: " + room)
        })

        socket.on("typing", (room) => socket.in(room).emit("typing"))
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

        socket.on("new Message", async (newMessageReceived) => {
            let chat = newMessageReceived.chat;
            
            if (!chat.users) return console.log("chat.users not defined");

            // Iterate through users in the chat
            for (const user of chat.users) {
                if (user._id == newMessageReceived.sender._id) continue;

                // Check if the user is online (connected to the socket)
                const isUserOnline = io.sockets.adapter.rooms.has(user._id);

                // If the user is not online, emit real-time message and store notification
                if (!isUserOnline) {
                    console.log("not online");
                    socket.in(user._id).emit("message received", newMessageReceived);

                    // Store notification in the database
                    await storeNotification(user._id, newMessageReceived);
                } else {
                    // The user is online, only emit real-time message
                    socket.in(user._id).emit("message received", newMessageReceived);
                }
            }
        });


        socket.off("setup", () => {
            console.log("User Disconnected");
            if (userInfo) {
                socket.leave(userInfo.id);
                io.emit('userStatus', { userId: userInfo.id, online: false, lastSeen: new Date() });
                userInfo = null;  // Reset userInfo on disconnection
            }
        })

        socket.on("disconnect", async () => {
            console.log("User disconnected");
            if (userInfo) {
                await User.updateOne({ _id: userInfo.id }, { online: false, lastSeen: new Date() });
                io.to(userInfo.id).emit('userStatus', { userId: userInfo.id, online: false, lastSeen: new Date() });
                socket.leave(userInfo.id);
                userInfo = null;  // Reset userInfo on disconnection
            }
        });



    })
}).catch((error) => {
    console.error("Error importing socket.io:", error);
});

