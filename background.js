'use strict';

function constructSearchUrl(searchQuery) {
  return `https://www.google.com/search?sourceid=chrome&ie=UTF-8&q=${searchQuery}%20stackoverflow.com`;
}

const SLEEP_TIME = 100;

chrome.runtime.onInstalled.addListener(function () {
  chrome.windows.getCurrent(undefined, (window) => {
    chrome.storage.sync.set({ window: window.id }, function () {
      console.log('Current window is ' + window.id);
    });
  });

  chrome.commands.onCommand.addListener(async function (command) {
    if (command === 'search-so') {
      chrome.storage.sync.get('window', function (data) {
        const { window: windowId } = data;
        if (!windowId) {
          chrome.windows.getCurrent(undefined, (window) => {
            chrome.storage.sync.set({ window: window.id }, function () {
              console.log('Current window is ' + window.id);
            });
          });
        }
        chrome.tabs.create({ windowId, url: constructSearchUrl('') }, async function (tab) {
          let sending = true;
          while (sending) {
            await sleep(SLEEP_TIME);
            chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, function (resp) {
              if (resp) {
                sending = false;
                console.log('got a response', resp);
              }
            });
          }
          sending = true;
          while (sending) {
            await sleep(SLEEP_TIME);
            chrome.tabs.sendMessage(tab.id, { text: 'click' }, function (resp) {
              console.log('clicked', resp);
              if (resp) {
                sending = false;
                console.log('got a response', resp);
              }
            });
          }
        });
      });
    }
  });
});
