import mailer from '../models/mailer.js';


//mailer.sendInvitation();

var obj = {to: 'matt@raiserve.org', toName: 'Matt'};
mailer.sendEmail(obj);


var merge = {to: invite.email, body: "You have been invited to join a team at Raiserve!"}
return mailer.sendEmail(merge);
