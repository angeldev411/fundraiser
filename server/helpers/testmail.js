'use strict';
// import s3 from 's3';
import Mailer from './mailer';
import config from '../config';

const templateContent = [{
    name: 'example name',
    content: 'example content',
}];

const text = '';
const subject = 'Welcome to Raiserve';
const message = {
    text,
    subject,
    from_email: 'message.from_email@example.com',
    from_name: 'Example Name',
    to: [{
        email: 'adrien.kuhn@osedea.com',
        name: 'Recipient Name',
        type: 'to',
    }],
    headers: {
        'Reply-To': 'message.reply@example.com',
    },
    merge: true,
    merge_language: 'mailchimp',
    global_merge_vars: [{
        name: 'message',
        content: 'merge1 content',
    }],
};


Mailer.sendTemplate(message, 'mandrill-template', templateContent);
