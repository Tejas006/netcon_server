const express = require("express")
const cors = require("cors") // cors = cross-origin resource sharing. It allows us to relax the security applied to an API
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes")
const messagesRoutes = require("./routes/messagesRoutes")
const socket = require("socket.io")
const app = express()
require("dotenv").config()

app.use(cors())
app.use(express.json())

app.use("/api/auth", userRoutes)
app.use("/api/messages", messagesRoutes)


mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("DB Connection Successfull") 
}).catch((err)=>{
    console.log(err.message)
})
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`)
})


const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})

global.onlineUsers = new Map()



io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})