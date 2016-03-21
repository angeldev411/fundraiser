'use strict';
import mandrill from 'mandrill-api';
import config from '../config';

const mandrillClient = new mandrill.Mandrill(config.MANDRILL_API_KEY);

export default class mailer {
    static sendEmail(content = {}, recipients = [], callback, callbackError) {
        const message = {
            text: (content.body || ''),
            subject: (content.subject || 'no subject'),
            from_email: (content.from || 'support@raiserve.org'),
            from_name: (content.fromname || 'Raiserve'),
            to: [],
        };

        for (let i = 0; i < recipients.length; i++) {
            message.to.push({
                email: recipients[i].email,
                name: `${recipients[i].firstName} ${recipients[i].lastName}`,
                type: 'to',
            });
        }

        return mandrillClient.messages.send({
            message,
            async: true,
        }, (result) => {
            console.log('Mandrill', result);
            callback(result);
        }, (e) => {
            console.log(`A mandrill error occurred: ${e.name} - ${e.message}`);
            callbackError(e);
        });
    }

    static sendTemplate(message, templateName, templateContent = []) {
        // we don't use templateContent for now, just merge tags
        message = {
            ...message,
            from_email: 'support@raiserve.org',
            from_name: 'Raiserve',
            headers: {
                'Reply-To': 'support@raiserve.org',
            },
            merge: true,
            merge_language: 'mailchimp',
        };

        mandrillClient.messages.sendTemplate(
            {
                template_name: templateName,
                template_content: templateContent,
                message,
                async: true,
            },
            (result) => {
                console.log('Mandrill', result);
                return Promise.resolve(result);
            },
            (e) => {
                console.log(`A mandrill error occurred: ${e.name} - ${e.message}`);
                return Promise.reject(e);
            }
        );
    }
}
