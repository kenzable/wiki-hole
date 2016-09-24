var request = require('request'),
    cheerio = require('cheerio');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'start game') {
    startGame(request.hops);
    sendResponse({message: 'game started'});
  }
  else if (request.message === 'send url') {
    sendResponse({message: 'url sent', url: document.URL});
  }
});

function startGame(numHops){
  var origin = document.origin,
      startHtml = document.documentElement.innerHTML,
      startUrl = document.URL,
      counter = 0,
      trail = [];

  processHtml(startHtml);

  //parse the html string for usable links
  function processHtml(html) {
    counter++;
    var $ = cheerio.load(html);
    var links = $('#mw-content-text p a').filter(function(){
        return $(this).attr('href')[0] !== '#';
    });
    if (counter <= numHops) httpRequest(getNext(links, $));
    else sendGameData();
  }
  //get html for subsequent pages
  function httpRequest(link){
    request(link, function(error, response, html){
      if (!error) processHtml(html);
      else console.error(error);
    });
  }
  //get random link from page, note - must pass in $ in order to use cheerio
  function getNext(links, $){
    var randomIndex = Math.floor((Math.random() * links.length));
    var next = origin + $(links[randomIndex]).attr('href');
    trail.push(next);
    return next;
  }
  //send trail, target page, and start to background for use in popup
  function sendGameData(){
    var message = { message: 'game data',
                    trail: trail,
                    targetPage: trail[trail.length - 1],
                    startUrl: startUrl };
    chrome.runtime.sendMessage(message);
  }
}
