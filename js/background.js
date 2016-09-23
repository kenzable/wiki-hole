var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?wikipedia\.org\/wiki/;

function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}

chrome.browserAction.onClicked.addListener(function (tab) {
    // if (urlRegex.test(tab.url)) {
    //     chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    // }

    alert('this is tab', tab);
    alert('this is tab url', tab.url);
});
