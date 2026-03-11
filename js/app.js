// Haupt-Einstiegspunkt – Abhängig von: config.js, cart.js, ui.js

// ---------- State ----------
const state = {
  projName: "", lastName: "", firstName: "", email: "", phone: "",
  end: { firma: "", strasse: "", plz: "", ort: "", vorname: "", nachname: "", email: "", telefon: "" },
  a1Variant: "", a1Work: 1,
  tech: { legic: false, classic: false, desfire: false },
  a2Variant: "", a2Camera: "", a2KI: false, a2Work: 1,
  a3Printer: "", a3CodeReader: "", a3Ribbon: "color",
  a2Lighting: false, qtyLed: null, a2Stativ: false,
  a1Lettershop: true,
  qtyPrnRet: null, qtyPrnDir: null, qtyStativ: null, qtyMed: null,
  qtyRibbonRetC: null, qtyRetransfPlat: null, qtyCleanRet: null,
  qtyRibbonDirC: null, qtyRibbonDirB: null,
  qtyCleanRetDel: false,
  opt: { custom: false, customDesc: "", supplies: false, suppliesDesc: "", accessories: false, accessoriesDesc: "", tag: false, tagDesc: "" },
  a5Umsetzung: "",
  maintYears: 3,
  notes: "", pmDays: null
};

