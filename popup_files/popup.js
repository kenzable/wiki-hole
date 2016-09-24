syncVars();

$('#submit-button').on('click', function() {
  var numHops = +$('#num-hops').val();
  startGame(numHops);
});

$('#reset-button').on('click', function() {
  chrome.runtime.sendMessage({message: 'reset'}, function(response){
    if (response.message === 'successful reset') syncVars();
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'game data') sendResponse({message: 'game data received'});
  else if (request.message === 'navigated') sendResponse({message: 'url received'});
  syncVars();
});

function startGame(numHops) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: 'start game', hops: numHops});
  });
}

function syncVars(){
  chrome.runtime.getBackgroundPage(function (backgroundPage) {
    $('#target-page').text(backgroundPage.gameData.targetPage);
    $('#trail-list').html('');
    if (backgroundPage.gameData.userTrail){
      backgroundPage.gameData.userTrail.forEach(function(href){
        $('<li>' + href + '</li>').appendTo('#trail-list');
      });
    }
  });
}
