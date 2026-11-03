
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "HišniServis API deluje!",
    database: mongoose.connection.readyState === 1
      ? "Povezana"
      : "Ni povezana"
  });
});

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI ni nastavljen v .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas povezan!");

    app.listen(PORT, () => {
      console.log(`Server deluje na http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Napaka pri povezavi z MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
