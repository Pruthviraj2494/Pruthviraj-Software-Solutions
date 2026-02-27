if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
}
const http = require("http");
const path = require("path");
const { Server: SocketServer } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");

const { handleError } = require("./middlewares/errorHandler.js");
const messagingHandler = require("./sockets/messaging.js");

const app = express();
const port = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));
}

app.use(express.json());
app.use((req, res, next) => {
    if (req.method == "POST" || req.method == "PUT") {
        console.log("URL:", req.url);
        console.log("Body: ", req.body && JSON.stringify(req.body));
    }
    next();
});

require("./routes.js")(app);

if (NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "../client/dist");

    app.use(express.static(clientPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
    });
}

app.use(handleError);

const server = http.createServer(app);
const io = new SocketServer(server, { cors: CORS_OBJECT });
messagingHandler(io);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGO_DB_NAME,
        });
        server.listen(port, () => {
            console.log(
                `Server listening on port ${port} in ${NODE_ENV} mode! ${new Date().toISOString()}`
            );
        });
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1);
    }
}

connectDB();