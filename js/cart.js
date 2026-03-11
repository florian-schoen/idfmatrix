// Abhängig von: config.js (P, MAINT_MAP), app.js (state)

function calcPmDays() {
  const wp = Math.max(1, state.a1Work || 1);
  const auto = 1 + Math.max(0, wp - 1) * 0.5;
  return state.pmDays !== null ? state.pmDays : auto;
}

function hasTech() {
  return !!(state.tech.legic || state.tech.classic || state.tech.desfire || state.tech.unknown);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValid() {
  if (state.projName.trim() === "") return false;
  if (!state.a1Variant) return false;
  if (!state.a1Work || state.a1Work < 1) return false;
  if (!state.a2Variant) return false;
  if (state.a2Variant === "mit") {
    if (!state.a2Camera) return false;
    if (!state.a2Work || state.a2Work < 1) return false;
  }
  if (!state.a3Printer) return false;
  if (/codierung/.test(state.a1Variant) && !state.a3CodeReader) return false;
  if (/codierung/.test(state.a1Variant) && !hasTech()) return false;
  if (!state.a5Umsetzung) return false;
  if (!state.email || !isValidEmail(state.email)) return false;
  if (state.opt.custom      && !state.opt.customDesc.trim())      return false;
  if (state.opt.supplies    && !state.opt.suppliesDesc.trim())    return false;
  if (state.opt.accessories && !state.opt.accessoriesDesc.trim()) return false;
  if (state.opt.tag         && !state.opt.tagDesc.trim())         return false;
  return true;
}

function buildCartItems() {
  const items = [];
  const wp = Math.max(0, state.a1Work || 0);
  const aw = Math.max(0, state.a2Work || 0);

  // A1 – Software
  if (state.a1Variant) {
    if (/codierung/.test(state.a1Variant)) {
      items.push(Object.assign({}, P.PRO, { qty: wp }));
      if (state.tech.unknown) {
        items.push({ name: "Ausweistechnologie – Abklärung erforderlich", qty: 1, noQty: true,
          note: "Technologie unbekannt: 3 codierte Musterausweise des Endkunden werden zur Analyse benötigt." });
      } else {
        if (state.tech.legic)   items.push(Object.assign({}, P.T_LEGIC,   { qty: wp }));
        if (state.tech.classic) items.push(Object.assign({}, P.T_CLASSIC, { qty: wp }));
        if (state.tech.desfire) items.push(Object.assign({}, P.T_DESFIRE, { qty: wp }));
      }
    } else {
      items.push(Object.assign({}, P.PRINT, { qty: wp }));
    }
  }

  // A2 – Bilderfassung
  if (state.a2Variant === "mit" && aw > 0) {
    items.push(Object.assign({}, P.IDIMAGE, { qty: aw }));
    if (state.a2KI) items.push(Object.assign({}, P.KI, { qty: aw }));
    if (state.a2Camera === "webcam") items.push(Object.assign({}, P.CAM_USB, { qty: aw }));
    if (state.a2Camera === "dslr") {
      items.push(Object.assign({}, P.CAM_DSLR,  { qty: aw }));
      items.push(Object.assign({}, P.NETZTEIL,   { qty: aw }));
      items.push(Object.assign({}, P.USB_KABEL,  { qty: aw }));
    }
    if (state.a2Stativ) {
      const q = state.qtyStativ !== null ? state.qtyStativ : aw;
      items.push(Object.assign({}, P.STATIV, { qty: q, editable: true, stateKey: "qtyStativ" }));
    }
    if (state.a2Lighting) {
      const q = state.qtyLed !== null ? state.qtyLed : aw;
      items.push(Object.assign({}, P.LED, { qty: q, editable: true, stateKey: "qtyLed" }));
    }
  }

  // A3 – Retransferdrucker
  if (state.a3Printer === "retransfer") {
    const qRet = state.qtyPrnRet !== null ? state.qtyPrnRet : wp;
    items.push(Object.assign({}, P.PRN_RET, { qty: qRet, editable: true, stateKey: "qtyPrnRet", warnIfLess: state.a1Variant === "druck_codierung" ? wp : undefined }));
    items.push(Object.assign({}, P.BEND_REMEDY, { qty: qRet }));
    const qRibC = state.qtyRibbonRetC !== null ? state.qtyRibbonRetC : qRet * 2;
    items.push(Object.assign({}, P.RIBBON_RET_C, { qty: qRibC, editable: true, stateKey: "qtyRibbonRetC" }));
    const qRetP = state.qtyRetransfPlat !== null ? state.qtyRetransfPlat : qRet * 2;
    items.push(Object.assign({}, P.RETRANSF_PLAT, { qty: qRetP, editable: true, stateKey: "qtyRetransfPlat" }));
    if (!state.qtyCleanRetDel) {
      const qClR = state.qtyCleanRet !== null ? state.qtyCleanRet : qRet;
      items.push(Object.assign({}, P.CLEAN_RET, { qty: qClR, editable: true, stateKey: "qtyCleanRet", deletable: true, deleteKey: "qtyCleanRetDel" }));
    }
  }

  // A3 – Direktdrucker
  if (state.a3Printer === "direkt") {
    const qDir = state.qtyPrnDir !== null ? state.qtyPrnDir : wp;
    items.push(Object.assign({}, P.PRN_DIR, { qty: qDir, editable: true, stateKey: "qtyPrnDir", warnIfLess: state.a1Variant === "druck_codierung" ? wp : undefined }));
    items.push(Object.assign({}, P.CLEAN_DIR, { qty: qDir }));
    if (state.a3Ribbon === "color") {
      const qRibDC = state.qtyRibbonDirC !== null ? state.qtyRibbonDirC : qDir * 2;
      items.push(Object.assign({}, P.RIBBON_DIR_C, { qty: qRibDC, editable: true, stateKey: "qtyRibbonDirC" }));
    } else {
      const qRibDB = state.qtyRibbonDirB !== null ? state.qtyRibbonDirB : qDir * 2;
      items.push(Object.assign({}, P.RIBBON_DIR_B, { qty: qRibDB, editable: true, stateKey: "qtyRibbonDirB" }));
    }
  }

  // A3 – Codiereinheit
  if (/codierung/.test(state.a1Variant) && state.a3CodeReader) {
    if (state.a3CodeReader === "integriert") {
      if (state.a3Printer === "retransfer") {
        const qRet = state.qtyPrnRet !== null ? state.qtyPrnRet : wp;
        items.push(Object.assign({}, P.ENC_RET, { qty: qRet }));
      }
      if (state.a3Printer === "direkt") {
        const qDir = state.qtyPrnDir !== null ? state.qtyPrnDir : wp;
        items.push(Object.assign({}, P.ENC_DIR, { qty: qDir }));
      }
    } else if (state.a3CodeReader === "extern") {
      items.push(Object.assign({}, P.TOM, { qty: wp }));
    }
  }

  // A4 – Optionale Module
  if (state.opt.custom)      items.push({ name: "Option: Anpassung an kundenspezifische Prozesse (Anfrage)", qty: 1, noQty: true, note: (state.opt.customDesc||"").trim() || "Bitte Anforderungen konkret an sales@evolutionid.com senden." });
  if (state.opt.supplies)    items.push({ name: "Option: Spezialanforderung Drucker (Anfrage)", qty: 1, noQty: true, note: (state.opt.suppliesDesc||"").trim() || "Bitte Bedarf an sales@evolutionid.com senden." });
  if (state.opt.accessories) items.push({ name: "Option: Zubehör (Hüllen, Jojos, etc.) (Anfrage)", qty: 1, noQty: true, note: (state.opt.accessoriesDesc||"").trim() || "Bitte Bedarf an sales@evolutionid.com senden." });
  if (state.opt.tag)         items.push({ name: "Option: evolutionID TagAnalyzer (Anfrage)", qty: 1, noQty: true, note: (state.opt.tagDesc||"").trim() || "Infos unter www.evolutionid.com oder sales@evolutionid.com." });

  // Automatische Zusatzartikel
  const camUsbItem = items.find(it => it.sku === "CAN4005018");
  if (camUsbItem) items.push(Object.assign({}, P.CAB_USB_EXT, { qty: camUsbItem.qty }));

  const proItem = items.find(it => it.sku === "IDF1001201");
  if (proItem && state.a1Lettershop) items.push(Object.assign({}, P.LETTERSHOP, { qty: proItem.qty }));

  // Blank PVC Cards
  const qMed = state.qtyMed !== null ? state.qtyMed : 50;
  items.push(Object.assign({}, P.MED, { qty: qMed, editable: true, stateKey: "qtyMed" }));

  // Projektmanagement
  const pmDays = calcPmDays();
  items.push(Object.assign({}, P.PM, { qty: pmDays, isPmDays: true, note: "Abklärung, Einrichtung und Umsetzung IDfunction" }));
  if (/codierung/.test(state.a1Variant)) {
    items.push(Object.assign({}, P.PM, { qty: 2, isPmDays: true, note: "Abklärung, Erstellung und Test der Codierung" }));
  }

  return items;
}

function buildMaintItems() {
  const years = Math.max(3, state.maintYears || 3);
  const maint = [];
  buildCartItems().forEach(it => {
    const sup = it.sku ? MAINT_MAP[it.sku] : null;
    if (sup) maint.push(Object.assign({}, sup, { qty: it.qty * years, baseQty: it.qty, years }));
  });
  return maint;
}
