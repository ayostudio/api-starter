const sgMail = require('@sendgrid/mail');
const http = require('http');
const inlineCss = require('inline-css');
const config = require('../config');

sgMail.setApiKey(config.sendgridKey);

/**
 * Send an email to a user
 * @param {object} user The user object
 * @param {string} subject The subject line for the email
 * @param {string} template The email template you want to use
 */
const sendEmail = (user, subject, template) => new Promise((resolve, reject) => {
  http.get({ path: `/emails/${template}?id=${user._id}` }, (res) => {
    res.setEncoding('utf8');
    if (res.statusCode === 200) {
      res.on('data', (body) => {
        inlineCss(body, { url: '/public' }).then((html) => {
          const msg = {
            to: {
              name: user.name,
              email: user.email,
            },
            subject,
            html,
            from: {
              email: 'no-reply@twocards.co',
              name: 'TwoCards',
            },
          };
          sgMail.send(msg, false, (err) => {
            if (err) {
              return reject(err);
            }
            return resolve(msg);
          });
        });
      });
    } else {
      reject(new Error('There was an issue sending the email'));
    }
  });
});

module.exports = {
  sendEmail,
};
