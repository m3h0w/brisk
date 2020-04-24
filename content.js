const inputs = [].slice.call(document.getElementsByTagName('input'));
const buttons = [].slice.call(document.getElementsByTagName('button'));
const mainInput = inputs.find((input) => input.value === 'stackoverflow.com');
const submitButton = buttons.find((b) => b.type === 'submit');

let poped = false;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);
  if (msg.text === 'report_back') {
    if (!poped) {
      poped = true;
      if (mainInput) {
        chrome.storage.sync.get('startString', function (data) {
          const { startString } = data;

          const value = window.prompt('Enter SO query', 'list comprehension');
          if (value) {
            const searchValue = `${startString} ${value} stackoverflow.com`;
            chrome.storage.sync.set({ lookingFor: searchValue }, function () {
              console.log('startString set to python');
            });
            mainInput.value = searchValue;
            submitButton.click();
          } else {
            sendResponse(false);
            return;
          }
        });
      }
      sendResponse(true);
    }
  }
  if (msg.text === 'click') {
    sendResponse(true);
    chrome.storage.sync.set({ lookingFor: searchValue }, function () {
      console.log('lookingFor set to', searchValue);
    });
  }
});

chrome.storage.sync.get('lookingFor', function (data) {
  const { lookingFor } = data;
  if (!lookingFor) {
    return;
  }
  const correctlyFilledSearch = inputs.find((input) => input.value === lookingFor);
  if (correctlyFilledSearch) {
    const urls = [].slice.call(document.getElementsByTagName('a'));
    console.log(urls);
    const firstSoUrl = urls.find((url) => url.href.includes('stackoverflow.com/questions'));
    console.log(firstSoUrl);
    firstSoUrl.click();
    chrome.storage.sync.remove('lookingFor', function () {
      console.log('removed lookingFor variable from storage');
    });
    sendResponse(true);
  }
});
