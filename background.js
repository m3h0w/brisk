'use strict';

function constructSearchUrl(searchQuery) {
  return `https://www.google.com/search?sourceid=chrome&ie=UTF-8&q=${searchQuery}%20stackoverflow.com`;
}

const SLEEP_TIME = 150;

chrome.runtime.onInstalled.addListener(function () {
  chrome.windows.getCurrent(undefined, (window) => {
    chrome.storage.sync.set({ window: window.id }, function () {
      console.log('Current window is ' + window.id);
    });
  });
});

chrome.windows.getAll(undefined, function (windowIds) {
  console.log(windowIds.map((v) => v.id));
});

// make sure used window id from storage is removed when the used window is closed
chrome.windows.onRemoved.addListener(function (removedWindowId) {
  chrome.storage.sync.get('window', function (data) {
    const windowId = data.window;
    if (removedWindowId === windowId) {
      chrome.storage.local.remove('window', function () {
        console.log('Removed used window id from storage', windowId);
      });
    }
  });
});

function createTabAndExecuteSoSearch(windowId) {
  chrome.tabs.create({ windowId, url: constructSearchUrl('') }, async function (tab) {
    let sending = true;
    let counter = 0;
    let shouldClick = false;
    while (sending && counter < 100) {
      counter += 1;
      await sleep(SLEEP_TIME);
      chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, function (resp) {
        if (resp === true || resp === false) {
          sending = false;
          console.log('got a response', resp);
          shouldClick = resp;
        }
      });
    }
    if (!shouldClick) {
      return;
    }
    sending = true;
    counter = 0;
    while (sending && counter < 100) {
      counter += 1;
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
}

chrome.commands.onCommand.addListener(async function (command) {
  if (command === 'search-so') {
    chrome.storage.sync.get('window', function (data) {
      const windowId = data.window;
      chrome.windows.getAll(undefined, function (windowParamsArray) {
        const windowIds = windowParamsArray.map((v) => v.id);

        console.log('loaded windowid from storage', windowId);
        if (!windowId || !windowIds.includes(windowId)) {
          chrome.windows.getCurrent(undefined, (window) => {
            chrome.storage.sync.set({ window: window.id }, function () {
              console.log('Current window is ' + window.id);
              createTabAndExecuteSoSearch(window.id);
            });
          });
        } else {
          createTabAndExecuteSoSearch(windowId);
        }
      });
    });
  }
});
