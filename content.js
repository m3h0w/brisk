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
        const value = window.prompt('Enter SO query', 'python list comprehension');
        if (value) {
          mainInput.value = `${value} stackoverflow.com`;
          submitButton.click();
        } else {
          sendResponse(false);
          return;
        }
      }
      sendResponse(true);
    }
  }
  if (msg.text === 'click') {
    const urls = [].slice.call(document.getElementsByTagName('a'));
    console.log(urls);
    const firstSoUrl = urls.find((url) => url.href.includes('stackoverflow.com/questions'));
    console.log(firstSoUrl);
    firstSoUrl.click();
    sendResponse(true);
  }
});
