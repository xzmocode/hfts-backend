// src/utils/templates.js
export const templates = {
  email: {
    subject: (name, attackType) =>
      `Payment Failure Notice for Invoice #${Math.floor(Math.random() * 90000) + 10000}`,
    body: (name, role, attackType) => `
      <p>Hi ${name},</p>
      <p>We were unable to process payment for <b>Invoice #${Math.floor(Math.random() * 90000) + 10000}</b>.
      Please review the attached statement and submit payment to avoid service interruption.</p>
      <p><a href="https://example.com/training/redirect" target="_blank">Review invoice</a></p>
      <hr/>
      <p style="color:#666;font-size:12px">
        This is a training simulation by your Security Team.
      </p>
    `,
  },
};

