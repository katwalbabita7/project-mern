// * 
const formatDate = (date:NativeDate)=>{
    return new Date(date).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}

// * send account created email
export const accountCreatedEmailHtml = (user: {
  fullName: string;
  email: string;
  createdAt: any;
}) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Created</title>
  </head>

  <body style="margin:0;padding:0;background-color:#F3F4F6;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:12px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td
                style="background:#4F46E5;padding:30px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;">
                  Welcome
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;">

                <h2 style="margin-top:0;color:#111827;">
                  Hello, ${user.fullName}
                </h2>

                <p style="font-size:16px;color:#4B5563;line-height:28px;">
                  Your account has been created successfully.
                </p>

                <table cellpadding="8" cellspacing="0" width="100%"
                  style="margin:25px 0;background:#F9FAFB;border-radius:8px;">
                  <tr>
                    <td><strong>Full Name</strong></td>
                    <td>${user.fullName}</td>
                  </tr>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>${user.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Created At</strong></td>
                    <td> ${formatDate(user.createdAt)}</td>
                  </tr>
                </table>

                <div style="text-align:center;margin:35px 0;">
                  <a
                    href="http://localhost:5173/login"
                    style="
                      background:#4F46E5;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:8px;
                      display:inline-block;
                      font-size:16px;
                      font-weight:bold;
                    ">
                    Login Now
                  </a>
                </div>

                <p style="font-size:15px;color:#6B7280;line-height:24px;">
                  Thank you for joining us. We are excited to have you as part of our community.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="background:#EEF2FF;padding:20px;text-align:center;color:#6B7280;font-size:14px;">
                © 2026 Your Company. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  return html;
};

// * send login detected email
export const loginDetectedEmailHtml = (user: {
  fullName: string;
  email: string;
  loginAt: any;
}) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Detected</title>
  </head>

  <body style="margin:0;padding:0;background-color:#F3F4F6;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:12px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:#4F46E5;padding:30px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;">
                  Login Detected
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;">

                <h2 style="margin-top:0;color:#111827;">
                  Hello, ${user.fullName}
                </h2>

                <p style="font-size:16px;color:#4B5563;line-height:28px;">
                  We detected a successful login to your account.
                </p>

                <table
                  cellpadding="8"
                  cellspacing="0"
                  width="100%"
                  style="margin:25px 0;background:#F9FAFB;border-radius:8px;">

                  <tr>
                    <td><strong>Full Name</strong></td>
                    <td>${user.fullName}</td>
                  </tr>

                  <tr>
                    <td><strong>Email</strong></td>
                    <td>${user.email}</td>
                  </tr>

                  <tr>
                    <td><strong>Login Time</strong></td>
                    <td>
                      ${formatDate(user.loginAt)}
                    </td>
                  </tr>

                </table>

                <p style="font-size:15px;color:#4B5563;line-height:24px;">
                  If this was you, no further action is required.
                </p>

                <p style="font-size:15px;color:#DC2626;line-height:24px;font-weight:bold;">
                  If you don't recognize this login, please change your password immediately and contact support.
                </p>

                <div style="text-align:center;margin:35px 0;">
                  <a
                    href="http://localhost:5173/login"
                    style="
                      background:#4F46E5;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:8px;
                      display:inline-block;
                      font-size:16px;
                      font-weight:bold;
                    ">
                    Secure My Account
                  </a>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="background:#EEF2FF;padding:20px;text-align:center;color:#6B7280;font-size:14px;">
                © 2026 Your Company. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  return html;
};