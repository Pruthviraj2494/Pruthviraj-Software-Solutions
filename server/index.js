require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
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

const allowedOrigins = [
    process.env.CLIENT_URL,
];


const CORS_OBJECT = {
    origin: allowedOrigins,
    credentials: true
}

app.use(cors(CORS_OBJECT));
app.use(express.json());
app.use((req, res, next) => {
    if (req.method == "POST" || req.method == "PUT") {
        console.log("URL:", req.url);
        console.log("Body: ", req.body && JSON.stringify(req.body));
    }
    next();
});

if (NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientPath));

  // React Router fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

require("./routes.js")(app);

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