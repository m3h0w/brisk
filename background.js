'use strict';

function constructSearchUrl(searchQuery) {
  return `https://www.google.com/search?sourceid=chrome&ie=UTF-8&q=${searchQuery}%20stackoverflow.com`;
}

console.log('background is running');

const SLEEP_TIME = 150;
const MAX_MSG_TRIES = 50;
const { USE_N_KEYS } = globalThis.settings;
console.log(USE_N_KEYS);

chrome.runtime.onInstalled.addListener(function () {
  chrome.windows.getCurrent(undefined, (window) => {
    chrome.storage.sync.set({ window: window.id }, function () {
      console.log('Current window is ' + window.id);
    });
  });

  chrome.storage.sync.set({ startString: 'python' }, function () {
    console.log('startString set to python');
  });
});

// make sure used window id from storage is removed when the used window is closed
chrome.windows.onRemoved.addListener(function (removedWindowId) {
  chrome.storage.sync.get('window', function (data) {
    const windowId = data.window;
    if (removedWindowId === windowId) {
      chrome.storage.sync.remove('window', function () {
        console.log('Removed used window id from storage', windowId);
      });
    }
  });
});

function createTabAndExecuteSoSearch(windowId) {
  chrome.tabs.create({ windowId, url: constructSearchUrl('') }, async function (tab) {
    chrome.windows.update(windowId, { focused: true, drawAttention: true });
    let sending = true;
    let counter = 0;
    let shouldClick = false;
    while (sending && counter < MAX_MSG_TRIES) {
      counter += 1;
      await globalThis.sleep(SLEEP_TIME);
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
    // await sleep(100);
    sending = true;
    counter = 0;
    while (sending && counter < MAX_MSG_TRIES) {
      counter += 1;
      await globalThis.sleep(SLEEP_TIME);
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

chrome.commands.getAll(function (commands) {
  const shortcut = commands.find((v) => v.name === 'search-so').shortcut;
  chrome.storage.sync.set({ searchCommand: shortcut }, function () {
    console.log('setting searchCommand to', shortcut);
  });
});

chrome.commands.onCommand.addListener(async function (command) {
  console.log({ command });
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

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
  if (!tab.url) {
    return;
  }

  let switchedIcon = false;
  for (let index = 1; index <= USE_N_KEYS; index++) {
    globalThis.getUrlValue(index.toString(), (url) => {
      if (tab.url === url) {
        chrome.browserAction.setIcon({ path: `./images/icon_${index}.png`, tabId });
        console.log('matched');
        switchedIcon = true;
      }
    });
  }

  if (!switchedIcon) {
    chrome.browserAction.setIcon({ path: '', tabId });
  }
});
