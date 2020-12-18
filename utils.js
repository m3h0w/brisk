function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ready(callback) {
  if (document.readyState !== 'loading') callback();
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  else {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') callback();
    });
  }
}

const setSearchValue = (searchValue) =>
  chrome.storage.sync.set({ lookingFor: searchValue }, () => {
    console.log('lookingFor set to', searchValue);
  });

const removeSearchValue = () => {
  chrome.storage.sync.remove('lookingFor', function () {
    console.log('removed lookingFor variable from storage');
  });
};

const urlName = (index) => `so-url-${index}`;

const setUrlValue = (url, index) => {
  chrome.storage.sync.set({ [urlName(index)]: url }, () => {
    console.log(urlName(index), url);
  });
};

const getFromStorage = (name, callback) => {
  chrome.storage.sync.get(name, (data) => {
    console.log('getting', name, 'from', data);
    callback(data[name]);
    console.log('got', data[name]);
  });
};

const getUrlValue = (index, callback) => {
  if (typeof index === 'number') {
    getFromStorage(urlName(index.toString()), callback);
  } else {
    getFromStorage(urlName(index), callback);
  }
};

const fs = [sleep, ready, urlName, setSearchValue, setUrlValue, getUrlValue, removeSearchValue];

fs.forEach((f) => {
  globalThis[f.name] = f;
});
