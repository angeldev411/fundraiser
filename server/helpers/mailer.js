import mandrill from 'mandrill-api';
import config from '../config';

const mandrillClient = new mandrill.Mandrill(config.MANDRILL_API_KEY);

module.exports = class mailer {
    static sendEmail(content = {}, consts = []) {
        const message = {
            text: (content.body || ''),
            subject: (content.subject || 'no subject'),
            from_email: (content.from || 'support@raiserve.org'),
            from_name: (content.fromname || 'raiserve'),
            merge_consts: [{
                rcpt: content.to,
                consts,
            }],
            to: [{
                email: content.to,
                name: content.toname,
                type: 'to',
            }],
        };

        mandrillClient.messages.send({
            message,
            async: true,
        }, (result) => {
            console.log(result);
            return Promise.resolve(result);
        }, (e) => {
            console.log(`A mandrill error occurred: ${e.name} - ${e.message}`);
            return Promise.reject(e);
        });
    }

    static sendTemplate(message, templateName, templateContent) {
        mandrillClient.messages.sendTemplate(
            {
                templateName,
                templateContent,
                message,
                async: true,
            },
            (result) => {
                console.log(result);
                return Promise.resolve(result);
            },
            (e) => {
                console.log(`A mandrill error occurred: ${e.name} - ${e.message}`);
                return Promise.reject(e);
            }
        );
    }

    // TODO: Fill body, subject, and stuff here.
    static sendInvite(invite) {
        console.log(`INVITING team volunteer ${JSON.stringify(invite)}`);
        const templateName = 'volunteer-invite';
        const templateContent = [];

        const message = {
            text: (invite.body || 'Welcome to the team!'),
            subject: (invite.subject || 'Join the team - Raiserve'),
            from_email: (invite.from || 'support@raiserve.org'),
            from_name: (invite.fromName || 'Raiserve'),
            merge_language: 'handlebars',
            merge_consts: [{
                rcpt: invite.to,
                consts: [
                    {
                        name: 'first_name',
                        content: invite.first_name,
                    },
                    {
                        name: 'org_name',
                        content: invite.org_name,
                    },
                    {
                        name: 'onboard_url',
                        content: invite.onboard_url,
                    },
                ],
            }],
            to: [{
                email: invite.to,
                name: invite.toName,
                type: 'to',
            }],
        };

        this.sendTemplate(message, templateName, templateContent);
    }

    // TODO
    static sendPasswordReset(user) {
        return mailer.sendEmail({});
    }

    // TODO
    static sendPledgeConfirmation(pledge) {
        return mailer.sendEmail({});
    }
};