const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const TO_EMAIL   = process.env.MAIL_TO   || 'sales@evolutionid.com';
const FROM_EMAIL = process.env.MAIL_FROM || 'idfmatrix@evolutionid.com';

// POST /api/send-email
// Body: { subject, csvContent, customerName, customerEmail, projectName }
router.post('/', async (req, res) => {
  const { subject, csvContent, customerName, customerEmail, projectName } = req.body;
  if (!csvContent) return res.status(400).json({ error: 'Kein CSV-Inhalt' });

  const filename = `idfmatrix-${(projectName || 'konfiguration').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const recipients = customerEmail ? [TO_EMAIL, customerEmail] : [TO_EMAIL];
    await resend.emails.send({
      from: FROM_EMAIL,
      to:   recipients,
      replyTo: customerEmail || undefined,
      subject: subject || `Neue IDfMatrix Anfrage – ${projectName || 'Konfiguration'}`,
      html: `
        <p>Neue Konfigurationsanfrage über den IDfMatrix Konfigurator.</p>
        <ul>
          <li><b>Projekt:</b> ${escapeHtml(projectName || '–')}</li>
          <li><b>Kunde:</b> ${escapeHtml(customerName || '–')}</li>
          <li><b>E-Mail:</b> ${escapeHtml(customerEmail || '–')}</li>
        </ul>
        <p>Die Konfiguration ist als CSV im Anhang.</p>
      `,
      attachments: [
        {
          filename,
          content: Buffer.from('\uFEFF' + csvContent).toString('base64'),
        }
      ],
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('E-Mail-Fehler:', err);
    res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' });
  }
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

module.exports = router;
