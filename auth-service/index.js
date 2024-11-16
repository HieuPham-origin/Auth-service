const express = require("express");
const connectMongoDB = require("./configs/database.config");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
// routes
// const userRoute = require('./routes/user.route')
const authRoute = require("./routes/auth.route");
// middlewares
const handleError = require("./errors/handleError");
const formatResponse = require("./middlewares/formatResponse");
// const { connectRabbitMQ } = require("./configs/rabbitmq.connection");
const { receiveQueue } = require("./utils/consumer");

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Cho phép tất cả các phương thức
    credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

// app.use("/users", userRoute, formatResponse);
app.use("/", authRoute, formatResponse);
// receiveQueue();

app.use(handleError);

const start = async () => {
    try {
        await connectMongoDB(process.env.URL);
        await receiveQueue();
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();
