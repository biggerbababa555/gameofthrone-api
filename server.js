// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { characters } from "./data/characters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// เสิร์ฟไฟล์รูปแบบ static
app.use("/images", express.static(path.join(__dirname, "public/images")));

// API เดียว: GET /api/characters
// รองรับ query: ?house=Stark&gender=female&q=arya
app.get("/api/characters", (req, res) => {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host"); // eg. "localhost:3000"
  const base = `${proto}://${host}`;

  const items = characters.map((c) => ({
    ...c,
    image: c.image.startsWith("http") ? c.image : `${base}${c.image}`, // -> http://localhost:3000/images/jon-snow.png
  }));

  res.json({ count: items.length, items });
});

app.get("/", (_req, res) => {
  res.send("8-bit Characters API is running. Try GET /api/characters");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API ready on http://localhost:${PORT}`);
});
