// tools/fetch-wiki-images.mjs
// Node >=18 (มี fetch ติดมาแล้ว). ใช้ ESM (.mjs)

import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import * as cheerio from "cheerio";
const streamPipeline = promisify(pipeline);

// ------------------- ตั้งค่าโฟลเดอร์ปลายทาง -------------------
const OUT_DIR = path.resolve(process.cwd(), "public/images/characters");
fs.mkdirSync(OUT_DIR, { recursive: true });

// ------------------- รายชื่อไฟล์ -> ชื่อเรื่อง -------------------
const MAP = [
  // North / Stark
  ["eddard-stark.png", "Eddard Stark"],
  ["catelyn-tully.png", "Catelyn Stark"],
  ["robb-stark.png", "Robb Stark"],
  ["sansa-stark.png", "Sansa Stark"],
  ["arya-stark.png", "Arya Stark"],
  ["bran-stark.png", "Bran Stark"],
  ["rickon-stark.png", "Rickon Stark"],
  ["benjen-stark.png", "Benjen Stark"],
  ["lyanna-stark.png", "Lyanna Stark"],
  ["jon-snow.png", "Jon Snow"], // AWOIAF ใช้ "Jon Snow"

  ["roose-bolton.png", "Roose Bolton"],
  ["ramsay-bolton.png", "Ramsay Bolton"],
  ["domeric-bolton.png", "Domeric Bolton"],
  ["wyman-manderly.png", "Wyman Manderly"],
  ["jeor-mormont.png", "Jeor Mormont"],
  ["jorah-mormont.png", "Jorah Mormont"],
  ["lyanna-mormont.png", "Lyanna Mormont"],

  ["samwell-tarly.png", "Samwell Tarly"],
  ["edd-tollett.png", "Eddison Tollett"],
  ["alliser-thorne.png", "Alliser Thorne"],
  ["gren.png", "Grenn"],
  ["pyp.png", "Pypar"],
  ["qhorin-halfhand.png", "Qhorin Halfhand"],
  ["othell-yarwyck.png", "Othell Yarwyck"],
  ["janos-slynt.png", "Janos Slynt"],
  ["maester-aemon.png", "Aemon Targaryen"], // ที่ AWOIAF เป็น "Aemon Targaryen"
  ["tormund.png", "Tormund Giantsbane"],
  ["ygritte.png", "Ygritte"],
  ["mance-rayder.png", "Mance Rayder"],
  ["styr.png", "Styr"],
  ["osha.png", "Osha"],
  ["craster.png", "Craster"],
  ["gilly.png", "Gilly"],
  ["jojen-reed.png", "Jojen Reed"],
  ["meera-reed.png", "Meera Reed"],
  ["hodor.png", "Hodor"],
  ["old-nan.png", "Old Nan"],
  ["maester-luwin.png", "Luwin"],

  // Lannister / Westerlands
  ["tywin.png", "Tywin Lannister"],
  ["jaime.png", "Jaime Lannister"],
  ["cersei.png", "Cersei Lannister"],
  ["tyrion.png", "Tyrion Lannister"],
  ["kevan.png", "Kevan Lannister"],
  ["lancel.png", "Lancel Lannister"],
  ["martyn-lannister.png", "Martyn Lannister"],
  ["willem-lannister.png", "Willem Lannister"],
  ["gregor.png", "Gregor Clegane"],
  ["sandor.png", "Sandor Clegane"],
  ["bronn.png", "Bronn"],
  ["podrick.png", "Podrick Payne"],
  ["qyburn.png", "Qyburn"],
  ["varys.png", "Varys"],
  ["joffrey.png", "Joffrey Baratheon"],
  ["tommen.png", "Tommen Baratheon"],
  ["myrcella.png", "Myrcella Baratheon"],
  ["high-sparrow.png", "High Sparrow"],
  ["septa-unella.png", "Septa Unella"],

  // Tyrell / Reach
  ["mace.png", "Mace Tyrell"],
  ["olenna.png", "Olenna Tyrell"],
  ["margaery.png", "Margaery Tyrell"],
  ["loras.png", "Loras Tyrell"],
  ["randyll-tarly.png", "Randyll Tarly"],
  ["dickon-tarly.png", "Dickon Tarly"],
  ["garlan-tyrell.png", "Garlan Tyrell"],
  ["willas-tyrell.png", "Willas Tyrell"],

  // Baratheon / Stormlands
  ["robert.png", "Robert Baratheon"],
  ["stannis.png", "Stannis Baratheon"],
  ["renly.png", "Renly Baratheon"],
  ["davos.png", "Davos Seaworth"],
  ["melisandre.png", "Melisandre"],
  ["brienne.png", "Brienne of Tarth"],
  ["beric.png", "Beric Dondarrion"],
  ["selwyn-tarth.png", "Selwyn Tarth"],
  ["matthos-seaworth.png", "Matthos Seaworth"],
  ["shireen-baratheon.png", "Shireen Baratheon"],

  // Martell / Dorne
  ["doran.png", "Doran Martell"],
  ["oberyn.png", "Oberyn Martell"],
  ["areo-hotah.png", "Areo Hotah"],
  ["ellaria.png", "Ellaria Sand"],
  ["obara.png", "Obara Sand"],
  ["nymeria.png", "Nymeria Sand"],
  ["tyene.png", "Tyene Sand"],
  ["trystane.png", "Trystane Martell"],
  ["sarella-sand.png", "Sarella Sand"],

  // Dayne
  ["arthur-dayne.png", "Arthur Dayne"],
  ["ashara-dayne.png", "Ashara Dayne"],

  // Riverlands / Frey / Tully / Baelish
  ["walder-frey.png", "Walder Frey"],
  ["black-walder.png", "Black Walder Rivers"],
  ["lothar-frey.png", "Lothar Frey"],
  ["roslin-frey.png", "Roslin Frey"],
  ["walda-frey.png", "Walda Frey"],
  ["edmure-tully.png", "Edmure Tully"],
  ["brynden-tully.png", "Brynden Tully"],
  ["hoster-tully.png", "Hoster Tully"],
  ["petyr-baelish.png", "Petyr Baelish"],
  ["robin-arryn.png", "Robin Arryn"],
  ["lysa-arryn.png", "Lysa Arryn"],
  ["jon-arryn.png", "Jon Arryn"],

  // Greyjoy / Iron Islands
  ["balon-greyjoy.png", "Balon Greyjoy"],
  ["euron-greyjoy.png", "Euron Greyjoy"],
  ["aeron-greyjoy.png", "Aeron Greyjoy"],
  ["yara-greyjoy.png", "Yara Greyjoy"],
  ["theon-greyjoy.png", "Theon Greyjoy"],

  // Historic / Others
  ["harren-hoare.png", "Harren the Black"],
  ["tyto-reyne.png", "House Reyne"],

  // Targaryen & Essos
  ["daenerys-targaryen.png", "Daenerys Targaryen"],
  ["viserys-targaryen.png", "Viserys Targaryen"],
  ["khal-drogo.png", "Khal Drogo"],
  ["missandei.png", "Missandei"],
  ["grey-worm.png", "Grey Worm"],
  ["daario-naharis.png", "Daario Naharis"],
  ["quaithe.png", "Quaithe"],
  ["xaro.png", "Xaro Xhoan Daxos"],
  ["pyat-pree.png", "Pyat Pree"],
  ["kraznys.png", "Kraznys mo Nakloz"],
  ["hizdahr.png", "Hizdahr zo Loraq"],
  ["mossador.png", "Mossador"],
  ["tycho-nestoris.png", "Tycho Nestoris"],
  ["jaqen.png", "Jaqen H'ghar"],
  ["waif.png", "Waif"],
  ["yezzan.png", "Yezzan zo Qaggaz"],
  ["prendahl.png", "Prendahl na Ghezn"],
  ["mero.png", "Mero"],
  ["razdal.png", "Razdal mo Eraz"],
  ["qotho.png", "Qotho"],
  ["kovarro.png", "Kovarro"],

  // Vale
  ["yohn-royce.png", "Yohn Royce"],
  ["mya-stone.png", "Mya Stone"],

  // KL guards/court
  ["osmund-kettleblack.png", "Osmund Kettleblack"],
  ["meryn-trant.png", "Meryn Trant"],
  ["boros-blount.png", "Boros Blount"],
  ["ilyn-payne.png", "Ilyn Payne"],
  ["taena.png", "Taena of Myr"],

  // Brotherhood
  ["thoros.png", "Thoros of Myr"],
  ["anguy.png", "Anguy"],
  ["lem.png", "Lem"],

  // More North
  ["smalljon-umber.png", "Smalljon Umber"],
  ["greatjon-umber.png", "Greatjon Umber"],
  ["alys-karstark.png", "Alys Karstark"],
  ["rickard-karstark.png", "Rickard Karstark"],
  ["harald-karstark.png", "Harald Karstark"],
  ["roose-ryswell.png", "Roose Ryswell"],
  ["wendel-manderly.png", "Wendel Manderly"],

  // More Essos
  ["kinvara.png", "Kinvara"],
  ["quentyn.png", "Quentyn Martell"],

  // Misc
  ["shae.png", "Shae"],
  ["ros.png", "Ros"],
  ["olyvar.png", "Olyvar"],
  ["locke.png", "Locke"],
  ["selyse-florent.png", "Selyse Florent"],
  ["dontos-hollard.png", "Dontos Hollard"],

  // White Walkers
  ["night-king.png", "Night King"],
  ["white-walker.png", "White Walker"],

  // Variants
  ["petyr-baelish-2.png", "Petyr Baelish"],
  ["qyburn-2.png", "Qyburn"],
  ["margaery-queen.png", "Margaery Tyrell"],
];

