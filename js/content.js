var request = require('request');
var cheerio = require('cheerio');

/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    /* If the received message has the expected format... */
    if (msg.text && (msg.text == "report_back")) {
        /* Call the specified callback, passing
           the web-pages DOM content as argument */
    sendResponse(document.getElementById("mybutton").innerHTML);
    }
});

//STEP ONE - search the dom for all internal hyperlinks

function httpRequest(link){
  request(link, function(error, response, html){
    if (!error) processHtml(html);
    else console.error(error);
  });
}

var origin = document.origin;
var startHtml = document.documentElement.innerHTML
var counter = 0;

var path = [];

function processHtml(html) {
  counter++;
  var $ = cheerio.load(html);

  var links = $('#mw-content-text p a').filter(function(){
      return $(this).attr('href')[0] !== '#';
  });

  var randomIndex = Math.floor((Math.random() * links.length));
  var next = origin + $(links[randomIndex]).attr('href');
  path.push(next);

  if (counter < 7) httpRequest(next);
  else console.log(path);
}

processHtml(startHtml);

