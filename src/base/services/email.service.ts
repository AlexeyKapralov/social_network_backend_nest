import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
    sendConfirmationCode (email: string, subject: string, html: string) {
        let transport = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                //todo логин и пароль нужно засунуть в environment
                auth: {
                    user: 'alewka24@gmail.com',
                    pass: 'galiuvyhvtxmmpcj'
                }
            }
        )

        transport.sendMail({
            from: `"Alexey" <alewka24@gmail.com>`,
            to: email,
            subject,
            html,
        }).then(console.info).catch(console.error)
    }
}