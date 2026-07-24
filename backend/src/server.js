import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import friendRoute from "./routes/friendRoute.js";
import chatRoute from "./routes/conversationRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./socket/index.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/auth", authRoute);

app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/conversations", chatRoute);
app.use("/api/messages", messageRoute);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server start listening in ", PORT);
  });
});
