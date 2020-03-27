let nodemailer = require("nodemailer");
// let sesTransport = require("nodemailer-ses-transport");
let AWS = require("aws-sdk");
// let bluebirdPromise = require("bluebird");

AWS.config.accessKeyId = "AKIAI4QEXDNMPEJE6EGA";
AWS.config.secretAccessKey = "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";
AWS.config.region = "us-east-1";
AWS.config.sslEnabled = true;
const sleep = require("util").promisify(setTimeout);

let Mailer = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: "2010-12-01",
  }),
  sendingRate: 14,
});

module.exports = async (emails) => {
  let i = 0;
  while (i < emails.length) {
    let email = emails[i];
    if (Mailer.isIdle()) {
       Mailer.sendMail({
        from: "<synergy@rccbpo.com>",
        to: email.recipient,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
       await sleep(300);
       i++;
    }
    console.log(i);
  }

  // transporter.on("idle",function(){
  // console.log(transporter);
  // while (transporter.isIdle()) {

  //   }, (err, info) => {
  //       console.log(err);
  //       console.log(info);
  //     });
  // }
  // });
};

//const SES = new AWS.SES({ apiVersion: "2010-12-01" });
// const NodeMailer = nodemailer.createTransport(sesTransport({ ses: SES, rateLimit: 14 }));
// bluebirdPromise.promisifyAll(NodeMailer);
// module.exports = async ({ recipient, subject, text, html }) => {
//   return NodeMailer.sendMailAsync({
//     from: "<synergy@rccbpo.com>",
//     to: recipient,
//     subject,
//     text,
//     html
//   });
// };
