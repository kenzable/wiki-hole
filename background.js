var gameData = {  targetPage: null,
                  goalTrail: null,
                  startUrl: null,
                  userTrail: [],
                  currentGame: false };

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'game data') {
    gameData.currentGame = true;
    gameData.targetPage = request.targetPage;
    gameData.goalTrail = request.trail;
    gameData.startUrl = request.startUrl;
    sendResponse({message: 'game data received'});
    chrome.runtime.sendMessage({message: 'data ready'});
  }
  else if (request.message === 'reset') {
    gameData.currentGame = false;
    gameData.targetPage = null;
    gameData.goalTrail = null;
    gameData.startUrl = null;
    gameData.userTrail = [];
    sendResponse({message: 'successful reset'});
  }
});

//listen for changes in tab navigation
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (gameData.currentGame === true) {
    //ask the currently active tab for its url
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: 'send url'}, function(response){
        //check if that url already exists in the trail list
        //this prevents duplicate urls when detecting other tab changes
        var index = gameData.userTrail.indexOf(response.url);
        if (index === -1 && response.url !== gameData.startUrl) {
          gameData.userTrail.push(response.url);
          chrome.runtime.sendMessage({message: 'navigated'});
        }
        //if link is duplicate BUT not end of trail,
        //update trail list to reflect navigating backwards
        else if (index < gameData.userTrail.length - 1) {
          gameData.userTrail.splice(index + 1);
          chrome.runtime.sendMessage({message: 'navigated'});
        }
      });
    });
  }
});
