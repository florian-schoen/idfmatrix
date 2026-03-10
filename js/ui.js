// Abhängig von: config.js, cart.js, app.js (state, el)

function fmt(n) { return n.toLocaleString("de-DE", { style:"currency", currency:"EUR" }); }
function escapeHTML(str) { return (str||"").toString().replace(/[&<>]/g, c => c==='&'?'&amp;':(c==='<'?'&lt;':'&gt;')); }
function kv(k, v) { return '<div class="kv"><div class="k">'+escapeHTML(k)+'</div><div class="v">'+escapeHTML(v)+'</div></div>'; }

function radioCards(container, name, options, value, onChange) {
  container.innerHTML = "";
  options.forEach(opt => {
    const wrap = document.createElement("label");
    wrap.className = "radio-card" + (value === opt.key ? " active" : "");
    wrap.tabIndex = 0;
    wrap.addEventListener("click", () => onChange(opt.key));
    wrap.addEventListener("keydown", e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); onChange(opt.key); } });
    const title = document.createElement("div"); title.style.fontWeight="600"; title.textContent = opt.label;
    wrap.appendChild(title);
    container.appendChild(wrap);
  });
}

function checkCards(container, name, options, values, onToggle) {
  container.innerHTML = "";
  options.forEach(opt => {
    const wrap = document.createElement("label");
    const isOn = !!values[opt.key];
    wrap.className = "check-card" + (isOn ? " active" : "");
    wrap.style.display = "block";
    const title = document.createElement("div"); title.style.fontWeight="600"; title.textContent = opt.label;
    wrap.appendChild(title);
    wrap.addEventListener("click", () => onToggle(opt.key, !isOn));
    container.appendChild(wrap);
  });
}

function addCartItem(container, item) {
  const box = document.createElement("div");
  box.className = "radio-card";
  if (item.warnIfLess != null && item.qty < item.warnIfLess) box.style.borderColor = "#ef4444";

  const top = document.createElement("div");
  top.style.display="flex"; top.style.justifyContent="space-between"; top.style.alignItems="flex-start"; top.style.gap="10px";
  const left = document.createElement("div");
  const nameEl = document.createElement("div"); nameEl.style.fontWeight="600"; nameEl.textContent = item.name;
  left.appendChild(nameEl);
  if (item.sku)  { const sku  = document.createElement("div"); sku.className="muted";  sku.style.fontSize="12px"; sku.textContent = "Art.-Nr.: "+item.sku; left.appendChild(sku); }
  if (item.note) { const note = document.createElement("div"); note.className="muted"; note.style.whiteSpace="pre-wrap"; note.style.marginTop="4px"; note.textContent = item.note; left.appendChild(note); }

  const right = document.createElement("div"); right.style.textAlign="right"; right.style.flexShrink="0";
  const qtyLabel = item.isPmDays ? "Tage" : "Menge";

  if (item.editable && item.stateKey) {
    const inp = document.createElement("input");
    inp.type="number"; inp.min="1"; inp.value=item.qty; inp.style.cssText="max-width:80px; margin:4px 0 0;";
    inp.addEventListener("change", e => {
      const v = Math.max(1, parseInt(e.target.value||'1', 10));
      state[item.stateKey] = v; e.target.value = v; update();
    });
    const qtyRow = document.createElement("div"); qtyRow.style.cssText="display:flex;align-items:center;gap:8px;margin-top:8px;";
    const qtyLbl = document.createElement("div"); qtyLbl.className="label"; qtyLbl.style.cssText="margin:0;white-space:nowrap;font-size:13px;";
    qtyLbl.textContent = qtyLabel+":";
    qtyRow.appendChild(qtyLbl); qtyRow.appendChild(inp);
    if (item.deletable && item.deleteKey) {
      const del = document.createElement("button"); del.className="cart-item-del"; del.style.marginLeft="8px"; del.textContent="✕ entfernen";
      del.addEventListener("click", () => { state[item.deleteKey] = true; update(); });
      qtyRow.appendChild(del);
    }
    if (item.price != null) {
      right.innerHTML = '<span class="muted" style="font-size:12px;">'+fmt(item.price)+' x '+item.qty+'<br>= <b>'+fmt(item.price * item.qty)+'</b></span>';
    }
    top.appendChild(left); top.appendChild(right); box.appendChild(top); box.appendChild(qtyRow);
    container.appendChild(box); return;
  }

  right.innerHTML = qtyLabel+': <b>'+item.qty+'</b>';
  if (item.price != null) {
    right.innerHTML += '<br><span class="muted" style="font-size:12px;">'+fmt(item.price)+' x '+item.qty+'<br>= <b>'+fmt(item.price * item.qty)+'</b></span>';
  }

  if (item.warnIfLess != null && item.qty < item.warnIfLess) {
    const warn = document.createElement("div"); warn.className="warn"; warn.style.marginTop="6px"; warn.style.fontSize="12px";
    warn.textContent = "Für Ausweiserstellung mit Druck & Codierung muss der Drucker per USB-Kabel mit dem PC der Ausweiserstellung verbunden werden. Pro Ausweiserstellung ist daher i.d.R. min. ein Drucker erforderlich – bitte prüfen!";
    top.appendChild(left); top.appendChild(right); box.appendChild(top); box.appendChild(warn);
    container.appendChild(box); return;
  }

  top.appendChild(left); top.appendChild(right);
  box.appendChild(top);
  container.appendChild(box);
}

