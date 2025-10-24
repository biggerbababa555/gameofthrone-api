// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { characters } from "./data/characters.js";
import { houses, REGIONS, RANKS } from "./data/houses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// เสิร์ฟไฟล์รูปแบบ static
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ===== เส้นเดิม: ตัวละคร =====
app.get("/api/characters", (req, res) => {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  const base = `${proto}://${host}`;

  const items = characters.map((c) => ({
    ...c,
    image: c.image?.startsWith("http") ? c.image : `${base}${c.image}`,
  }));

  res.json({ count: items.length, items });
});

// ===== เส้นใหม่: Houses (7 Kingdoms) =====
app.get("/api/houses", (req, res) => {
  const { region, rank, q } = req.query;
  let result = [...houses];

  if (region) {
    result = result.filter(
      (h) => h.region.toLowerCase() === String(region).toLowerCase()
    );
  }
  if (rank) {
    // รองรับหลายค่า: ?rank=Great%20House,Lordly%20Houses
    const ranks = String(rank)
      .split(",")
      .map((s) => s.trim().toLowerCase());
    result = result.filter((h) => ranks.includes(h.rank.toLowerCase()));
  }
  if (q) {
    const qq = String(q).toLowerCase();
    result = result.filter((h) =>
      [h.name, h.rank, h.region]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(qq))
    );
  }

  // เติม URL เต็มให้โลโก้ถ้าเป็น path
  const base = `${req.headers["x-forwarded-proto"] || req.protocol}://${req.get(
    "host"
  )}`;
  const items = result.map((h) => ({
    ...h,
    logo: h.logo?.startsWith("http") ? h.logo : `${base}${h.logo}`,
  }));

  res.json({ count: items.length, items });
});

// meta ใหม่ (ไม่มี at_values แล้ว)
app.get("/api/houses/meta", (_req, res) => {
  res.json({ regions: REGIONS, ranks: RANKS });
});

// health
app.get("/", (_req, res) => {
  res.send(
    "8-bit Characters API is running. Try GET /api/characters or /api/houses"
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API ready on http://localhost:${PORT}`);
});
