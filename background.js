'use strict';

function constructSearchUrl(searchQuery) {
  return `https://www.google.com/search?sourceid=chrome&ie=UTF-8&q=${searchQuery}%20stackoverflow.com`;
}

function ready(callback) {
  // in case the document is already rendered
  if (document.readyState != 'loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState == 'complete') callback();
    });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.commands.onCommand.addListener(async function (command) {
    if (command === 'search-so') {
      // chrome.tabs.create({ url: constructSearchUrl('testing python') }, function (tab) {
      //   // chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, function (firstSoUrl) {
      //   //   console.log(firstSoUrl);
      //   // });
      //   chrome.pageAction.show(tab.id);
      // });

      chrome.tabs.create({ url: constructSearchUrl('') }, async function (tab) {
        let sending = true;
        while (sending) {
          await sleep(200);
          chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, function (resp) {
            if (resp) {
              sending = false;
              console.log('got a response', resp);
            }
          });
        }
        setTimeout(function () {
          chrome.tabs.sendMessage(tab.id, { text: 'click' }, function (resp) {
            console.log('clicked', resp);
          });
        }, 1000);
      });
    }
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.google.com' },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
