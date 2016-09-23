var targetPage, goalTrail, userTrail = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'game data') {
    sendResponse({message: 'game data received'});
    targetPage = request.targetPage;
    goalTrail = request.trail;
    chrome.runtime.sendMessage({message: 'data ready'});
  }
  else if (request.message === 'reset') {
    targetPage = null;
    goalTrail = null;
    userTrail = null;
    sendResponse({message: 'successful reset'});
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    userTrail.push(changeInfo.url);
    chrome.runtime.sendMessage({message: 'navigated'});
  }
});
