var targetPage, goalTrail, userTrail = [], currentGame = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'game data') {
    currentGame = true;
    targetPage = request.targetPage;
    goalTrail = request.trail;
    sendResponse({message: 'game data received'});
    chrome.runtime.sendMessage({message: 'data ready'});
  }
  else if (request.message === 'reset') {
    currentGame = false;
    targetPage = null;
    goalTrail = null;
    userTrail = null;
    sendResponse({message: 'successful reset'});
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (currentGame === true) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: 'send url'}, function(response){
        if (userTrail.indexOf(response.url) === -1) {
          userTrail.push(response.url);
          chrome.runtime.sendMessage({message: 'navigated'});
        }
      });
    });
  }
});