function renderMaint() {
  const items = buildMaintItems();
  el.maintItems.innerHTML = "";
  if (items.length === 0) {
    el.maintItems.innerHTML = '<div class="muted" style="font-size:13px;">Keine wartungspflichtigen Artikel im Warenkorb.</div>';
    el.maintTotal.innerHTML = "";
    return;
  }
  items.forEach(it => {
    const box = document.createElement("div"); box.className = "radio-card"; box.style.marginBottom = "6px";
    const top = document.createElement("div"); top.style.cssText = "display:flex;justify-content:space-between;align-items:flex-start;gap:10px;";
    const left = document.createElement("div");
    const nameEl = document.createElement("div"); nameEl.style.fontWeight = "600"; nameEl.textContent = it.name;
    const skuEl  = document.createElement("div"); skuEl.className  = "muted"; skuEl.style.fontSize  = "12px"; skuEl.textContent  = "Art.-Nr.: " + it.sku;
    const noteEl = document.createElement("div"); noteEl.className = "muted"; noteEl.style.fontSize = "12px";
    noteEl.textContent = it.baseQty + " Lizenz" + (it.baseQty !== 1 ? "en" : "") + " × " + it.years + " Jahre";
    left.appendChild(nameEl); left.appendChild(skuEl); left.appendChild(noteEl);
    const right = document.createElement("div"); right.style.cssText = "text-align:right;flex-shrink:0;font-size:13px;";
    right.innerHTML = "Menge: <b>" + it.qty + "</b>";
    if (it.price != null) right.innerHTML += '<br><span class="muted" style="font-size:12px;">' + fmt(it.price) + ' × ' + it.qty + ' = <b>' + fmt(it.price * it.qty) + '</b></span>';
    top.appendChild(left); top.appendChild(right); box.appendChild(top);
    el.maintItems.appendChild(box);
  });
  const total = items.reduce((s, it) => s + (it.price != null ? it.price * it.qty : 0), 0);
  if (total > 0) el.maintTotal.innerHTML = '<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid var(--border);margin-top:8px;"><b>Gesamtpreis <span style="color:var(--muted);font-weight:400;font-size:12px;">(Netto)</span></b><b>' + fmt(total) + '</b></div>';
  else el.maintTotal.innerHTML = '<div class="muted" style="font-size:12px;margin-top:8px;">Preise werden separat kommuniziert.</div>';
}

function renderCart() {
  renderMaint();
  const items = buildCartItems();
  el.cartItems.innerHTML = "";
  items.forEach(it => addCartItem(el.cartItems, it));
  el.cartCount.textContent = items.length + " Positionen";

  const totalPrice = items.reduce((sum, it) => sum + (it.price != null ? it.price * it.qty : 0), 0);
  if (el.cartTotal) el.cartTotal.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:2px solid var(--border);margin-top:8px;"><b>Gesamtpreis <span style=\"color:var(--muted);font-weight:400;font-size:12px;\">(Netto)</span></b><b>'+fmt(totalPrice)+'</b></div>';

  // Kundendaten-Box
  const parts = [];
  parts.push(kv("Projekt", state.projName || "–"));
  const contactName = [state.firstName, state.lastName].filter(Boolean).join(" ");
  if (contactName)     parts.push(kv("Kontakt", contactName));
  if (state.email)     parts.push(kv("E\u2011Mail", state.email));
  if (state.phone)     parts.push(kv("Telefon", state.phone));
  el.customerBox.innerHTML = '<div class="radio-card" style="background:#f9fafb;">'+parts.join("")+'</div>';

  // Hinweise
  const hints = [];
  if (/codierung/.test(state.a1Variant)) hints.push("Vorabklärung Codierung empfohlen – sales@evolutionid.com");
  if (state.a2Variant === "mit" && state.a2Camera === "none") hints.push("Keine Kamera: Bild-Uploads möglich bzw. USB\u2011Webcam nutzbar.");
  if (state.a2Variant === "mit" && state.a2KI) hints.push("KI\u2011Modul: leistungsfähiger PC empfohlen (idealerweise mit Grafikchip).");
  if (state.a1Variant === "druck_codierung" && state.a3Printer === "none") hints.push("Kein Drucker bei 'Druck & Codierung' – bitte sales@evolutionid.com kontaktieren.");
  if (state.a2Variant === "mit" && state.a2Work < state.a1Work) hints.push("Hinweis: Bilderfassung-Arbeitsplätze sind geringer als Ausweiserstellung – bitte prüfen.");
  el.cartHints.innerHTML = hints.map(h => '<div class="hint" style="margin-top:6px;">'+escapeHTML(h)+'</div>').join("");

  // Allgemeine Notizen
  if (state.notes && state.notes.trim() !== "") {
    const box = document.createElement("div"); box.className = "radio-card";
    const title = document.createElement("div"); title.style.fontWeight="600"; title.textContent = "Allgemeine Notizen";
    const txt = document.createElement("div"); txt.className="muted"; txt.style.whiteSpace="pre-wrap"; txt.style.marginTop="4px"; txt.textContent = state.notes;
    box.appendChild(title); box.appendChild(txt);
    el.cartItems.appendChild(box);
  }
}

