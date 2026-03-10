// ---------- Optionen-Definitionen ----------
const A1 = [
  { key:"druck_codierung", label:"Druck & Codierung" },
  { key:"nur_druck",       label:"Nur Druck" },
  { key:"nur_codierung",   label:"Nur Codierung" },
];
const TECH = [
  { key:"legic",   label:"LEGIC Prime / Advant" },
  { key:"classic", label:"MIFARE Classic" },
  { key:"desfire", label:"MIFARE DESFire" },
];
const A2 = [
  { key:"ohne", label:"Ohne Bilderfassungsmodul" },
  { key:"mit",  label:"Mit Bilderfassungsmodul" },
];
const CAM = [
  { key:"webcam", label:"Webcam" },
  { key:"dslr",   label:"Spiegelreflexkamera" },
  { key:"none",   label:"Keine Kamera" },
];
const A3 = [
  { key:"retransfer", label:"Retransferdrucker" },
  { key:"direkt",     label:"Direktdrucker" },
  { key:"none",       label:"Kein Drucker" },
];
const CODEREADER = [
  { key:"integriert", label:"Integriertes Codiermodul" },
  { key:"extern",     label:"USB-Tischleser" },
];
const A5 = [
  { key:"remote",  label:"Remote" },
  { key:"vor_ort", label:"Vor Ort" },
];

// ---------- ECAT-Nummern (Kunden-Artikelnummern) ----------
const ECAT = {
  PRINT:        "ECA1001211",
  T_LEGIC:      "ECA1001206",
  T_CLASSIC:    "ECA1001204",
  T_DESFIRE:    "ECA1001205",
  IDIMAGE:      "ECA2001226",
  KI:           "ECA2001227",
  CAM_USB:      "ECA4005018",
  CAM_DSLR:     "ECA4005013",
  STATIV:       "ECA4005015",
  NETZTEIL:     "ECA4005014",
  USB_KABEL:    "ECA1001011",
  LED:          "ECA4005019",
  PRN_RET:      "ECA4001007",
  PRN_DIR:      "ECA4001000",
  ENC_RET:      "ECA4001004",
  ENC_DIR:      "ECA4001014",
  BEND_REMEDY:  "ECA4001013",
  RIBBON_RET_C: "ECA4001010",
  RETRANSF_PLAT:"ECA4001011",
  CLEAN_RET:    "ECA4001021",
  RIBBON_DIR_C: "ECA4001001",
  RIBBON_DIR_B: "ECA4001002",
  CLEAN_DIR:    "ECA4001003",
  PM:           "ECA1005012",
  TOM:          "ECA1002895",
  PRO:          "ECA1001201",
  MED:          "ECA1002019",
};

// ---------- Preise (EUR pro Einheit) ----------
const PRICES = {
  PRINT:          870.00,
  T_LEGIC:       1484.55,
  T_CLASSIC:      913.42,
  T_DESFIRE:     2357.68,
  IDIMAGE:        430.00,
  KI:             215.00,
  CAM_USB:        245.00,
  CAM_DSLR:       749.00,
  STATIV:         111.20,
  NETZTEIL:        73.75,
  USB_KABEL:       16.90,
  LED:            309.00,
  PRN_RET:       3116.61,
  PRN_DIR:       1392.00,
  ENC_RET:        698.40,
  ENC_DIR:        698.40,
  BEND_REMEDY:    236.00,
  RIBBON_RET_C:   182.00,
  RETRANSF_PLAT:   69.90,
  CLEAN_RET:       58.20,
  RIBBON_DIR_C:    66.23,
  RIBBON_DIR_B:    33.00,
  CLEAN_DIR:       26.54,
  PM:            1340.00,
  TOM:            215.82,
  PRO:           2327.61,
  MED:              0.36,
};

