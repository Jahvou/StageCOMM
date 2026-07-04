const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendInviteEmail = async (toEmail, orgName, inviteToken) => {
  const inviteLink = `https://expo.dev/preview/update?message=final%3A+all+fixes+deployed&updateRuntimeVersion=1.0.0&createdAt=2026-06-12T04%3A10%3A46.371Z&slug=exp&projectId=4f654b8f-5f47-4a96-9535-f19b83508a8a&group=22659ef4-e3ff-42f4-ac7f-63c6b9ede3b8&token=${inviteToken}`;

  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `You've been invited to join ${orgName} on StageCOMM`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">You've been invited to StageCOMM</h2>
        <p>You've been invited to join <strong>${orgName}</strong> on StageCOMM — a real-time communication app for live productions.</p>
        <p>Tap the button below to accept your invitation:</p>
        <a href="${inviteLink}" style="
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Accept Invitation</a>
        <p style="color: #888; font-size: 12px;">Your invite token: <strong>${inviteToken}</strong></p>
        <p style="color: #888; font-size: 12px;">This invitation expires in 24 hours.</p>
      </div>
    `,
  };

  await sgMail.send(msg);
};

module.exports = { sendInviteEmail };