import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
export const sendConfirmationEmail = async ({ email, name, token }) => {
    try {
        const sendgridKey = process.env.SENDGRID_API_KEY;
        const fromEmail = process.env.FROM_EMAIL;
        console.log(fromEmail);
        if (!sendgridKey) {
            console.error("SENDGRID_API_KEY is not set in environment variables");
            throw new Error("SENDGRID_API_KEY not configured");
        }
        if (!fromEmail) {
            console.error("FROM_EMAIL is not set in environment variables");
            throw new Error("FROM_EMAIL not configured");
        }
        sgMail.setApiKey(sendgridKey);
        const confirmationUrl = `${process.env.BASE_URL || "http://localhost:3000"}/auth/verify-email?token=${token}`;
        const message = {
            to: email,
            from: fromEmail,
            subject: "Confirm Your Email Address",
            text: `Please confirm your email by clicking this link: ${confirmationUrl}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to FinAI!</h2>
                    <p>Hi ${name || "User"},</p>
                    <p>Thank you for signing up! Please confirm your email address to get started.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${confirmationUrl}" 
                           style="background-color: #007bff; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Click here to verify your account
                        </a>
                    </div>
                    <p>If you didn't create this account, you can safely ignore this email.</p>
                    <p>Best regards,<br>The FinAI Team</p>
                </div>
            `
        };
        console.log(`Attempting to send email to ${email} from ${fromEmail}`);
        const response = await sgMail.send(message);
        console.log(`Confirmation email successfully sent to ${email}. Response:`, response[0].statusCode);
    }
    catch (error) {
        console.error(" Error sending confirmation email:", {
            message: error.message,
            code: error.code,
            response: error.response?.body || error.response
        });
        throw error;
    }
};
