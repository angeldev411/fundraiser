'use strict';
import mandrill from 'mandrill-api';
import config from '../config';
import * as roles from '../user/roles';
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
    static sendInviteEmail(user, link, project, role) {
        const subject = 'Join Raiserve';
        const headline = 'Invitation';
        let text = '';
        if (role === roles.PROJECT_LEADER){
          text = `
            <p>Hi,</p>

            <p>Congratulations, you have been invited to be a project leader for ${project.name} (powered by raiserve.org).</p>

            <p>As a project leader your organization will now be able to monetize service hours by your volunteers being sponsored for each hour of service they do.   Volunteers are now able to make twice the difference!</p>

            <p>You can confirm your account and start managing your project by using the link below</p>

            <p><a href="${link}">${link}</a></p>

            <p>Thanks,</p>

            <p>${project.name} (powered by raiserve.org)</p>
          
          `;
        } else if (role === roles.TEAM_LEADER){
          text = `
          <p>Hi,</p>
          <p>Congratulations, you have been invited to join ${project.name} (powered by raiserve.org) as a team leader.</p>
          <p>As a team leader you will be leading a team of volunteers to get sponsored for each hour of volunteering they do.  Your volunteers are now able to make twice the difference!</p>

          <p>You can confirm your account and sign up your team by using the link below</p>

          <p><a href="${link}">${link}</a></p>

          <p>Thanks,</p>

          <p>${project.name} (powered by raiserve.org)</p>
          `;
        }

        const message = {
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
        const headline = 'SHARE TO GET SPONSORS';

        const text =
        `
        <p>${volunteer.firstName},</p>

        <p>Congratulations on joining team ${team.name}.By getting sponsors your volunteers hours will now make twice the difference as you raise money for ${project.name}.</p>

        <p>Don’t forget to invite your friends and family to sponsor you. To get started:</p>

        <ol>
            <li>Email this link of your personal fundraising page: <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}</a> to your contact list, letting them know about your service goal of ${volunteer.goal} hours and that when they sponsor you for every hour you volunteer the money will go directly to ${project.name}</li>
            <li>hare your personal page and why you are so passionate about ${project.name} with your social network via Facebook and Twitter</li>
        </ol>
        
        <p>Remember it usually take a few reminders before your friends and family will sponsors you.  So when you record your hours through your <a href="${Constants.DOMAIN}${Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}">dashboard</a> be sure to take the time to share with your friends and family your volunteering efforts.  It will remind them of the impact you're making and will encourage more sponsorship.</p>

        <p>Thanks,</p>

        <p>${project.name} (powered by raiserve.org)</p>
        `;

        const message = {
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
        <p>${user.firstName},</p>

        <p>Click the following link to reset your password.</p>

        <p>
            <a href="${Constants.DOMAIN}${Urls.PASSWORD_RESET}?t=${user.resetToken}">${Constants.DOMAIN}${Urls.PASSWORD_RESET}?t=${user.resetToken}</a>
        </p>

        <p>Thanks,</p>

        <p>The raiserve.org team</p>
        `;

        const message = {
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
        const subject = `Your Hours are Recorded`;
        const headline = 'Your Hours are Recorded';

        const text =
        `
        <p>${volunteer.firstName},</p>

        <p>Congratulations for volunteering ${hour.hours} hours at ${hour.place}, your service is making an impact in our community. </p>

        <p>Don’t forget to take the time to share with your friends and family your volunteering efforts.  It will remind them of the impact you're making and will encourage more sponsorship.</p>
        
        <p>There are two ways:</p>
        
        <ol>
            <li>Email this link of your personal fundraising page: <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}</a> to your contact list, letting them know that you just volunteered ${hour.hours} hours at ${hour.place} and that when they sponsor you for every hour you volunteer the money will go directly to ${project.name} NAME.</li>
            <li>Share with your social network via Facebook and Twitter your ${hour.hours} hours volunteering at ${hour.place} along with a link to your personal page <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(project.slug, team.slug, volunteer.slug)}</a>. </li>
        </ol>

        <p>Thanks,</p>

        <p>${project.name}</p>
        `;

        const message = {
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
        const subject = `Thank You`;
        const text =
        `
        <p>Dear ${sponsor.firstName},</p>

        <p>Thank you for sponsoring ${volunteer.firstName} ${volunteer.lastName}. Your sponsorship means that each hour that ${volunteer.firstName} volunteers now makes twice the difference for ${volunteer.project.name}.</p>

        <p>Just a quick recap of how your sponsorship works:</p>
        <ol>
            <li>You will be charged at end of each month ${sponsor.hourlyPledge} per hour based on the number hours ${volunteer.firstName}  volunteers that month up to a maximum of ${volunteer.firstName}’s goal of ${volunteer.goal} hours.</li>
            <li>Your first month’s charge will also include the ${volunteer.currentHours} hours ${volunteer.firstName} has already completed.</li>
        </ol>

        <p>Your donation is 100% tax deductible and you will get a tax receipt by the end of the year.</p>

        <p>
        You can help make an even bigger impact by spreading the work about ${volunteer.firstName}’s volunteer campaign by sharing ${volunteer.firstName}’s page <a href="${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}">${Constants.DOMAIN}${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}</a> by email or posting it on your social media via facebook, twitter etc.

        Help spread the word about ${volunteer.firstName}’s fundraising page: </p>

        <p>Thanks,</p>

        <p>${volunteer.project.name} (powered by raiserve.org)</p>


        <p>Are you a volunteer in your community and want to start your own campaign? Contact us at <a href="mailto:${Constants.VOLUNTEER_CONTACT_EMAIL}">${Constants.VOLUNTEER_CONTACT_EMAIL}</a> and we’ll get you setup.</p>
        `;

        const message = {
            subject,
            to: [{
                email: sponsor.email,
                name: `${sponsor.firstName} ${sponsor.lastName}`,
                type: 'to',
            }],
            global_merge_vars: [
                {
                    name: 'headline',
                    content: subject.toUpperCase(),
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
        const subject = `You got sponsored`;
        const headline = 'CONGRATULATIONS ON YOUR FIRST SPONSOR';

        const text =
        `
        <p>${volunteer.firstName},</p>

        <p>Congrats, you’re on your way, you just got your first sponsorship.</p>

        <p>Each hour your volunteers is now making twice the difference for ${volunteer.project.name}</p>

        <p>You were sponsored by ${sponsor.firstName} ${sponsor.lastName}.</p>

        <p>Sending a personalized thank you is always nice.  You can reach  ${sponsor.firstName} at <a href="mailto:${sponsor.email}">${sponsor.email}</a></p>
        <p> Asking ${sponsor.firstName} to share your campaign is a great way to spread the word.  Be sure to include your fundraising page  url <a href="${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(volunteer.project.slug, volunteer.team.slug, volunteer.slug)}</a> in your thank you note</p>

        <p>Thanks,</p>

        <p>${volunteer.project.name}</p>
        `;

        const message = {
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

        <p>Thank you for sponsoring ${volunteer.firstName} ${volunteer.lastName}.  Your sponsorship of $${amount} is helping make twice the difference for ${volunteer.project.name}</p>

        <p>Your donation is 100% tax deductible and you will get a tax receipt by the end of the year.</p>

        <p>You can help make an even bigger impact by spreading the work about #FVOLNAME’s volunteer campaign by sharing their page #VOLPAGEURL by email or posting it on facebook, twitter etc.</p>

        <p>Thanks, </p>

        <p>${volunteer.project.name} (powered by raiserve.org)</p>

        <p>Are you a volunteer in your community and want to start your own campaign? Contact us at <a href="mailto:${Constants.VOLUNTEER_CONTACT_EMAIL}">${Constants.VOLUNTEER_CONTACT_EMAIL}</a> and we’ll get you setup.
        `;
               
        const message = {
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


        } else {
            text =
            `
            <p>Dear ${sponsor.firstName},</p>

            <p>Thanks for sponsoring ${team.name}. Your sponsorship mean twice the difference for ${project.name}</p>

            <p>This month ${team.name} volunteers volunteered ${chargedHours} hours. Your credit card has been charged $${chargedAmount}.</p>

            <p>Please remember that donations are 100% tax deductible at end of year and all the money goes to ${project.name}</p>

            <p>Help spread the word about ${team.name}’s fundraising page: <a href="${Constants.DOMAIN}${Urls.getTeamProfileUrl(project.slug, team.slug)}">${Constants.DOMAIN}${Urls.getTeamProfileUrl(project.slug, team.slug)}</a></p>

            <p>Thanks,</p>

            <p>Raiserve</p>

            <p>Are you a volunteer in your community and want to start your own campaign? Contact us at <a href="mailto:${Constants.VOLUNTEER_CONTACT_EMAIL}">${Constants.VOLUNTEER_CONTACT_EMAIL}</a> and we’ll get you setup.</p>
            `;


        }

        const message = {
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
