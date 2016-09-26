syncVars();

$('#submit-button').on('click', function() {
  var numHops = +$('#num-hops').val();
  startGame(numHops);
});

$('#reset-button').on('click', function() {
  reset();
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

function reset(){
  chrome.runtime.sendMessage({message: 'reset'}, function(response){
    if (response.message === 'successful reset') syncVars();
  });
}

function syncVars(){
  chrome.runtime.getBackgroundPage(function (backgroundPage) {
    if (backgroundPage.gameData.victory) buildVictory();
    else buildPage(backgroundPage.gameData);
  });
}

function buildPage(data){
  $('#target-page').text(data.targetPage);
  $('#trail-list').html('');
  data.userTrail.forEach(function(pageUrl, index){
    var element = $('<li>' + pageUrl + '</li>');
    var goalTrail = data.goalTrail;
    //check if url is the correct next step in trail
    if (goalTrail[index] === pageUrl) element.addClass('correct');
    else element.addClass('incorrect');
    element.appendTo('#trail-list');
  });
}

function buildVictory(){
  var body = $('body')[0];
  var content = $(body).html();
  $(body).html('<h1 class="victory">YOU WON!!!</h1><button id="play-again">Play Again</button>');
  $('#play-again').on('click', function(){
    $(body).html(content);
    reset();
  });
}
