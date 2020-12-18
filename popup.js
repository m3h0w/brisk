const useThisWindowButtonElement = document.getElementById('use-this-window-button');
const whichChromeWindowTitleElement = document.getElementById('which-chrome-window-title');
const startStringElement = document.getElementById('start-string');
const shortcutElement = document.getElementById('shortcut');
const changeShortcutElement = document.getElementById('change-shortcut');

const MANAGE_SHORTCUTS_URL = 'chrome://extensions/shortcuts';
const openManageShortcutsTab = () => {
  getWindowFromStorage((windowId) => {
    chrome.tabs.create({ windowId, url: MANAGE_SHORTCUTS_URL }, async function (tab) {
      chrome.tabs.update(tab.id, { active: true }, (tab) => {});
    });
  });
};
changeShortcutElement.onclick = openManageShortcutsTab;
changeShortcutElement.style = 'cursor: pointer; width: 100%';

const getWindowFromStorage = (callback) => {
  chrome.storage.sync.get('window', function (data) {
    const { window: windowId } = data;
    callback(windowId);
  });
};

chrome.windows.getCurrent(undefined, (window) => {
  chrome.storage.sync.get('window', function (data) {
    const { window: windowId } = data;
    if (windowId === window.id) {
      useThisWindowButtonElement.hidden = true;
      whichChromeWindowTitleElement.textContent = 'Using this Chrome window';
    }
  });
});

chrome.storage.sync.get('startString', (data) => {
  const { startString } = data;
  startStringElement.value = startString;
  startStringElement.onchange = (e) => {
    chrome.storage.sync.set({ startString: e.target.value }, function () {});
  };
});

chrome.storage.sync.get('searchCommand', function (data) {
  const { searchCommand } = data;
  shortcutElement.innerText = searchCommand;
});

useThisWindowButtonElement.onclick = function (element) {
  chrome.windows.getCurrent(undefined, (window) => {
    getWindowFromStorage(function (windowId) {
      if (windowId === window.id) {
        useThisWindowButtonElement.hidden = true;
        whichChromeWindowTitleElement.textContent = 'Using this Chrome window';
      }
    });

    chrome.storage.sync.remove({ window: window.id }, function () {
      console.log('Current window is ' + window.id);
      useThisWindowButtonElement.hidden = true;
      whichChromeWindowTitleElement.textContent = 'Using this Chrome window';
    });
  });
};
