chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['hasRun'], (result) => {
    if (!result.hasRun) {
	  const globalStorage = {};
	  globalStorage["Movies"] = ["#"];
	  globalStorage["Words"] = ["#"];
	  globalStorage["Props"] = ["#"];
	  globalStorage["updateThis"] = [""];

      chrome.storage.local.set({ globalStorage: globalStorage, hasRun: true }, () => { console.log ('Global Storage has been set up. We´re good to go!'); });
    }
  });
});