require('dotenv').config();
const express = require('express');
const cors = require('cors');
const orderRoutes = require("./routes/orderRoutes");
const { Server } = require("socket.io");
const http = require("http");
const loginRoutes = require('./routes/loginRoutes');
const { default: mongoose } = require('mongoose');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

app.use(express.json());

app.set("io", io);

io.on("connection", async (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});



const port = process.env.PORT;

app.use('/',loginRoutes);
app.use("/api", orderRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        server.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((err) => console.error("DB connection error:", err));
