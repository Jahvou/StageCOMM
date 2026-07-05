const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendInviteEmail = async (toEmail, orgName, inviteToken) => {
  const deepLink = `https://stagecomm.onrender.com/invite?token=${inviteToken}`;
  const expoLink = `https://expo.dev/preview/update?message=final%3A+all+fixes+deployed&updateRuntimeVersion=1.0.0&createdAt=2026-06-12T04%3A10%3A46.371Z&slug=exp&projectId=4f654b8f-5f47-4a96-9535-f19b83508a8a&group=22659ef4-e3ff-42f4-ac7f-63c6b9ede3b8`;

  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `You've been invited to join ${orgName} on StageCOMM`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">You've been invited to StageCOMM</h2>
        <p>You've been invited to join <strong>${orgName}</strong> on StageCOMM.</p>
        <p>Tap the button below on your phone to accept:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${deepLink}" style="
            display: inline-block;
            background-color: #4f46e5;
            color: white;
            padding: 14px 28px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
          ">Accept Invitation</a>
        </div>
        <p style="color: #888; font-size: 13px;">
          If the button doesn't work, make sure you have the StageCOMM app installed via 
          <a href="${expoLink}">Expo Go</a> first, then tap the button again.
        </p>
        <p style="color: #888; font-size: 12px;">This invitation expires in 24 hours.</p>
      </div>
    `,
  };

  await sgMail.send(msg);
};

module.exports = { sendInviteEmail };