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
        mainInput.value = `${value} stackoverflow.com`;
        submitButton.click();
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

// ready(function () {
//   const urls = [].slice.call(document.getElementsByTagName('a'));
//   console.log(urls);
//   const firstSoUrl = urls.find((url) => url.href.includes('stackoverflow.com/questions'));
//   console.log(firstSoUrl);
//   if (allowClick) {
//     firstSoUrl.click();
//   }
//   allowClick = false;
// });

// const inputs = [].slice.call(document.getElementsByTagName('input'));
// const buttons = [].slice.call(document.getElementsByTagName('button'));
// const mainInput = inputs.find((input) => input.value === 'stackoverflow.com');
// const submitButton = buttons.find((b) => b.type === 'submit');

// if (mainInput) {
//   const value = window.prompt('Enter SO query', 'python list comprehension');
//   mainInput.value = `${value} stackoverflow.com`;
//   submitButton.click();
// }

// ready(() => {
//   const urls = [].slice.call(document.getElementsByTagName('a'));
//   console.log(urls);
//   const firstSoUrl = urls.find((url) => url.href.includes('stackoverflow.com/questions'));
//   console.log(firstSoUrl);
//   // firstSoUrl.click();
// });

console.log(mainInput);

console.log('content script loaded');
