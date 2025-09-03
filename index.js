import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
