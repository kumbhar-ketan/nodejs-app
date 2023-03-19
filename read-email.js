const Imap = require('imap');
const cron = require("node-cron");
const {simpleParser} = require('mailparser');
const imapConfig = {
  user: 'test',
  password: 'test',
  host: 'pop.gmail.com',
  port: 993,
  tls: true,
  authTimeout: 10000,
  connTimeout: 30000,
  keepalive: true,
  tlsOptions: {
    rejectUnauthorized: false
  }
};

const readEmails = (imap) => {
    imap.openBox('INBOX', false, () => {
      imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
        const f = imap.fetch(results, {bodies: ''});
        f.on('message', msg => {
          msg.on('body', stream => {
            simpleParser(stream, async (err, parsed) => {
              const {from, subject, textAsHtml, text} = parsed;
              const subNumArr = subject.match(/^\d{5}(?:NO|YES)\d*/g);
              if(subNumArr?.length) {
                if(subject.includes('Approved')) {
                  console.log(`${subNumArr} request has been approved!\n`);
                }
                else if(subject.includes('Rejected')) {
                  console.log(`${subNumArr} request has been rejected!\n`);
                }
              }
              // console.log(subNumArr, subject);
              /* Make API call to save the data
                  Save the retrieved data into a database.
                  E.t.c
              */
            });
          });
          msg.once('attributes', attrs => {
            const {uid} = attrs;
            // imap.addFlags(uid, ['\\Seen'], () => {
            //   // Mark the email as read after reading it
            //   console.log('Marked as read!');
            // });
          });
        });
        f.once('error', ex => {
          return Promise.reject(ex);
        });
        f.once('end', () => {
          // console.log('Done fetching all messages!');
          imap.end();
        });
      });
    });
};

cron.schedule("*/10 * * * * *", function() {
  try {
    const imap = new Imap(imapConfig);
    imap.once('ready', () => {
      readEmails(imap);
    });

    imap.once('error', err => {
      console.log(err);
    });

    // imap.once('end', () => {
    //   console.log('Connection ended');
    // });

    imap.connect();
  } catch (ex) {
    console.log('an error occurred');
  }
});
