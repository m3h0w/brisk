const inputs = [].slice.call(document.getElementsByTagName('input'));
const buttons = [].slice.call(document.getElementsByTagName('button'));
const mainInput = inputs.find((input) => input.value === 'stackoverflow.com');
const submitButton = buttons.find((b) => b.type === 'submit');

const { USE_N_KEYS } = globalThis.settings;

let poped = false;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'report_back') {
    if (!poped) {
      poped = true;
      if (mainInput) {
        chrome.storage.sync.get('startString', function (data) {
          const { startString } = data;

          const value = window.prompt('Enter SO query', 'list comprehension');
          if (value) {
            const searchValue = startString
              ? `${startString} ${value} stackoverflow.com`
              : `${value} stackoverflow.com`;
            globalThis.setSearchValue(searchValue);
            mainInput.value = searchValue;
            submitButton.click();
          } else {
            sendResponse(false);
          }
        });
      }
      sendResponse(true);
    }
  }
  if (msg.text === 'click') {
    sendResponse(true);
  }
});

const extractOnlyStackQuestionAElements = (aElements) => {
  const filterFunc = (aElements) => {
    return aElements.href.includes('stackoverflow.com/questions') && !aElements.href.includes('webcache');
  };
  return aElements.filter(filterFunc);
};

chrome.storage.sync.get('lookingFor', function (data) {
  const { lookingFor } = data;
  if (!lookingFor) {
    return;
  }
  const correctlyFilledSearch = inputs.find((input) => input.value === lookingFor);
  if (correctlyFilledSearch) {
    const allFoundAElements = [].slice.call(document.getElementsByTagName('a'));
    const soUrlAElements = extractOnlyStackQuestionAElements(allFoundAElements);
    const soUrlFirstAElement = soUrlAElements[0];

    console.log({ USE_N_KEYS });
    for (let index = 1; index <= USE_N_KEYS; index++) {
      if (soUrlAElements[index - 1]) {
        globalThis.setUrlValue(soUrlAElements[index - 1].href, index);
      }
    }

    soUrlFirstAElement.click();
    globalThis.removeSearchValue();
  }
});