function update() {
  // Projekt-Pflichtfeld
  const validProject = state.projName.trim().length > 0;
  el.projWarn.style.display = validProject ? "none" : "block";

  // A1
  el.a1Options.className = "row row-3" + (!state.a1Variant ? " danger-ring" : "");
  radioCards(el.a1Options, "a1", A1, state.a1Variant, setA1);
  el.a1UsbHint.style.display = state.a1Variant === "druck_codierung" ? "block" : "none";
  const hasPro = /codierung/.test(state.a1Variant);
  el.a1LettershopRow.style.display = hasPro ? "block" : "none";
  el.a1Lettershop.checked = state.a1Lettershop;
  const needsTech = /codierung/.test(state.a1Variant);
  el.techBlock.style.display = needsTech ? "block" : "none";
  el.techCards.className = "row row-3" + (needsTech && !hasTech() ? " danger-ring" : "");
  checkCards(el.techCards, "tech", TECH, state.tech, toggleTech);
  el.techWarn.style.display = (needsTech && !hasTech()) ? "block" : "none";

  // A2
  el.a2Options.className = "row row-2" + (!state.a2Variant ? " danger-ring" : "");
  radioCards(el.a2Options, "a2", A2, state.a2Variant, v => { setA2(v); });
  el.a2Extras.style.display = (state.a2Variant === "mit") ? "block" : "none";
  if (state.a2Variant === "mit") {
    el.a2Cameras.className = "row row-3" + (!state.a2Camera ? " danger-ring" : "");
    radioCards(el.a2Cameras, "cam", CAM, state.a2Camera, setCam);
    el.a2NoCamHint.style.display = (state.a2Camera === "none") ? "block" : "none";
    el.a2KIHint.style.display = state.a2KI ? "block" : "none";
    el.a2MismatchLess.style.display = (state.a2Work < state.a1Work) ? "block" : "none";
  }

  // A3
  el.a3Printers.className = "row row-3" + (!state.a3Printer ? " danger-ring" : "");
  radioCards(el.a3Printers, "a3", A3, state.a3Printer, setA3);
  const needsCodeReader = /codierung/.test(state.a1Variant);
  el.a3CodeReaderCard.style.display = needsCodeReader ? "" : "none";
  if (needsCodeReader) {
    el.a3CodeReaderOptions.className = "row row-2" + (!state.a3CodeReader ? " danger-ring" : "");
    radioCards(el.a3CodeReaderOptions, "codeReader", CODEREADER, state.a3CodeReader, setCodeReader);
  }
  const showRibbon = state.a3Printer === "direkt";
  el.a3RibbonWrapper.style.display = showRibbon ? "" : "none";
  if (showRibbon) { el.ribbonColor.checked = state.a3Ribbon === "color"; el.ribbonBlack.checked = state.a3Ribbon === "black"; }
  el.a3NeedContact.style.display = (/codierung/.test(state.a1Variant) && state.a3Printer === "none") ? "block" : "none";

  // A5
  el.a5Options.className = "row row-2" + (!state.a5Umsetzung ? " danger-ring" : "");
  radioCards(el.a5Options, "a5", A5, state.a5Umsetzung, setA5);
  el.a5RemoteHint.style.display = state.a5Umsetzung === "remote"  ? "block" : "none";
  el.a5OnsiteHint.style.display = state.a5Umsetzung === "vor_ort" ? "block" : "none";

  // PM Tage
  const autoPm = 1 + Math.max(0, (state.a1Work||1) - 1) * 0.5;
  if (state.pmDays === null) el.pmDaysInput.value = autoPm;

  // Warenkorb
  renderCart();

  // E-Mail Validierung
  const emailFilled = state.email && state.email.trim().length > 0;
  const emailValid  = emailFilled && isValidEmail(state.email);
  el.emailWarn.style.display = (emailFilled && !isValidEmail(state.email)) ? "block" : "none";

  // Status + Buttons
  const valid = isValid();
  el.checkoutBtn.disabled = !valid;
  if (el.checkoutBtnTop) el.checkoutBtnTop.disabled = !valid;
  el.statusText.textContent = valid
    ? "Konfiguration vollständig. Anfrage absenden m\u00f6glich."
    : (emailFilled && !isValidEmail(state.email)) ? "Bitte eine g\u00fcltige E-Mail-Adresse eingeben."
    : (!emailFilled) ? "Bitte E-Mail-Adresse (Partnerinformation) eingeben."
    : (validProject ? "Bitte alle Pflichtauswahlen treffen." : "Bitte Projektname eingeben.");
}