// ------------------- Helper -------------------
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function toAwoiafSlug(title) {
  // แปลง "Lyanna Stark" -> "Lyanna_Stark"
  // ตัดส่วนในวงเล็บออก (AWOIAF มักไม่มีวงเล็บ disambiguation แบบ Wikipedia)
  const t = title.replace(/\s*\(.*?\)\s*/g, "").trim();
  return t.replace(/\s+/g, "_");
}

function absolutizeAwoiafUrl(src) {
  // src อาจเป็น //upload.wikimedia... หรือ /images/... หรือ https://...
  if (src.startsWith("//")) return "https:" + src;
  if (src.startsWith("/")) return "https://awoiaf.westeros.org" + src;
  return src;
}

function originalFromMediaWikiThumb(u) {
  // แปลง .../thumb/<hash>/<filename>/<WIDTH>px-<filename> -> .../<hash>/<filename>
  try {
    const url = new URL(u);
    const parts = url.pathname.split("/");
    const i = parts.indexOf("thumb");
    if (i !== -1 && parts.length > i + 2) {
      // /thumb/<hash1>/<hash2>/<FileName>/<sizepx-FileName>
      // ลบ "thumb" และ segment สุดท้าย (size-file) ออก
      const withoutThumb = parts.slice(0, i).concat(parts.slice(i + 1, -1));
      url.pathname = withoutThumb.join("/");
      return url.toString();
    }
  } catch {
    // ไม่ใช่ URL สมบูรณ์ ก็ปล่อยไป
  }
  return u;
}

