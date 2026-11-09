import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import popravilaRoutes from "./routes/popravila.js";
import ponudbeRoutes from "./routes/ponudbe.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Izbira podatkovne baze
const DB_MODE = process.env.DB_MODE || "local";

const MONGO_URI =
  DB_MODE === "local"
    ? process.env.MONGO_URI_LOCAL
    : process.env.MONGO_URI_ATLAS;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/popravila", popravilaRoutes);
app.use("/api/ponudbe", ponudbeRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "HišniServis API deluje!",
    database:
      mongoose.connection.readyState === 1
        ? "Povezana"
        : "Ni povezana",
    databaseMode: DB_MODE
  });
});

async function startServer() {
  try {
    if (!["local", "atlas"].includes(DB_MODE)) {
      throw new Error("DB_MODE mora biti 'local' ali 'atlas'.");
    }

    if (!MONGO_URI) {
      throw new Error(
        `Povezava za MongoDB (${DB_MODE}) ni nastavljena v .env`
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log(
      DB_MODE === "local"
        ? "Lokalna MongoDB povezana!"
        : "MongoDB Atlas povezan!"
    );

    app.listen(PORT, () => {
      console.log(`Server deluje na http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(
      "Napaka pri povezavi z MongoDB:",
      error.message
    );
    process.exit(1);
  }
}

startServer();
