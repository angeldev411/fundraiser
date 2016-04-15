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

    static sendTemplate(message, templateName, templateContent = [], callback, callbackError) {
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

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate(
                {
                    template_name: templateName,
                    template_content: message.global_merge_vars,
                    message,
                    async: true,
                },
                (result) => {
                    console.log('Mandrill:', message.subject);
                    callback(result);
                    resolve(result);
                },
                (e) => {
                    console.log(`A mandrill error occurred: ${e.name} - ${e.message}`);
                    callbackError(e);
                    reject(e);
                }
            );
        });
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
        const subject = 'Join Raiserve';
        const headline = 'Invitation';

        const text =
        `
        <p>Hi ${user.firstName},</p>

        <p>You have been invited to join Raiserve.</p>

        <p>You can confirm your account by following this link: <a href="${link}">${link}</a></p>

        <p>Thanks,</p>

        <p>Raiserve</p>
        `;

        const plainText =
        `
        Hi ${user.firstName},

        You have been invited to join Raiserve.

        You can confirm your account by following this link: ${link}

        Thanks,

        Raiserve
        `;

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
                    content: headline,
                },
                {
                    name: 'message',
                    content: text,
                },
            ],
        };

        Mailer.sendTemplate(message, 'mandrill-template', (response) => {
            return Promise.resolve(response);
        }, (err) => {
            return Promise.reject(err);
        });
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
        const subject = 'Welcome to Raiserve';
        const headline = 'Congratulations';

        const text =
        `
        <p>Hey ${volunteer.firstName},</p>

        <p>Congrats on joining team ${team.name}. Your hours will now make twice the difference as you raise money for ${project.name}.</p>

        <p>Don’t forget to invite your friends to sponsor you. There are two ways:</p>

        <p>
            1 - You can email this link: <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}</a>
        </p>
        <p>
            2 - Share on Facebook and Twitter
        </p>

        <p>Remember it takes a few tries to get people.. our best fundraisers share and email potential sponsors every month with an update them after they volunteer their time.</p>

        <p>Don’t forget to record your hours. You can use your <a href="${Constants.DOMAIN}${Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}">dashboard</a> to record them and check the total amount your volunteer efforts have earned for ${project.name}.</p>

        <p>Thanks,</p>

        <p>Raiserve</p>
        `;

        const plainText =
        `
        Hey ${volunteer.firstName},

        Congrats on joining team ${team.name}. Your hours will now make twice the difference as you raise money for ${project.name}.

        Don’t forget to invite your friends to sponsor you. There are two ways:

        1 - You can email this link: ${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}
        2 - Share on Facebook and Twitter

        Remember it takes a few tries to get people.. our best fundraisers share and email potential sponsors every month with an update them after they volunteer their time.

        Don’t forget to record your hours. You can use your dashboard (${Constants.DOMAIN}${Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}) to record them and check the total amount your volunteer efforts have earned for ${project.name}.

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

        return Mailer.sendTemplate(message, 'mandrill-template', (response) => {
            return Promise.resolve(response);
        }, (err) => {
            return Promise.reject(err);
        });
    }

    /*
     * sendResetPasswordEmail()
     * Send reset password to user
     *
     * user: user object
    */
    static sendResetPasswordEmail(user) {
        const subject = 'Reset Raiserve Password';
        const headline = 'Password Reset';

        const text =
        `
        <p>Hey ${user.firstName},</p>

        <p>Click the following link to reset your password.</p>

        <p>
            <a href="${Constants.DOMAIN}${Urls.PASSWORD_RESET}?t=${user.resetToken}">${Constants.DOMAIN}${Urls.PASSWORD_RESET}?t=${user.resetToken}</a>
        </p>

        <p>Thanks,</p>

        <p>Raiserve</p>
        `;

        const plainText =
        `
        Hey ${user.firstName},

        Click the following link to reset your password.

        ${Constants.DOMAIN}${Urls.PASSWORD_RESET}?t=${user.resetToken}

        Thanks,

        Raiserve
        `;

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
                    content: headline,
                },
                {
                    name: 'message',
                    content: text,
                },
            ],
        };

        return Mailer.sendTemplate(message, 'mandrill-template', (response) => {
            return Promise.resolve(response);
        }, (err) => {
            return Promise.reject(err);
        });
    }

    // ---- VOLUNTEERING ----

    /*
     * sendFirstHoursEmail()
     * Send email to volunteer after first volunteering
     *
     * volunteer: volunteer object
     * hour: hour object
    */
    static sendFirstHoursEmail(volunteer, team, project, hour) {
        const subject = `Congrats for volunteering!`;
        const headline = 'Your Hours are Recorded';

        const text =
        `
        <p>Hey ${volunteer.firstName},</p>

        <p>Congrats for volunteering at ${hour.place}, we’re sure they really appreciated your service.</p>

        <p>Don’t forget to invite your friends to sponsor you. There are two ways:</p>

        <p>
            1 - You can email this link: <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}</a>
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

        1 - You can email this link: ${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}
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

        Mailer.sendTemplate(message, 'mandrill-template', (response) => {
            return Promise.resolve(response);
        }, (err) => {
            return Promise.reject(err);
        });
    }

    // ---- SPONSORSHIPS ----

    /*
     * sendSponsorSponsorshipThanksEmail()
     * Send thanks email to sponsor after an hourly pledge
     *
     * volunteer: volunteer object
     * sponsor: sponsor object
    */
    static sendSponsorSponsorshipThanksEmail(volunteer, sponsor, supporting) {
        const subject = `Thanks for your Sponsorship`;

        const text =
        `
        <p>Dear ${sponsor.firstName},</p>

        <p>Thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName}. Your sponsorship mean twice the difference for ${volunteer.project.name}</p>

        <p>Just a quick recap of how it all works:</p>

        <p>
            1 - You will be charged monthly for the total amount of hours that ${volunteer.firstName} volunteers for ${volunteer.project.name}, up to their goal hours of ${volunteer.goal}.
        </p>
        <p>
            2 - Once their goal hours are reached, your donation is finished.
        </p>

        <p>Please remember that donations are 100% tax deductible at end of year and all the money goes to ${volunteer.project.name}</p>

        <p>Help spread the word about ${volunteer.firstName}’s fundraising page: <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}">${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}</a></p>

        <p>Thanks,</p>

        <p>Raiserve</p>

        <p>You can cancel your sponsorship anytime by visiting this page: <a href="${Constants.DOMAIN}${Urls.PLEDGE_CANCEL}?t=${supporting.token}">${Constants.DOMAIN}${Urls.PLEDGE_CANCEL}?t=${supporting.token}</a></p>

        <p>Are you a volunteer in your community and want to start your own campaign? Contact us at <a href="mailto:${Constants.VOLUNTEER_CONTACT_EMAIL}">${Constants.VOLUNTEER_CONTACT_EMAIL}</a> and we’ll get you setup.</p>
        `;


        const plainText =
        `
        Dear ${sponsor.firstName},

        Thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName}. Your sponsorship mean twice the difference for ${volunteer.project.name}

        Just a quick recap of how it all works:

        1 - You will be charged monthly for the total amount of hours that ${volunteer.firstName} volunteers for ${volunteer.project.name}, up to their goal hours of ${volunteer.goal}.
        2 - Once their goal hours are reached, your donation is finished.

        Please remember that donations are 100% tax deductible at end of year and all the money goes to ${volunteer.project.name}

        Help spread the word about ${volunteer.firstName}’s fundraising page: ${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}

        Thanks,

        Raiserve

        You can cancel your sponsorship anytime by visiting this page: ${Constants.DOMAIN}${Urls.PLEDGE_CANCEL}?t=${supporting.token}

        Are you a volunteer in your community and want to start your own campaign? Contact us at ${Constants.VOLUNTEER_CONTACT_EMAIL} and we’ll get you setup.
        `;

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

        return Mailer.sendTemplate(message, 'mandrill-template', (response) => {
            return Promise.resolve(response);
        }, (err) => {
            return Promise.reject(err);
        });
    }

    /*
     * sendVolunteerSponsorshipEmail()
     * Send email to volunteer after new sponsor contract
     *
     * volunteer: volunteer object
     * sponsor: sponsor object
    */
    static sendVolunteerSponsorshipEmail(volunteer, sponsor) {
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

        return Mailer.sendTemplate(message, 'mandrill-template', (response) => {
            return Promise.resolve(response);
        }, (err) => {
            return Promise.reject(err);
        });
    }


    /*
     * sendSponsorDonationThanksEmail()
     * Send thanks email to sponsor after donation
     *
     * volunteer: volunteer object
     * sponsor: sponsor object
    */
    static sendSponsorDonationThanksEmail(volunteer, sponsor, amount) {
        const subject = `Thanks for your Sponsorship`;

        const text =
        `
        <p>Dear ${sponsor.firstName},</p>

        <p>Thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName}. Your sponsorship mean twice the difference for ${volunteer.project.name}</p>

        <p>You will be charged one time for the total amount of ${amount}</p>

        <p>Please remember that donations are 100% tax deductible at end of year and all the money goes to ${volunteer.project.name}</p>

        <p>Help spread the word about ${volunteer.firstName}’s fundraising page: <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}">${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}</a></p>

        <p>Thanks,</p>

        <p>Raiserve</p>

        <p>Are you a volunteer in your community and want to start your own campaign? Contact us at <a href="mailto:${Constants.VOLUNTEER_CONTACT_EMAIL}">${Constants.VOLUNTEER_CONTACT_EMAIL}</a> and we’ll get you setup.</p>
        `;


        const plainText =
        `
        Dear ${sponsor.firstName},

        Thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName}. Your sponsorship mean twice the difference for ${volunteer.project.name}

        You will be charged one time for the total amount of ${amount}

        Please remember that donations are 100% tax deductible at end of year and all the money goes to ${volunteer.project.name}

        Help spread the word about ${volunteer.firstName}’s fundraising page: ${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}

        Thanks,

        Raiserve

        Are you a volunteer in your community and want to start your own campaign? Contact us at ${Constants.VOLUNTEER_CONTACT_EMAIL} and we’ll get you setup.
        `;

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

        return Mailer.sendTemplate(message, 'mandrill-template', (response) => {
            return Promise.resolve(response);
        }, (err) => {
            return Promise.reject(err);
        });
    }

    // ---- BILLING ----

    /*
     * sendChargeEmail()
     * Send email to sponsor
     *
     * volunteer: volunteer object
     * hours: total hours charged
     * forVolunteer: true for a volunteer contract charge, false otherwise
    */
    static sendChargeEmail = (volunteer, project, team, sponsor, chargedHours, chargedAmount, forVolunteer = true) => {
        const subject = `Thanks for your Continued Support`;
        let text = null;
        let plainText = null;

        if (forVolunteer) {
            text =
            `
            <p>Dear ${sponsor.firstName},</p>

            <p>Thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName}. Your sponsorship mean twice the difference for ${project.name}</p>

            <p>This month ${volunteer.firstName} ${volunteer.lastName} volunteered ${chargedHours} towards their ${volunteer.goal} hours. Your credit card has been charged $${chargedAmount}.</p>

            <p>Please remember that donations are 100% tax deductible at end of year and all the money goes to ${project.name}</p>

            <p>Help spread the word about ${volunteer.firstName}’s fundraising page: <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}">${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}</a></p>

            <p>Thanks,</p>

            <p>Raiserve</p>

            <p>Are you a volunteer in your community and want to start your own campaign? Contact us at <a href="mailto:${Constants.VOLUNTEER_CONTACT_EMAIL}">${Constants.VOLUNTEER_CONTACT_EMAIL}</a> and we’ll get you setup.</p>
            `;


            plainText =
            `
            Dear ${sponsor.firstName},

            Thanks for sponsoring ${volunteer.firstName} ${volunteer.lastName}. Your sponsorship mean twice the difference for ${project.name}

            This month ${volunteer.firstName} ${volunteer.lastName} volunteered ${chargedHours} towards their ${volunteer.goal} hours. Your credit card has been charged $${chargedAmount}.

            Please remember that donations are 100% tax deductible at end of year and all the money goes to ${project.name}

            Help spread the word about ${volunteer.firstName}’s fundraising page: ${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}

            Thanks,

            Raiserve

            Are you a volunteer in your community and want to start your own campaign? Contact us at ${Constants.VOLUNTEER_CONTACT_EMAIL} and we’ll get you setup.
            `;
        } else {
            text =
            `
            <p>Dear ${sponsor.firstName},</p>

            <p>Thanks for sponsoring ${team.name}. Your sponsorship mean twice the difference for ${project.name}</p>

            <p>This month ${team.name} volunteers volunteered ${chargedHours}. Your credit card has been charged $${chargedAmount}.</p>

            <p>Please remember that donations are 100% tax deductible at end of year and all the money goes to ${project.name}</p>

            <p>Help spread the word about ${team.name}’s fundraising page: <a href="${Constants.DOMAIN}${Urls.getTeamProfileUrl(project.slug, team.slug)}">${Constants.DOMAIN}${Urls.getTeamProfileUrl(project.slug, team.slug)}</a></p>

            <p>Thanks,</p>

            <p>Raiserve</p>

            <p>Are you a volunteer in your community and want to start your own campaign? Contact us at <a href="mailto:${Constants.VOLUNTEER_CONTACT_EMAIL}">${Constants.VOLUNTEER_CONTACT_EMAIL}</a> and we’ll get you setup.</p>
            `;


            plainText =
            `
            Dear ${sponsor.firstName},

            Thanks for sponsoring ${team.name}. Your sponsorship mean twice the difference for ${project.name}

            This month ${team.name} volunteers volunteered ${chargedHours}. Your credit card has been charged $${chargedAmount}.

            Please remember that donations are 100% tax deductible at end of year and all the money goes to ${project.name}

            Help spread the word about ${team.name}’s fundraising page: ${Constants.DOMAIN}${Urls.getTeamProfileUrl(project.slug, team.slug)}

            Thanks,

            Raiserve

            Are you a volunteer in your community and want to start your own campaign? Contact us at ${Constants.VOLUNTEER_CONTACT_EMAIL} and we’ll get you setup.
            `;
        }

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

        return Mailer.sendTemplate(message, 'mandrill-template', (response) => {
            return Promise.resolve(response);
        }, (err) => {
            return Promise.reject(err);
        });
    };
}
