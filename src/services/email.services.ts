import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { generateToken } from "../utils/auth.utils";

dotenv.config();


export const sendConfirmationEmail = async ({email, name, token}: {email: string, name: string, token:string}): Promise<void> => {
    try {
        const sendgridKey = process.env.SENDGRID_API_KEY;
        if (!sendgridKey) {
            throw new Error("SENDGRID_API_KEY not configured");
        }

        sgMail.setApiKey(sendgridKey);

        const confirmationUrl = `${process.env.BASE_URL || "http://localhost:3000"}/verify-email?token=${token}`;

        const message = {
            to: email,
            from: process.env.FROM_EMAIL || "no-reply@finai.com",
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

        await sgMail.send(message);
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        throw new Error("Failed to send confirmation email");
    }
};
