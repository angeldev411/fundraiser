import mandrill from 'mandrill-api';
var mandrill_client = new mandrill.Mandrill('vojeuQGTtCu70meDb7C8ww');

module.exports = class Mailer {


  static sendEmail(obj={}){

    var message = {
      "text": (obj.body || "Empty Body"),
      "subject": (obj.subject || "No Subject"),
      "from_email": (obj.from || "support@raiserve.org"),
      "from_name": (obj.fromName || "Raiserve"),
      "merge_vars": [{
        "rcpt": obj.to,
        "vars": [{
          "name": "merge2",
          "content": "merge2 content"
        }]
      }],
      "to": [{
        "email": obj.to,
        "name": obj.toName,
        "type": "to"
      }],
    };

    mandrill_client.messages.send({"message": message, "async": true}, function(result) {
      console.log(result);
      return Promise.resolve(result);
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      return Promise.reject(e);
    });
  }

    // this is currently in team
  static sendVolunteerInvite(obj){
    console.log("INVITING team volunteer " + JSON.stringify(obj));

    var template_name = "volunteer-invite";


    var template_content = [];

      var message = {
      "text": (obj.body || "Empty Body"),
      "subject": (obj.subject || "No Subject"),
      "from_email": (obj.from || "support@raiserve.org"),
        "from_name": (obj.fromName || "Raiserve"),
        "merge_language": "handlebars",
      "merge_vars": [{
        "rcpt": obj.to,
        "vars": [
          {
            "name": "first_name",
            "content": obj.first_name
          },
          {"name": "org_name",
           "content": obj.org_name
          },
          {"name": "onboard_url",
           "content": obj.onboard_url
          }]
      }],
      "to": [{
        "email": obj.to,
        "name": obj.toName,
        "type": "to"
      }],
    };

    mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": true}, function(result) {
      console.log(result);
      return Promise.resolve(result);
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      return Promise.reject(e);
    });
  }


  // this is currently in team
  static sendLeaderInvite(obj){
    console.log("INVITING team leader " + JSON.stringify(obj));

    var template_name = "leader-invite";


    var template_content = [];

      var message = {
      "text": (obj.body || "Empty Body"),
      "subject": (obj.subject || "No Subject"),
      "from_email": (obj.from || "support@raiserve.org"),
        "from_name": (obj.fromName || "Raiserve"),
        "merge_language": "handlebars",
      "merge_vars": [{
        "rcpt": obj.to,
        "vars": [
          {
            "name": "first_name",
            "content": obj.first_name
          },
          {"name": "org_name",
           "content": obj.org_name
          },
          {"name": "onboard_url",
           "content": obj.onboard_url
          }]
      }],
      "to": [{
        "email": obj.to,
        "name": obj.toName,
        "type": "to"
      }],
    };

    mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": true}, function(result) {
      console.log(result);
      return Promise.resolve(result);
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      return Promise.reject(e);
    });
  }



  static sendPasswordReset(user){
    return mailer.sendEmail({})
  }

  static sendPledgeConfirmation(pledge){
    return mailer.sendEmail({})
  }

}
