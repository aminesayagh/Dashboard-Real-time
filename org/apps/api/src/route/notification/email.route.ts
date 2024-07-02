import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import { z } from 'zod';

import express from 'express';
import { ApiResponse, ApiRequest } from "../../types/Api";

const router = express.Router();

const zodPostEmail = z.object({
    to: z.string().email(),
    subject: z.string().min(10),
    body: z.string().min(10),
    text: z.string().optional(),
});

import { USER_MAILER_USER, USER_MAILER_PASSWORD } from '../../env';   
import { ERRORS, MESSAGE } from '../../constants/MESSAGE';

interface EmailResponse {
    message: typeof MESSAGE.EMAIL_SENT;
    info: any;
}
router.post('/send', async (req: ApiRequest<z.infer<typeof zodPostEmail>>, res: ApiResponse<EmailResponse>) => {
    try {
        const { to, subject, body, text } = zodPostEmail.parse(req.body);
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: USER_MAILER_USER,
                pass: USER_MAILER_PASSWORD,
            },
        });

        const mailOptions: Mail.Options = {
            from: USER_MAILER_USER,
            to,
            subject,
            text: text || body,
            html: body,
            attachDataUrls: true,
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            } else {
                res.status(200).json({ status: 'success', data: {message: MESSAGE.EMAIL_SENT, info} });
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error',message: ERRORS.INTERNAL_SERVER_ERROR });
    }
});

export default router;