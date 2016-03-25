'use strict';
import mandrill from 'mandrill-api';
import config from '../config';
import * as Urls from '../../src/urls';
import * as Constants from '../../src/common/constants';

const mandrillClient = new mandrill.Mandrill(config.MANDRILL_API_KEY);

export default class Mailer {
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
                console.log('Mandrill:', message.subject);
                return Promise.resolve(result);
            },
            (e) => {
                console.log(`A mandrill error occurred: ${e.name} - ${e.message}`);
                return Promise.reject(e);
            }
        );
    }

    // ---- SIGNUP AND INVITATION ----

    /*
     * sendInviteEmail()
     * Send email with sign up link to invited user
     *
     * user: user object
     * link: signup link
    */
    static sendInviteEmail(user, link) {
        // TODO EMAIL
        const subject = 'Welcome to Raiserve';
        const text = `${link}`;
        const plainText = `${link}`;
        const message = {
            text: plainText,
            subject,
            to: [{
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
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
    }

    /*
     * sendVolunteerWelcomeEmail()
     * Send welcome email to volunteer
     *
     * volunteer: volunteer object
     * project: project object
     * team: team object
    */
    static sendVolunteerWelcomeEmail(project, team, volunteer) {
        // TODO EMAIL
        const subject = 'Welcome to Raiserve';
        const headline = 'Congratulations';

        const text =
        `
        <p>Hey ${volunteer.firstName},</p>

        <p>Congrats on joining team ${team.name}. Your hours will now make twice the difference as you raise money for ${project.name}.</p>

        <p>Don’t forget to invite your friends to sponsor you. There are two ways:</p>

        <p>
            1 - You can email this link : <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}</a>
        </p>
        <p>
            2 - Share on Facebook and Twitter
        </p>

        <p>Remember it takes a few tries to get people.. our best fundraisers share and email potential sponsors every month with an update them after they volunteer their time.</p>

        <p>Don’t forget to record your hours. You can use your <a href="${Constant.DOMAIN}${Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}">dashboard</a> to record them and check the total amount your volunteer efforts have earned for ${project.name}.</p>

        <p>Thanks,</p>

        <p>Raiserve</p>
        `;

        const plainText =
        `
        Hey ${volunteer.firstName},

        Congrats on joining team ${team.name}. Your hours will now make twice the difference as you raise money for ${project.name}.

        Don’t forget to invite your friends to sponsor you. There are two ways:

        1 - You can email this link : ${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}
        2 - Share on Facebook and Twitter

        Remember it takes a few tries to get people.. our best fundraisers share and email potential sponsors every month with an update them after they volunteer their time.

        Don’t forget to record your hours. You can use your dashboard (${Constant.DOMAIN}${Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}) to record them and check the total amount your volunteer efforts have earned for ${project.name}.

        Thanks,

        Raiserve
        `;

        const message = {
            text: plainText,
            subject,
            to: [{
                email: volunteer.email,
                name: `${volunteer.firstName} ${volunteer.lastName}`,
                type: 'to',
            }],
            global_merge_vars: [
                {
                    name: 'headline',
                    content: headline,
                },
                {
                    name: 'message',
                    content: text,
                },
            ],
        };

        return Mailer.sendTemplate(message, 'mandrill-template');
    }

    // ---- VOLUNTEERING ----

    /*
     * sendFirstHoursEmail()
     * Send email to volunteer after first volunteering
     *
     * volunteer: volunteer object
     * hour: hour object
    */
    static sendFirstHoursEmail(volunteer, hour) {
        // TODO EMAIL
        const subject = `Congrats for volunteering!`;
        const headline = 'Your Hours are Recorded';

        const text =
        `
        <p>Hey ${volunteer.firstName},</p>

        <p>Congrats for volunteering at ${hour.place}, we’re sure they really appreciated your service.</p>

        <p>Don’t forget to invite your friends to sponsor you. There are two ways:</p>

        <p>
            1 - You can email this link : <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}</a>
        </p>
        <p>
            2 - Share on Facebook and Twitter
        </p>

        <p>Thanks,</p>

        <p>Raiserve</p>
        `;


        const plainText =
        `
        Hey ${volunteer.firstName},

        Congrats for volunteering at ${hour.place}, we’re sure they really appreciated your service.

        Don’t forget to invite your friends to sponsor you. There are two ways:

        1 - You can email this link : ${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}
        2 - Share on Facebook and Twitter

        Thanks,

        Raiserve
        `;

        const message = {
            text: plainText,
            subject,
            to: [{
                email: volunteer.email,
                name: `${volunteer.firstName} ${volunteer.lastName}`,
                type: 'to',
            }],
            global_merge_vars: [
                {
                    name: 'headline',
                    content: headline,
                },
                {
                    name: 'message',
                    content: text,
                },
            ],
        };

        Mailer.sendTemplate(message, 'mandrill-template');
    }

    // ---- SPONSORSHIPS ----

    /*
     * sendSponsorSponsorshipThanksEmail()
     * Send thanks email to sponsor after an hourly pledge
     *
     * volunteer: volunteer object
     * sponsor: sponsor object
    */
    static sendSponsorSponsorshipThanksEmail(volunteer, sponsor) {
        // TODO EMAIL
        const subject = `Thanks for your support!`;

        const text =
        `Dear ${sponsor.firstName} ${sponsor.lastName},
        thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName} your sponsors mean twice the difference ….for ${volunteer.project.name}
        then explain charged every month
        100% tax deductible at end of year money goes to ${volunteer.project.name}
        Help spread the word share share share ${volunteer.firstName} ${volunteer.lastName}’s fundraising page there the <a href="${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}</a>
        Are you a volunteer in your community and want to start your own campaign? Contact us at raiserve with email link ${Constants.VOLUNTEER_CONTACT_EMAIL}`;

        const plainText =
        `Dear ${sponsor.firstName} ${sponsor.lastName} thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName} your sponsors mean twice the difference ….for ${volunteer.project.name}
        then explain charged every month
        100% tax deductible at end of year money goes to ${volunteer.project.name}
        Help spread the word share share share ${volunteer.firstName} ${volunteer.lastName}’s fundraising page there the ${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}
        Are you a volunteer in your community and want to start your own campaign? Contact us at raiserve with email link ${Constants.VOLUNTEER_CONTACT_EMAIL}`;

        const message = {
            text: plainText,
            subject,
            to: [{
                email: sponsor.email,
                name: `${sponsor.firstName} ${sponsor.lastName}`,
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

        return Mailer.sendTemplate(message, 'mandrill-template');
    }

    /*
     * sendVolunteerSponsorshipEmail()
     * Send email to volunteer after new sponsor contract
     *
     * volunteer: volunteer object
     * sponsor: sponsor object
    */
    static sendVolunteerSponsorshipEmail(volunteer, sponsor) {
        // TODO EMAIL
        const subject = `You've been sponsored!`;
        const headline = 'Your First Sponsor';

        const text =
        `
        <p>Hey ${volunteer.firstName},</p>

        <p>Congrats, you’re on your way.</p>

        <p>Each hour your volunteers is now making twice the difference for ${volunteer.project.name}</p>

        <p>${sponsor.firstName} ${sponsor.lastName} just sponsored you. Here’s their email address:</p>

        <p><a href="mailto:${sponsor.email}">${sponsor.email}</a></p>

        <p>Sending a personalized thank you is always nice. Be sure to ask them to share your campaign to help get more sponsors and include your unique url (<a href="${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}</a>) in your thank you note.</p>

        <p>Thanks,</p>

        <p>Raiserve</p>
        `;


        const plainText =
        `
        Hey ${volunteer.firstName},

        Congrats, you’re on your way.

        Each hour your volunteers is now making twice the difference for ${volunteer.project.name}

        ${sponsor.firstName} ${sponsor.lastName} just sponsored you. Here’s their email address: ${sponsor.email}

        Sending a personalized thank you is always nice. Be sure to ask them to share your campaign to help get more sponsors and include your unique url (${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}) in your thank you note.

        Thanks,

        Raiserve
        `;

        const message = {
            text: plainText,
            subject,
            to: [{
                email: volunteer.email,
                name: `${volunteer.firstName} ${volunteer.lastName}`,
                type: 'to',
            }],
            global_merge_vars: [
                {
                    name: 'headline',
                    content: headline,
                },
                {
                    name: 'message',
                    content: text,
                },
            ],
        };

        return Mailer.sendTemplate(message, 'mandrill-template');
    }


    /*
     * sendSponsorDonationThanksEmail()
     * Send thanks email to sponsor after donation
     *
     * volunteer: volunteer object
     * sponsor: sponsor object
    */
    static sendSponsorDonationThanksEmail(volunteer, sponsor) {
        // TODO EMAIL
        const subject = `Thanks for your donation!`;

        const text =
        `Dear ${sponsor.firstName} ${sponsor.lastName},
        thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName} your sponsors mean twice the difference ….for ${volunteer.project.name}
        100% tax deductible at end of year money goes to ${volunteer.project.name}
        Help spread the word share share share ${volunteer.firstName} ${volunteer.lastName}’s fundraising page there the <a href="${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}</a>
        Are you a volunteer in your community and want to start your own campaign? Contact us at raiserve with email link ${Constants.VOLUNTEER_CONTACT_EMAIL}`;

        const plainText =
        `Dear ${sponsor.firstName} ${sponsor.lastName} thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName} your sponsors mean twice the difference ….for ${volunteer.project.name}
        100% tax deductible at end of year money goes to ${volunteer.project.name}
        Help spread the word share share share ${volunteer.firstName} ${volunteer.lastName}’s fundraising page there the ${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}
        Are you a volunteer in your community and want to start your own campaign? Contact us at raiserve with email link ${Constants.VOLUNTEER_CONTACT_EMAIL}`;

        const message = {
            text: plainText,
            subject,
            to: [{
                email: sponsor.email,
                name: `${sponsor.firstName} ${sponsor.lastName}`,
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

        return Mailer.sendTemplate(message, 'mandrill-template');
    }

    // ---- BILLING ----

    /*
     * sendChargeEmail()
     * Send email to sponsor
     *
     * volunteer: volunteer object
     * hours: total hours charged
    */
    static sendChargeEmail = (volunteer, sponsor, chargedHours, chargedAmount) => {
        // TODO EMAIL
        const subject = `Thanks for your continued support!`;

        const text =
        `${sponsor.firstName} ${sponsor.lastName}, thanks for continued support
        this month ${volunteer.firstName} ${volunteer.lastName} volunteered ${chargedHours} hours.
        your credit card has been charged $${chargedAmount}.
        share the campaign to help raise more money.
        The receipt part`;

        const plainText = text;

        const message = {
            text: plainText,
            subject,
            to: [{
                email: sponsor.email,
                name: `${sponsor.firstName} ${sponsor.lastName}`,
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

        return Mailer.sendTemplate(message, 'mandrill-template');
    };
}