// ---------- Element-Referenzen ----------
const el = {
  projName: document.getElementById("projName"),
  projWarn: document.getElementById("projWarn"),
  firma: document.getElementById("firma"),
  nachname: document.getElementById("nachname"),
  vorname: document.getElementById("vorname"),
  email: document.getElementById("email"),
  emailWarn: document.getElementById("emailWarn"),
  telefon: document.getElementById("telefon"),
  endFirma:    document.getElementById("endFirma"),
  endStrasse:  document.getElementById("endStrasse"),
  endPlz:      document.getElementById("endPlz"),
  endOrt:      document.getElementById("endOrt"),
  endVorname:  document.getElementById("endVorname"),
  endNachname: document.getElementById("endNachname"),
  endEmail:    document.getElementById("endEmail"),
  endTelefon:  document.getElementById("endTelefon"),
  checkoutBtnTop: document.getElementById("checkoutBtnTop"),
  a1Options: document.getElementById("a1Options"),
  a1Work: document.getElementById("a1Work"),
  a1CodingHint: document.getElementById("a1CodingHint"),
  a1UsbHint: document.getElementById("a1UsbHint"),
  a1LettershopRow: document.getElementById("a1LettershopRow"),
  a1Lettershop: document.getElementById("a1Lettershop"),
  techBlock: document.getElementById("techBlock"),
  techCards: document.getElementById("techCards"),
  techWarn: document.getElementById("techWarn"),
  a2Options: document.getElementById("a2Options"),
  a2Extras: document.getElementById("a2Extras"),
  a2Cameras: document.getElementById("a2Cameras"),
  a2KI: document.getElementById("a2KI"),
  a2KIHint: document.getElementById("a2KIHint"),
  a2Work: document.getElementById("a2Work"),
  a2NoCamHint: document.getElementById("a2NoCamHint"),
  a2Mismatch: document.getElementById("a2Mismatch"),
  a2MismatchLess: document.getElementById("a2MismatchLess"),
  a2Stativ: document.getElementById("a2Stativ"),
  a2Lighting: document.getElementById("a2Lighting"),
  a3Printers: document.getElementById("a3Printers"),
  a3CodeReaderCard: document.getElementById("a3CodeReaderCard"),
  a3CodeReaderOptions: document.getElementById("a3CodeReaderOptions"),
  a3RibbonWrapper: document.getElementById("a3RibbonWrapper"),
  ribbonColor: document.getElementById("ribbonColor"),
  ribbonBlack: document.getElementById("ribbonBlack"),
  a3NeedContact: document.getElementById("a3NeedContact"),
  a5Options: document.getElementById("a5Options"),
  a5RemoteHint: document.getElementById("a5RemoteHint"),
  a5OnsiteHint: document.getElementById("a5OnsiteHint"),
  optCustom: document.getElementById("optCustom"),
  optCustomDescRow: document.getElementById("optCustomDescRow"),
  optCustomDesc: document.getElementById("optCustomDesc"),
  optSupplies: document.getElementById("optSupplies"),
  optSuppliesDescRow: document.getElementById("optSuppliesDescRow"),
  optSuppliesDesc: document.getElementById("optSuppliesDesc"),
  optAccessories: document.getElementById("optAccessories"),
  optAccessoriesDescRow: document.getElementById("optAccessoriesDescRow"),
  optAccessoriesDesc: document.getElementById("optAccessoriesDesc"),
  optTagAnalyzer: document.getElementById("optTagAnalyzer"),
  optTagAnalyzerDescRow: document.getElementById("optTagAnalyzerDescRow"),
  optTagAnalyzerDesc: document.getElementById("optTagAnalyzerDesc"),
  notes: document.getElementById("notes"),
  cartItems: document.getElementById("cartItems"),
  maintItems: document.getElementById("maintItems"),
  maintTotal: document.getElementById("maintTotal"),
  maintYearsInput: document.getElementById("maintYearsInput"),
  cartCount: document.getElementById("cartCount"),
  customerBox: document.getElementById("customerBox"),
  cartHints: document.getElementById("cartHints"),
  statusText: document.getElementById("statusText"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  pmDaysInput: document.getElementById("pmDaysInput"),
  cartTotal: document.getElementById("cartTotal"),
};

// ---------- Event-Listener ----------
el.projName.addEventListener("input", e => { state.projName = e.target.value; update(); });
el.nachname.addEventListener("input", e => { state.lastName  = e.target.value; update(); });
el.vorname.addEventListener("input",  e => { state.firstName = e.target.value; update(); });
el.email.addEventListener("input",   e => { state.email      = e.target.value; update(); });
el.telefon.addEventListener("input", e => { state.phone      = e.target.value; update(); });
el.endFirma.addEventListener("input",    e => { state.end.firma    = e.target.value; update(); });
el.endStrasse.addEventListener("input",  e => { state.end.strasse  = e.target.value; update(); });
el.endPlz.addEventListener("input",      e => { state.end.plz      = e.target.value; update(); });
el.endOrt.addEventListener("input",      e => { state.end.ort      = e.target.value; update(); });
el.endVorname.addEventListener("input",  e => { state.end.vorname  = e.target.value; update(); });
el.endNachname.addEventListener("input", e => { state.end.nachname = e.target.value; update(); });
el.endEmail.addEventListener("input",    e => { state.end.email    = e.target.value; update(); });
el.endTelefon.addEventListener("input",  e => { state.end.telefon  = e.target.value; update(); });

function setA1(v) {
  state.a1Variant = v;
  if (!/codierung/.test(v)) { state.tech = { legic:false, classic:false, desfire:false }; state.a3CodeReader = ""; }
  else if (v === "druck_codierung") state.a3CodeReader = "integriert";
  else if (v === "nur_codierung")   state.a3CodeReader = "extern";
  el.a1CodingHint.style.display = /codierung/.test(v) ? "block" : "none";
  el.a1UsbHint.style.display    = v === "druck_codierung" ? "block" : "none";
  update();
}
function setCodeReader(v) { state.a3CodeReader = v; update(); }
function toggleTech(key, val) { state.tech[key] = val; update(); }

el.a1Work.addEventListener("input", e => {
  const n = Math.max(1, parseInt(e.target.value||'1', 10));
  state.a1Work = n;
  if (state.a2Work > n) { state.a2Work = n; el.a2Work.value = n; }
  update();
});

function setA2(v) {
  state.a2Variant = v;
  if (v !== "mit") { state.a2Camera = ""; state.a2KI = false; }
  if (v === "mit") { state.a2Work = state.a1Work; el.a2Work.value = state.a1Work; state.a2KI = true; el.a2KI.checked = true; }
  update();
}
el.a2KI.addEventListener("change", e => { state.a2KI = e.target.checked; update(); });
el.a2Work.addEventListener("input", e => {
  const max = Math.max(1, state.a1Work);
  let n = Math.max(1, parseInt(e.target.value||'1', 10));
  if (n > max) { n = max; el.a2Work.value = n; }
  state.a2Work = n; update();
});

function setCam(v) {
  state.a2Camera = v;
  if (v === "webcam" || v === "dslr") {
    state.a2Stativ = true; state.a2Lighting = true;
    el.a2Stativ.checked = true; el.a2Lighting.checked = true;
  } else if (v === "none") {
    state.a2Stativ = false; state.a2Lighting = false;
    state.qtyStativ = null; state.qtyLed = null;
    el.a2Stativ.checked = false; el.a2Lighting.checked = false;
  }
  update();
}

function setA3(v) {
  state.a3Printer = v;
  state.qtyPrnRet = null; state.qtyPrnDir = null;
  state.qtyRibbonRetC = null; state.qtyRetransfPlat = null;
  state.qtyCleanRet = null; state.qtyCleanRetDel = false;
  state.qtyRibbonDirC = null; state.qtyRibbonDirB = null;
  update();
}

el.a2Stativ.addEventListener("change",   e => { state.a2Stativ   = e.target.checked; update(); });
el.a2Lighting.addEventListener("change", e => { state.a2Lighting = e.target.checked; update(); });
el.ribbonColor.addEventListener("change", () => { state.a3Ribbon = "color"; state.qtyRibbonDirB = null; update(); });
el.ribbonBlack.addEventListener("change", () => { state.a3Ribbon = "black"; state.qtyRibbonDirC = null; update(); });

el.a1Lettershop.addEventListener("change", e => { state.a1Lettershop = e.target.checked; update(); });

el.optCustom.addEventListener("change",      e => { state.opt.custom      = e.target.checked; el.optCustomDescRow.style.display      = e.target.checked ? "block":"none"; update(); });
el.optCustomDesc.addEventListener("input",   e => { state.opt.customDesc  = e.target.value; update(); });
el.optSupplies.addEventListener("change",    e => { state.opt.supplies    = e.target.checked; el.optSuppliesDescRow.style.display    = e.target.checked ? "block":"none"; update(); });
el.optSuppliesDesc.addEventListener("input", e => { state.opt.suppliesDesc= e.target.value; update(); });
el.optAccessories.addEventListener("change", e => { state.opt.accessories = e.target.checked; el.optAccessoriesDescRow.style.display = e.target.checked ? "block":"none"; update(); });
el.optAccessoriesDesc.addEventListener("input", e => { state.opt.accessoriesDesc = e.target.value; update(); });
el.optTagAnalyzer.addEventListener("change", e => { state.opt.tag    = e.target.checked; el.optTagAnalyzerDescRow.style.display    = e.target.checked ? "block":"none"; update(); });
el.optTagAnalyzerDesc.addEventListener("input", e => { state.opt.tagDesc = e.target.value; update(); });
el.notes.addEventListener("input", e => { state.notes = e.target.value; update(); });

el.maintYearsInput.addEventListener("change", e => {
  const v = Math.max(3, parseInt(e.target.value||'3', 10));
  state.maintYears = v; e.target.value = v; update();
});
el.pmDaysInput.addEventListener("input", e => {
  const v = parseFloat(e.target.value);
  state.pmDays = (!isNaN(v) && v > 0) ? v : null;
  update();
});

function setA5(v) { state.a5Umsetzung = v; update(); }

function setCheckoutState(disabled, text) {
  el.checkoutBtn.disabled = disabled;
  el.checkoutBtn.textContent = text;
  if (el.checkoutBtnTop) { el.checkoutBtnTop.disabled = disabled; el.checkoutBtnTop.textContent = text; }
}

async function doSendEmail() {
  if (!isValid()) return;
  setCheckoutState(true, 'Wird gesendet…');
  const endHasData = Object.values(state.end).some(v => v && v.trim());
  try {
    const r = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectName:   state.projName,
        firstName:     state.firstName  || undefined,
        lastName:      state.lastName   || undefined,
        customerEmail: state.email      || undefined,
        phone:         state.phone      || undefined,
        endkunde:      endHasData ? state.end : undefined,
        csvContent:    buildCSV(),
        cartHtml:      buildCartHtml(),
      }),
    });
    if (r.ok) {
      setCheckoutState(true, 'Anfrage gesendet ✓');
    } else {
      setCheckoutState(false, 'Fehler – bitte erneut versuchen');
    }
  } catch(_) {
    setCheckoutState(false, 'Fehler – bitte erneut versuchen');
  }
}