// ------------------- AWOIAF fetch -------------------
async function getImageUrlFromAwoiaf(title) {
  const slug = toAwoiafSlug(title);
  const pageUrl = `https://awoiaf.westeros.org/index.php/${encodeURIComponent(
    slug
  )}`;
  const res = await fetch(pageUrl, {
    headers: {
      "User-Agent": "got-images-fetcher/1.0",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://awoiaf.westeros.org/",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for AWOIAF: ${title}`);
  const html = await res.text();

  const $ = cheerio.load(html);

  // 1) พยายามหาใน infobox ก่อน
  let src =
    $(".infobox img").first().attr("src") ||
    $(".infobox .image img").first().attr("src") ||
    // 2) ถ้าไม่เจอ ลองรูปแรกที่อยู่ในคอนเทนต์
    $("#mw-content-text .image img").first().attr("src") ||
    $("a.image img").first().attr("src") ||
    null;

  if (!src) return null;

  src = absolutizeAwoiafUrl(src);
  // แปลงจาก thumbnail เป็นต้นฉบับ ถ้าเป็นรูปแบบ MediaWiki
  src = originalFromMediaWikiThumb(src);
  return src;
}

// ------------------- Wikipedia fallback (เดิม) -------------------
async function getImageUrlFromWikipedia(title) {
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;
  const res = await fetch(endpoint, {
    headers: { "User-Agent": "got-images-fetcher/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for Wikipedia: ${title}`);
  const data = await res.json();
  const url = data?.originalimage?.source || data?.thumbnail?.source || null;
  return url;
}

// ------------------- ดาวน์โหลด & เขียนไฟล์ -------------------
async function downloadToPng(url, outPath) {
  const res = await fetch(url, {
    headers: { "User-Agent": "got-images-fetcher/1.0" },
  });
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  try {
    const sharp = (await import("sharp")).default;
    const png = await sharp(buf).png().toBuffer();
    fs.writeFileSync(outPath, png);
  } catch {
    fs.writeFileSync(outPath, buf); // ไม่มี sharp -> เซฟดิบ ๆ นามสกุล .png
  }
}

// ------------------- Main -------------------
async function run() {
  let ok = 0,
    fail = 0;

  for (const [filename, title] of MAP) {
    const outPath = path.join(OUT_DIR, filename);
    try {
      // 1) ลอง AWOIAF ก่อน
      let imgUrl = await getImageUrlFromAwoiaf(title);

      // 2) ไม่เจอ -> fallback Wikipedia (เพื่ออัตราสำเร็จสูง)
      if (!imgUrl) {
        imgUrl = await getImageUrlFromWikipedia(title);
      }
      if (!imgUrl) {
        console.warn(`⚠️  No image for "${title}" → ${filename}`);
        fail++;
        continue;
      }

      await downloadToPng(imgUrl, outPath);
      console.log(`✅ ${title} → ${filename}`);
      ok++;

      // กัน rate limit เบา ๆ
      await delay(250);
    } catch (err) {
      console.warn(`❌ ${title} → ${filename} :: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone. Success: ${ok}, Failed: ${fail}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
