'use strict';

const express = require('express');
const route = express.Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

route.get('/', (req, res) => res.render('home') );

route.post('/send_mail', async (req, res) => {
    
    let { email, subject, message } = req.body;
    let errors = [];
    
    if (!email ) {
        errors.push({ message: 'Email Field Cannot Be Empty' });
    
    } else if (!subject) {
        errors.push({ message: 'Subject Field Cannot Be Empty' });
    
    } else if (!message) {
        errors.push({ message: 'Message Field Cannot Be Empty' });
    
    } else if (errors.length > 0) {
        res.render('home', {
            errors,
            email, 
            subject, 
            message
        });
    
    } else {

        let transporter =  nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: process.env.GMAIL_PORT,
            secure: true,
            auth: { user: process.env.GMAIL_USERNAME, pass: process.env.GMAIL_PASSWORD },
            tls: {
                rejectUnauthorized: false
            },
            debug: true,
        });

        transporter.verify((error, success) => {
            if(error) console.log({ message: error });

            if(success) console.log(`Server is ready to take our messages.`);
        });

        let info =  {
            from: `<Your-Desired-Username-goes-here> <${process.env.GMAIL_USERNAME}>`,
            to: email,
            subject: subject, 
            text: message 
            // html: "<b>Hello world?</b>" // html body
        };

        console.log(info);
        
        return transporter.sendMail(info, (error, callback) => {

            if(error) console.log({ message: error });

            console.log({
                "Accepted": callback.accepted,
                "Response": callback.response,
                "Message ID": callback.messageId,
                "Preview URL": nodemailer.getTestMessageUrl(callback)
            });

            res.redirect('/');
        });
    }

    return res.render('home', {
        errors,
        email, 
        subject, 
        message
    });
});

module.exports = route;