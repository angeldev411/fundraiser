'use strict';
// import s3 from 's3';
import Mailer from './mailer';

const subject = 'Welcome to Raiserve';

const text = `
Congrats on joining team #teamname. Your hour will now make twice the difference as you raise money for #orgname.
Call to action is to Share Share Share.
you can email this #yourlink
or post that link on facebook, twitter etc
remember it takes a few tries to get people.. our best fundraise share and email potential sponsors every month with an update them after they volunteer
Don’t forget to record your hours
you can click here to get to your dashboard to record them
`;
const plainText = `
Congrats on joining team #teamname. Your hour will now make twice the difference as you raise money for #orgname.
Call to action is to Share Share Share.
you can email this #yourlink
or post that link on facebook, twitter etc
remember it takes a few tries to get people.. our best fundraise share and email potential sponsors every month with an update them after they volunteer
Don’t forget to record your hours
you can click here to get to your dashboard to record them
`;

const message = {
    text: plainText,
    subject,
    to: [{
        email: 'adrien.kuhn@osedea.com',
        name: 'Adrien Kühn',
        type: 'to',
    }],
    global_merge_vars: [
        {
            name: 'headline',
            content: subject,
        },
        {
            name: 'message',
            content: text,
        },
    ],
};

Mailer.sendTemplate(message, 'mandrill-template');
