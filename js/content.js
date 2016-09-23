var request = require('request');
var cheerio = require('cheerio');

//listen for game start message from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'start game') {
    startGame(request.hops);
    sendResponse({message: 'game started'});
  }
});

function startGame(numHops){
  var origin = document.origin,
      startHtml = document.documentElement.innerHTML,
      counter = 0,
      trail = [];

  processHtml(startHtml);

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
  //note - must pass in $ in order to use cheerio
  function getNext(links, $){
    var randomIndex = Math.floor((Math.random() * links.length));
    var next = origin + $(links[randomIndex]).attr('href');
    trail.push(next);
    return next;
  }
  //send trail and target page to background for use in popup
  function sendGameData(){
    var message = { message: 'game data',
                    trail: trail,
                    targetPage: trail[trail.length - 1]
                  };
    chrome.runtime.sendMessage(message, function(response) {
      console.log('response is here!', response.message);
    });
  }
}
