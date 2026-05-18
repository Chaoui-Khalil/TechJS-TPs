import express from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";
import { connectDB } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", bookRoutes);

app.get("/", (req, res) => {
  res.send("Book Tracker API is running");
});

// DB
connectDB();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});