// ---------- Produkte ----------
const P = {
  // A1
  PRINT:         { sku: "IDF1001211", ecat: ECAT.PRINT,         price: PRICES.PRINT,         name: "IDfunction print" },
  PRO:           { sku: "IDF1001201", ecat: ECAT.PRO,           price: PRICES.PRO,           name: "IDfunction Professional" },
  MED:           { sku: "MED1002019", ecat: ECAT.MED,           price: PRICES.MED,           name: "Blank PVC Cards" },
  T_LEGIC:       { sku: "IDF1001206", ecat: ECAT.T_LEGIC,       price: PRICES.T_LEGIC,       name: "IDfunction Encode LEGIC® advant" },
  T_CLASSIC:     { sku: "IDF1001204", ecat: ECAT.T_CLASSIC,     price: PRICES.T_CLASSIC,     name: "IDfunction Encode MIFARE® Classic" },
  T_DESFIRE:     { sku: "IDF1001205", ecat: ECAT.T_DESFIRE,     price: PRICES.T_DESFIRE,     name: "IDfunction Encode DESFire EV1 (*EV2/EV3)" },
  // A2
  IDIMAGE:       { sku: "IDF2001226", ecat: ECAT.IDIMAGE,       price: PRICES.IDIMAGE,       name: "IDimage Bilderfassungssoftware" },
  KI:            { sku: "IDF2001227", ecat: ECAT.KI,            price: PRICES.KI,            name: "IDimage acquisition KI-Option" },
  CAM_USB:       { sku: "CAN4005018", ecat: ECAT.CAM_USB,       price: PRICES.CAM_USB,       name: "Webcam, HD-Video 1080p, 60 FPS, HDR" },
  CAM_DSLR:      { sku: "CAN4005013", ecat: ECAT.CAM_DSLR,      price: PRICES.CAM_DSLR,      name: "Canon Spiegelreflex-Kamera 2000D" },
  STATIV:        { sku: "CAN4005015", ecat: ECAT.STATIV,        price: PRICES.STATIV,        name: "Tripod-Stativ für SLR & Webcam" },
  NETZTEIL:      { sku: "CAN4005014", ecat: ECAT.NETZTEIL,      price: PRICES.NETZTEIL,      name: "Externes Netzteil Canon SLR Kameras" },
  USB_KABEL:     { sku: "CAB1001011", ecat: ECAT.USB_KABEL,     price: PRICES.USB_KABEL,     name: "3m USB-Kabel zu Mini-USB" },
  LED:           { sku: "CAN4005019", ecat: ECAT.LED,           price: PRICES.LED,           name: "LED Videobeleuchtung" },
  // A3 – Retransfer
  PRN_RET:       { sku: "MAT4001007", ecat: ECAT.PRN_RET,       price: PRICES.PRN_RET,       name: "MATICA XID8600 Dual Side" },
  ENC_RET:       { sku: "MAT4001004", ecat: ECAT.ENC_RET,       price: PRICES.ENC_RET,       name: "MATICA XID8300/XID8600 Kodiereinheit" },
  BEND_REMEDY:   { sku: "MAT4001013", ecat: ECAT.BEND_REMEDY,   price: PRICES.BEND_REMEDY,   name: "MATICA Edisec XID8300/8600 Bend Remedy" },
  RIBBON_RET_C:  { sku: "MAT4001010", ecat: ECAT.RIBBON_RET_C,  price: PRICES.RIBBON_RET_C,  name: "MATICA XID8300/XID8600 Farbband Platinum" },
  RETRANSF_PLAT: { sku: "MAT4001011", ecat: ECAT.RETRANSF_PLAT, price: PRICES.RETRANSF_PLAT, name: "MATICA XID8300/XID8600 Retransf Platinum" },
  CLEAN_RET:     { sku: "MAT4001021", ecat: ECAT.CLEAN_RET,     price: PRICES.CLEAN_RET,     name: "MATICA Cleaning Kit for XID Printer" },
  // A3 – Direktdruck
  PRN_DIR:       { sku: "MAT4001000", ecat: ECAT.PRN_DIR,       price: PRICES.PRN_DIR,       name: "Matica MC310 Dual Side Direktdrucker" },
  ENC_DIR:       { sku: "MAT4001014", ecat: ECAT.ENC_DIR,       price: PRICES.ENC_DIR,       name: "Kodiereinheit MATICA MC110/MC210/MC310" },
  RIBBON_DIR_C:  { sku: "MAT4001001", ecat: ECAT.RIBBON_DIR_C,  price: PRICES.RIBBON_DIR_C,  name: "Matica MC310 Farbband YMCKO (Platinum)" },
  RIBBON_DIR_B:  { sku: "MAT4001002", ecat: ECAT.RIBBON_DIR_B,  price: PRICES.RIBBON_DIR_B,  name: "Matica MC310 Farbband Schwarz-2000 Print" },
  CLEAN_DIR:     { sku: "MAT4001003", ecat: ECAT.CLEAN_DIR,     price: PRICES.CLEAN_DIR,     name: "Cleaning kit for MC DTC series Direct Printer" },
  // Projektmanagement
  PM:            { sku: "DLP1005012", ecat: ECAT.PM,            price: PRICES.PM,            name: "Projektmanagement Tagessatz" },
  // USB-Tischleser
  TOM:           { sku: "TOM1002895", ecat: ECAT.TOM,           price: PRICES.TOM,           name: "TWN4 MultiTech LEGIC 45 DT-U20-b" },
  // SW-Maintenance
  SUP_PRINT:     { sku: "SUP1001048", price: 182.70, name: "SW-Maintenance IDfunction print" },
  SUP_PRO:       { sku: "SUP1001046", price: 488.80, name: "SW-Maintenance IDfunction Professional" },
  SUP_DESFIRE:   { sku: "SUP1001051", price: 495.11, name: "SW-Maintenance IDfunction DESFire" },
  SUP_MIFARE:    { sku: "SUP1001050", price: 191.82, name: "SW-Maintenance IDfunction MIFARE" },
  SUP_LEGIC:     { sku: "SUP1001052", price: 311.76, name: "SW-Maintenance IDfunction Legic" },
  SUP_IDIMAGE:   { sku: "SUP1001084", price:  90.30, name: "SW-Maintenance IDimage" },
  SUP_KI:        { sku: "SUP1001085", price:  45.15, name: "SW-Maintenance IDimage KI" },
  // Lettershop
  CAB_USB_EXT:   { sku: "CAB1001012", price:  23.90, name: "3m USB-Kabel Verlängerung" },
  LETTERSHOP:    { sku: "IDF1001209", price: 990.00, name: "IDfunction Lettershop" },
  SUP_LETTERSHOP:{ sku: "SUP1001055", price:   0,    name: "SW-Maintenance IDfunction Lettershop" },
};

// Maintenance-Mapping: Haupt-SKU → Maintenance-Produkt
const MAINT_MAP = {
  "IDF1001211": P.SUP_PRINT,
  "IDF1001201": P.SUP_PRO,
  "IDF1001205": P.SUP_DESFIRE,
  "IDF1001204": P.SUP_MIFARE,
  "IDF1001206": P.SUP_LEGIC,
  "IDF2001226": P.SUP_IDIMAGE,
  "IDF2001227": P.SUP_KI,
  "IDF1001209": P.SUP_LETTERSHOP,
};
