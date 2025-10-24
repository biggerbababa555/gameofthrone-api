// tools/fetch-wiki-images.mjs
// Node >=18 (มี fetch ติดมาแล้ว). ใช้ ESM (.mjs)
// ดึงรูปจาก Wikipedia/Wikimedia REST API แล้วบันทึกเป็น .png ตามชื่อไฟล์ที่กำหนด

import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
const streamPipeline = promisify(pipeline);

// ------------------- ตั้งค่าโฟลเดอร์ปลายทาง -------------------
const OUT_DIR = path.resolve(process.cwd(), "public/images/characters");
// ถ้าคุณอยากเก็บในโฟลเดอร์ชื่อ "characters" แยกต่างหากก็แก้เป็น:
// const OUT_DIR = path.resolve(process.cwd(), "characters");

fs.mkdirSync(OUT_DIR, { recursive: true });

// ------------------- รายชื่อไฟล์ -> Wikipedia Title -------------------
// ชุดนี้ครอบคลุมตัวหลัก/เด่นจำนวนมาก (80+ รายการ) — เพิ่มได้เองง่าย ๆ
// ชื่อไฟล์ต้อง "ตรง" กับ JSON ของคุณ
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
  ["jon-snow.png", "Jon Snow (Game of Thrones)"],

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
  ["maester-aemon.png", "Aemon Targaryen (son of Maekar I)"],
  ["tormund.png", "Tormund Giantsbane"],
  ["ygritte.png", "Ygritte"],
  ["mance-rayder.png", "Mance Rayder"],
  ["styr.png", "Styr"],
  ["osha.png", "Osha"],
  ["craster.png", "Craster (character)"],
  ["gilly.png", "Gilly (Game of Thrones)"],
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

  // Historic / Others (อาจไม่มีภาพเดี่ยวชัดในวิกิ)
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
  ["waif.png", "Waif (Game of Thrones)"],
  ["yezzan.png", "Yezzan zo Qaggaz"],
  ["prendahl.png", "Prendahl na Ghezn"],
  ["mero.png", "Mero (Game of Thrones)"],
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
  ["lem.png", "Lem (Game of Thrones)"],

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
  ["ros.png", "Ros (Game of Thrones)"],
  ["olyvar.png", "Olyvar"],
  ["locke.png", "Locke (Game of Thrones)"],
  ["selyse-florent.png", "Selyse Baratheon"],
  ["dontos-hollard.png", "Dontos Hollard"],

  // White Walkers
  ["night-king.png", "Night King"],
  ["white-walker.png", "White Walker"],

  // Variants
  ["petyr-baelish-2.png", "Petyr Baelish"],
  ["qyburn-2.png", "Qyburn"],
  ["margaery-queen.png", "Margaery Tyrell"],
];

// ------------------- ฟังก์ชันหลัก -------------------
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function getImageUrlFromWikipedia(title) {
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;
  const res = await fetch(endpoint, {
    headers: { "User-Agent": "got-images-fetcher/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${title}`);
  const data = await res.json();
  // ใช้ original image (ถ้ามี) ตกลงไปหา thumbnail
  const url = data?.originalimage?.source || data?.thumbnail?.source || null;
  return url;
}

async function downloadToPng(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  // พยายามแปลงเป็น PNG ด้วย sharp หากติดตั้งไว้
  try {
    const sharp = (await import("sharp")).default;
    const png = await sharp(buf).png().toBuffer();
    fs.writeFileSync(outPath, png);
  } catch {
    // ถ้าไม่มี sharp → เซฟไฟล์ดิบ (อาจเป็น jpg) แต่ตั้งนามสกุล .png ตามโจทย์
    fs.writeFileSync(outPath, buf);
  }
}

async function run() {
  let ok = 0,
    fail = 0,
    skip = 0;
  for (const [filename, title] of MAP) {
    const outPath = path.join(OUT_DIR, filename);
    try {
      const imgUrl = await getImageUrlFromWikipedia(title);
      if (!imgUrl) {
        console.warn(`⚠️  No image for "${title}" → ${filename}`);
        fail++;
        continue;
      }
      await downloadToPng(imgUrl, outPath);
      console.log(`✅ ${title} → ${filename}`);
      ok++;
      // หน่วงนิดหน่อยกัน rate limit
      await delay(200);
    } catch (err) {
      console.warn(`❌ ${title} → ${filename} :: ${err.message}`);
      fail++;
    }
  }
  console.log(`\nDone. Success: ${ok}, Failed: ${fail}, Skipped: ${skip}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
