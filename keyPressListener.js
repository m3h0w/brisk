console.log('keyPressListener loaded');

const { USE_N_KEYS } = globalThis.settings;

if (window === top) {
  window.addEventListener('keydown', doKeyPress, false);
}

const goToUrl = (url) => {
  window.location.replace(url);
};

async function doKeyPress(e) {
  console.log({ e }, USE_N_KEYS);
  for (let index = 1; index <= USE_N_KEYS; index++) {
    const key = index.toString();
    if (e.altKey && e.key === key) {
      e.preventDefault();
      globalThis.getUrlValue(key, (url) => {
        console.log({ url });
        if (url.startsWith('https://stackoverflow.com/questions/')) {
          goToUrl(url);
        } else {
          const extractedUrl = url.substring(url.indexOf('https://stackoverflow.com/questions/'));
          if (extractedUrl) {
            goToUrl(extractedUrl);
          }
        }
      });
    }
  }
}
