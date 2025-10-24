// data/houses.js
// แหล่งอ้างอิงโครงสร้าง/รายชื่อ: https://awoiaf.westeros.org/index.php/Houses_of_Westeros
// หมายเหตุ: ชุดนี้โฟกัส “ในเนื้อเรื่อง Game of Thrones” เท่านั้น (ไม่รวม HoTD)
// และตัดช่วงเวลา start/end ทิ้ง ให้เหลือสถานะท้ายเรื่องในบริบท GoT

export const REGIONS = [
  "Crownlands",
  "North",
  "Vale",
  "Riverlands",
  "Iron Islands",
  "Westerlands",
  "Reach",
  "Stormlands",
  "Dorne",
  "Unknown",
];

export const RANKS = [
  "Royal House",
  "Great House",
  "Lordly Houses",
  "Knightly Houses",
  "Masterly Houses",
  "Other Houses",
  "Exiled Houses",
  "Deposed Houses",
  "Extinct Houses",
];

// ✅ เหลือเฉพาะข้อมูลที่ใช้ใน GoT (สรุปตอนปลายเรื่องในบริบทซีรีส์/เล่มหลัก)
// โลโก้ให้คุณใส่ไฟล์เองใน public/images/houses/ แล้วอ้างด้วย path เริ่มต้นด้วย /images/...
export const houses = [
  // ===== Crownlands =====

  // (Velaryon มีอยู่ในโลก GoT ด้วย แต่ออกซีนไม่มาก คุณจะคง/ลบก็ได้)
  {
    id: "velaryon",
    name: "Velaryon",
    rank: "Lordly Houses",
    region: "Crownlands",
    logo: "/images/houses/velaryon.png",
  },
  {
    id: "blackfyre",
    name: "Blackfyre",
    rank: "Extinct Houses",
    region: "Crownlands",
    logo: "/images/houses/blackfyre.png",
  },

  // ===== North =====
  {
    id: "bolton",
    name: "Bolton",
    rank: "Great House",
    region: "North",
    logo: "/images/houses/bolton.png",
  },
  {
    id: "stark-deposed",
    name: "Stark",
    rank: "Deposed Houses",
    region: "North",
    logo: "/images/houses/stark.png",
  },
  {
    id: "mormont",
    name: "Mormont",
    rank: "Lordly Houses",
    region: "North",
    logo: "/images/houses/mormont.png",
  },
  {
    id: "manderly",
    name: "Manderly",
    rank: "Lordly Houses",
    region: "North",
    logo: "/images/houses/manderly.png",
  },

  // ===== Vale =====
  {
    id: "arryn",
    name: "Arryn of the Eyrie",
    rank: "Great House",
    region: "Vale",
    logo: "/images/houses/arryn.png",
  },
  {
    id: "baelish-vale",
    name: "Baelish",
    rank: "Lordly Houses",
    region: "Vale",
    logo: "/images/houses/baelish.png",
  },

  // ===== Riverlands =====
  {
    id: "baelish-harrenhal",
    name: "Baelish of Harrenhal",
    rank: "Great House",
    region: "Riverlands",
    logo: "/images/houses/baelish.png",
  },
  {
    id: "frey-twins",
    name: "Frey of the Twins",
    rank: "Lordly Houses",
    region: "Riverlands",
    logo: "/images/houses/frey.png",
  },
  {
    id: "tully-deposed",
    name: "Tully",
    rank: "Deposed Houses",
    region: "Riverlands",
    logo: "/images/houses/tully.png",
  },

  // ===== Iron Islands =====
  {
    id: "greyjoy",
    name: "Greyjoy",
    rank: "Great House",
    region: "Iron Islands",
    logo: "/images/houses/greyjoy.png",
  },
  {
    id: "hoare",
    name: "Hoare",
    rank: "Extinct Houses",
    region: "Iron Islands",
    logo: "/images/houses/hoare.png",
  },

  // ===== Westerlands =====
  {
    id: "lannister-casterly-rock",
    name: "Lannister of Casterly Rock",
    rank: "Great House",
    region: "Westerlands",
    logo: "/images/houses/lannister.png",
  },
  {
    id: "clegane",
    name: "Clegane",
    rank: "Knightly Houses",
    region: "Westerlands",
    logo: "/images/houses/clegane.png",
  },
  {
    id: "reyne",
    name: "Reyne",
    rank: "Extinct Houses",
    region: "Westerlands",
    logo: "/images/houses/reyne.png",
  },

  // ===== Reach =====
  {
    id: "tyrell-highgarden",
    name: "Tyrell of Highgarden",
    rank: "Great House",
    region: "Reach",
    logo: "/images/houses/tyrell.png",
  },
  {
    id: "hightower",
    name: "Hightower",
    rank: "Lordly Houses",
    region: "Reach",
    logo: "/images/houses/hightower.png",
  },
  {
    id: "gardener",
    name: "Gardener",
    rank: "Extinct Houses",
    region: "Reach",
    logo: "/images/houses/gardener.png",
  },

  // ===== Stormlands =====
  {
    id: "baratheon-stormlands",
    name: "Baratheon",
    rank: "Great House",
    region: "Stormlands",
    logo: "/images/houses/baratheon.png",
  },
  {
    id: "dondarrion",
    name: "Dondarrion",
    rank: "Lordly Houses",
    region: "Stormlands",
    logo: "/images/houses/dondarrion.png",
  },
  {
    id: "durrandon",
    name: "Durrandon",
    rank: "Extinct Houses",
    region: "Stormlands",
    logo: "/images/houses/durrandon.png",
  },

  // ===== Dorne =====
  {
    id: "martell",
    name: "Martell",
    rank: "Great House",
    region: "Dorne",
    logo: "/images/houses/martell.png",
  },
  {
    id: "dayne-starfall",
    name: "Dayne of Starfall",
    rank: "Lordly Houses",
    region: "Dorne",
    logo: "/images/houses/dayne.png",
  },
];
