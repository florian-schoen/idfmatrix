const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const TO_EMAIL   = process.env.MAIL_TO   || 'info@evolutionid.com';
const FROM_EMAIL = process.env.MAIL_FROM || 'idfmatrix@evolutionid.com';

// POST /api/send-email
router.post('/', async (req, res) => {
  const { csvContent, cartHtml, firstName, lastName, customerEmail, phone, projectName, endkunde, unknownTech } = req.body;
  if (!csvContent) return res.status(400).json({ error: 'Kein CSV-Inhalt' });

  const partnerName = [firstName, lastName].filter(Boolean).join(' ');
  const filename = `idfmatrix-${(projectName || 'konfiguration').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`;
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // --- Endkunde-Block (falls vorhanden) ---
    let endkundeHtml = '';
    if (endkunde && Object.values(endkunde).some(v => v && v.trim())) {
      const endRows = [
        ['Firma',        endkunde.firma],
        ['Adresse',      [endkunde.strasse, endkunde.plz, endkunde.ort].filter(Boolean).join(', ')],
        ['Ansprechpartner', [endkunde.vorname, endkunde.nachname].filter(Boolean).join(' ')],
        ['E-Mail',       endkunde.email],
        ['Telefon',      endkunde.telefon],
      ].filter(([, v]) => v).map(([k, v]) =>
        `<tr><td style="padding:5px 12px 5px 0;color:#666;white-space:nowrap;"><b>${esc(k)}</b></td><td style="padding:5px 0;">${esc(v)}</td></tr>`
      ).join('');
      endkundeHtml = `
        <h3 style="color:#1a3a6e;border-bottom:2px solid #1a3a6e;padding-bottom:4px;margin-top:24px;">Endkunde</h3>
        <table style="border-collapse:collapse;font-size:14px;">${endRows}</table>`;
    }

    // --- Interne E-Mail an evolutionID ---
    const infoRows = [
      ['Projektname', projectName],
      ['Vorname',     firstName],
      ['Nachname',    lastName],
      ['E-Mail',      customerEmail],
      ['Telefon',     phone],
    ].filter(([, v]) => v).map(([k, v]) =>
      `<tr><td style="padding:5px 12px 5px 0;color:#666;white-space:nowrap;"><b>${esc(k)}</b></td><td style="padding:5px 0;">${esc(v)}</td></tr>`
    ).join('');

    await resend.emails.send({
      from: FROM_EMAIL,
      to:   [TO_EMAIL],
      replyTo: customerEmail || undefined,
      subject: `Neue IDfunction MATRIX Anfrage – ${esc(projectName || 'Konfiguration')}`,
      html: `
        <div style="font-family:sans-serif;max-width:800px;">
          <p style="font-size:16px;">Liebe Kollegen,</p>
          <p>eine neue Anfrage für <b>IDfunction MATRIX</b> ist eingetroffen:</p>

          <h3 style="color:#1a3a6e;border-bottom:2px solid #1a3a6e;padding-bottom:4px;margin-top:24px;">Partnerinformationen</h3>
          <table style="border-collapse:collapse;font-size:14px;">${infoRows}</table>
          ${endkundeHtml}

          <h3 style="color:#1a3a6e;border-bottom:2px solid #1a3a6e;padding-bottom:4px;margin-top:24px;">Konfiguration</h3>
          ${cartHtml || ''}

          <p style="margin-top:24px;color:#666;font-size:13px;">Die vollständige Konfiguration ist als CSV im Anhang.</p>
        </div>
      `,
      attachments: [{
        filename,
        content: Buffer.from('\uFEFF' + csvContent).toString('base64'),
      }],
    });

    // --- Kunden-E-Mail (nur wenn E-Mail angegeben) ---
    if (customerEmail) {
      const greeting = partnerName ? `Sehr geehrte/r ${esc(partnerName)},` : 'Sehr geehrter Kunde,';
      const unknownTechBlock = unknownTech ? `
        <div style="margin:20px 0;padding:14px 18px;background:#fff8e1;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;font-size:14px;line-height:1.6;">
          <b style="color:#92400e;">&#9888;&#65039; Hinweis: Ausweistechnologie Ihres Endkunden unbekannt</b><br><br>
          Damit wir die passende Codierlösung für Ihr Projekt konfigurieren können, benötigen wir <b>3 bereits codierte Musterausweise</b> Ihres Endkunden zur technischen Analyse. Nach Auswertung der Ausweise werden wir Sie über die eingesetzte Technologie informieren und die Konfiguration entsprechend anpassen.<br><br>
          <b>Bitte senden Sie die Ausweise an:</b><br>
          evolutionID GmbH<br>
          ${projectName ? `c/o ${esc(projectName)}<br>` : ''}
          Leonrodstr. 58<br>
          80636 München
        </div>` : '';

      const emailFooter = `
        <hr style="margin:32px 0 20px;border:none;border-top:1px solid #e0e0e0;">
        <div style="font-size:11px;color:#888;line-height:1.7;">
          <p style="margin:0 0 4px;"><b>Disclaimer / Hinweise:</b></p>
          <p style="margin:0 0 10px;">
            Die im Konfigurator sowie in dieser E-Mail enthaltenen Preise und Preisinformationen sind ausschließlich
            für die Bosch Sicherheitssysteme GmbH bestimmt und basieren auf dem bestehenden Partnervertrag.
            Eine Weitergabe von Partnerpreisen, Zugangsdaten oder sonstigen Preisinformationen an Dritte außerhalb
            der Bosch-Organisation ist nicht gestattet.
          </p>
          <p style="margin:0 0 10px;">
            Alle angegebenen Preise stellen unverbindliche Schätzwerte auf Basis der übermittelten
            Konfigurationsdaten dar und sind kein verbindliches Angebot im Sinne des § 145 BGB. Endpreise können
            je nach finaler Spezifikation, Stückzahl und individuellen Projektanforderungen abweichen.
            Ein verbindliches Angebot erfolgt erst nach Prüfung durch den Vertrieb.
          </p>
          <p style="margin:0;">
            Mit dem Absenden der Anfrage über den Konfigurator stimmen Sie der Verarbeitung Ihrer
            personenbezogenen Daten (z.&nbsp;B. Name, Kontaktdaten und konfigurationsbezogene Angaben) zur
            Bearbeitung Ihrer Anfrage zu. Die Verarbeitung erfolgt auf Grundlage von Art.&nbsp;6 Abs.&nbsp;1
            lit.&nbsp;b DSGVO, ausschließlich zu diesem Zweck, ohne Weitergabe an Dritte, und unter Einhaltung
            der gesetzlichen Aufbewahrungsfristen. Weitere Informationen finden Sie in der
            <a href="https://www.evolutionid.com/datenschutz" style="color:#1a3a6e;">Datenschutzerklärung</a>.
          </p>
        </div>`;

      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      [customerEmail],
        subject: `Ihre IDfunction MATRIX Anfrage – ${esc(projectName || 'Konfiguration')}`,
        html: `
          <div style="font-family:sans-serif;max-width:800px;">
            <p style="font-size:16px;">${greeting}</p>
            <p>vielen Dank für Ihre Anfrage. Wir haben Ihre Konfiguration erhalten und werden uns umgehend bei Ihnen melden.</p>
            ${projectName ? `<p><b>Projektname:</b> ${esc(projectName)}</p>` : ''}
            ${endkundeHtml}
            ${unknownTechBlock}

            <h3 style="color:#1a3a6e;border-bottom:2px solid #1a3a6e;padding-bottom:4px;margin-top:24px;">Ihre Konfiguration</h3>
            ${cartHtml || ''}

            <p style="margin-top:24px;">Mit freundlichen Grüßen<br><b>Ihr evolutionID Team</b></p>
            ${emailFooter}
          </div>
        `,
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('E-Mail-Fehler:', err);
    res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' });
  }
});

function esc(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

module.exports = router;
