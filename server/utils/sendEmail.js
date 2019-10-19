let nodemailer = require('nodemailer');
let sesTransport = require('nodemailer-ses-transport')
let AWS = require('aws-sdk')
let Promise = require('bluebird')

AWS.config.accessKeyId = 'AKIAI4QEXDNMPEJE6EGA'
AWS.config.secretAccessKey = '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'
AWS.config.region = 'us-east-1'
AWS.config.sslEnabled = true

const SES = new AWS.SES({ apiVersion: '2010-12-01' })
const NodeMailer = nodemailer.createTransport(sesTransport({ ses: SES, rateLimit: 14 }))
Promise.promisifyAll(NodeMailer)

module.exports = async ({ recipient, subject, text, html }) => {
  return await NodeMailer.sendMailAsync({
    from: 'Synergy<no-reply@rccbpo.com>',
    to: recipient,
    subject,
    text,
    html,
  })
}

