var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?wikipedia\.org\/wiki/;

function doStuffWithDom(domContent) {
  alert('I got it!');
  console.log('I received the following DOM content:\n' + domContent);
}

chrome.browserAction.onClicked.addListener(function (tab) {
  if (urlRegex.test(tab.url)) {
      chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
  }
});
