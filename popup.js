let changeColor = document.getElementById('changeColor');
let changeColorTitle = document.getElementById('changeColorTitle');

chrome.windows.getCurrent(undefined, (window) => {
  chrome.storage.sync.get('window', function (data) {
    const { window: windowId } = data;
    if (windowId === window.id) {
      changeColor.hidden = true;
      changeColorTitle.textContent = 'Using this Chrome window';
    }
  });
});

changeColor.onclick = function (element) {
  // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //   chrome.tabs.executeScript(tabs[0].id, { code: 'document.body.style.backgroundColor = "black";' });
  // });

  chrome.windows.getCurrent(undefined, (window) => {
    chrome.storage.sync.get('window', function (data) {
      const { window: windowId } = data;
      if (windowId === window.id) {
        changeColor.hidden = true;
        changeColorTitle.textContent = 'Using this Chrome window';
      }
    });

    chrome.storage.sync.set({ window: window.id }, function () {
      console.log('Current window is ' + window.id);
      changeColor.hidden = true;
      changeColorTitle.textContent = 'Using this Chrome window';
    });
  });
};
