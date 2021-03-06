var IncomingWebhook = require('@slack/client').IncomingWebhook,
    https = require('https'),
    cheerio = require('cheerio');

var url = process.env.SLACK_WEBHOOK_URL || '';

var webhook = new IncomingWebhook(url);

var currentISODate = new Date().toISOString().slice(0, 10);

var url = "https://dilbert.com/strip/" + currentISODate;

console.log(url);

https.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        var dom = cheerio.load(data);
        var imgUrl = "https:" + dom("img.img-comic").attr('src');

        console.log(imgUrl);

        var attachments = [{
            "image_url": imgUrl,
            "text": "Daily strip for " + currentISODate,
        }];
        
        webhook.send({ attachments: attachments }, (err, header, statusCode, body) => {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Received', statusCode, 'from Slack');
            }
        });
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});;