el.checkoutBtn.addEventListener("click", doSendEmail);

// ---------- CSV-Inhalt aufbauen ----------
function buildCSV() {
  function csvCell(v) { const s = (v === null || v === undefined) ? "" : String(v); return '"' + s.replace(/"/g, '""') + '"'; }
  function fmtNum(n) { return typeof n === "number" ? n.toFixed(2).replace(".", ",") : ""; }

  const items = buildCartItems().filter(it => it.sku);
  const rows = [];
  rows.push(["Position","Artikelnummer","Artikelbezeichnung","Einzelpreis (EUR)","Stückzahl","Positionspreis (EUR)"].map(csvCell).join(";"));
  let total = 0;
  items.forEach((it, i) => {
    const ep = it.price != null ? it.price : 0;
    const pp = ep * it.qty;
    total += pp;
    rows.push([i+1, it.sku||"", it.name||"", fmtNum(ep), it.qty, fmtNum(pp)].map(csvCell).join(";"));
  });
  rows.push(["","","","","Gesamt:",fmtNum(total)].map(csvCell).join(";"));
  rows.push(""); rows.push("");

  const maintItems = buildMaintItems();
  if (maintItems.length > 0) {
    rows.push([csvCell("Softwaremaintenance (Laufzeit: " + state.maintYears + " Jahre)")].join(";"));
    rows.push(["Position","Artikelnummer","Artikelbezeichnung","Einzelpreis (EUR)","Stückzahl","Positionspreis (EUR)"].map(csvCell).join(";"));
    let maintTotal = 0;
    maintItems.forEach((it, i) => {
      const ep = it.price != null ? it.price : 0;
      const pp = ep * it.qty;
      maintTotal += pp;
      rows.push([i+1, it.sku||"", it.name||"", it.price != null ? fmtNum(ep) : "auf Anfrage", it.qty, it.price != null ? fmtNum(pp) : ""].map(csvCell).join(";"));
    });
    if (maintTotal > 0) rows.push(["","","","","Gesamt:",fmtNum(maintTotal)].map(csvCell).join(";"));
    rows.push(""); rows.push("");
  }

  const kd = [["Projektname",state.projName],["Vorname",state.firstName],["Nachname",state.lastName],["E-Mail",state.email],["Telefon",state.phone]];
  kd.forEach(([k, v]) => { if (v) rows.push([csvCell(k), csvCell(v)].join(";")); });

  return rows.join("\r\n");
}

// ---------- Warenkorb als HTML für E-Mail ----------
function buildCartHtml() {
  function esc(s) { return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function fmtE(n) { return typeof n === 'number' ? n.toLocaleString('de-DE', {style:'currency',currency:'EUR'}) : '–'; }
  const th = 'style="padding:7px 10px;text-align:left;background:#1a3a6e;color:#fff;"';
  const thr = 'style="padding:7px 10px;text-align:right;background:#1a3a6e;color:#fff;"';
  function tableHead() {
    return `<table style="border-collapse:collapse;width:100%;font-size:13px;margin-bottom:16px;">
      <thead><tr>
        <th ${th}>Pos.</th><th ${th}>Art.-Nr.</th><th ${th}>Bezeichnung</th>
        <th ${thr}>Menge</th><th ${thr}>Einzelpreis</th><th ${thr}>Gesamtpreis</th>
      </tr></thead><tbody>`;
  }
  function tableRow(i, sku, name, qty, price, note) {
    const bg = i % 2 === 0 ? '#f4f7ff' : '#ffffff';
    const td = `style="padding:6px 10px;border-bottom:1px solid #e0e0e0;background:${bg};"`;
    const tdr = `style="padding:6px 10px;text-align:right;border-bottom:1px solid #e0e0e0;background:${bg};"`;
    const ep = price != null ? price : 0;
    const nameHtml = esc(name) + (note ? `<br><span style="color:#888;font-size:11px;">${esc(note)}</span>` : '');
    return `<tr><td ${td}>${i+1}</td><td ${td}>${esc(sku)}</td><td ${td}>${nameHtml}</td>
      <td ${tdr}>${qty}</td><td ${tdr}>${price != null ? fmtE(ep) : 'auf Anfrage'}</td>
      <td ${tdr}>${price != null ? fmtE(ep * qty) : ''}</td></tr>`;
  }
  function totalRow(label, val) {
    return `<tr><td colspan="5" style="padding:7px 10px;text-align:right;font-weight:bold;border-top:2px solid #1a3a6e;background:#eef1fb;">${label}</td>
      <td style="padding:7px 10px;text-align:right;font-weight:bold;border-top:2px solid #1a3a6e;background:#eef1fb;">${fmtE(val)}</td></tr>`;
  }

  const items = buildCartItems().filter(it => it.sku);
  let total = 0;
  let html = `<h4 style="color:#1a3a6e;margin:0 0 6px;">Warenkorb</h4>` + tableHead();
  items.forEach((it, i) => { total += (it.price||0) * it.qty; html += tableRow(i, it.sku, it.name, it.qty, it.price, it.note); });
  html += totalRow('Gesamtpreis', total) + '</tbody></table>';

  const maint = buildMaintItems();
  if (maint.length > 0) {
    let mTotal = 0;
    html += `<h4 style="color:#1a3a6e;margin:16px 0 6px;">Softwaremaintenance (${state.maintYears} Jahre)</h4>` + tableHead();
    maint.forEach((it, i) => { mTotal += (it.price||0) * it.qty; html += tableRow(i, it.sku, it.name, it.qty, it.price, it.note); });
    if (mTotal > 0) html += totalRow('Gesamtpreis Maintenance', mTotal);
    html += '</tbody></table>';
  }
  return html;
}

// ---------- Init (async: Preise laden) ----------
(async function init() {
  // Admin-Preisüberschreibungen laden
  try {
    const r = await fetch('/api/articles');
    if (r.ok) {
      const d = await r.json();
      if (d && typeof d === 'object') {
        Object.values(P).forEach(p => {
          const ov = d[p.sku];
          if (ov) {
            if (ov.name  !== undefined) p.name  = ov.name;
            if (ov.price !== undefined) p.price = ov.price;
            if (ov.sku   !== undefined) p.sku   = ov.sku;
          }
        });
      }
    }
  } catch(_) {}

  // SUP_LETTERSHOP Preis dynamisch ableiten (nach Overrides)
  P.SUP_LETTERSHOP.price = Math.round(P.LETTERSHOP.price * 0.21 * 100) / 100;

  // Initiales Rendering
  radioCards(el.a1Options, "a1", A1, state.a1Variant, setA1);
  checkCards(el.techCards, "tech", TECH, state.tech, toggleTech);
  radioCards(el.a2Options, "a2", A2, state.a2Variant, setA2);
  radioCards(el.a2Cameras, "cam", CAM, state.a2Camera, setCam);
  radioCards(el.a3Printers, "a3", A3, state.a3Printer, setA3);
  radioCards(el.a5Options, "a5", A5, state.a5Umsetzung, setA5);
  update();

  // Alle Karten in #left einklappen + Nummern vergeben
  document.querySelectorAll('#left .card').forEach((card, i) => {
    card.classList.add('collapsed');
    const dot = card.querySelector('.card-head .dot');
    if (dot) {
      const num = document.createElement('div');
      num.className = 'step-num';
      num.textContent = i + 1;
      dot.parentNode.replaceChild(num, dot);
    }
  });

  document.getElementById("left").addEventListener("click", e => {
    const head = e.target.closest(".card-head");
    if (head) head.closest(".card").classList.toggle("collapsed");
  });

  if (el.checkoutBtnTop) el.checkoutBtnTop.addEventListener("click", doSendEmail);
})();
