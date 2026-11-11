
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// Contact form API
app.post('/api/contact', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    // Check form details
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter your name.' });
    }

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Please enter a valid email.' });
    }

    if (!message || message.trim().length < 10) {
        return res.status(400).json({ error: 'Message must be at least 10 characters.' });
    }

    try {
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = Number(process.env.SMTP_PORT) || 465;

        // Send email if SMTP details are available
        if (smtpHost && smtpUser && smtpPass) {

            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass
                }
            });

            await transporter.sendMail({
                from: smtpUser,
                to: process.env.MAIL_TO || smtpUser,
                replyTo: email,
                subject: 'New message from ' + name,
                text: name + '\n' + email + '\n\n' + message
            });

        } else {
            // Save message in a JSON file if email is not configured
            const filePath = path.join(__dirname, 'messages.json');

            let messages = [];

            if (fs.existsSync(filePath)) {
                messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }

            messages.push({
                name: name,
                email: email,
                message: message,
                date: new Date().toISOString()
            });

            fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
        }

        res.json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Something went wrong. Please try again.'
        });
    }
});

// Serve frontend files
const distFolder = path.join(__dirname, '../client/dist');

if (fs.existsSync(distFolder)) {
    app.use(express.static(distFolder));

    app.get('*', (req, res) => {
        res.sendFile(path.join(distFolder, 'index.html'));
    });
}

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
