document.addEventListener('DOMContentLoaded', () => { updateTabs('Movies'); });

document.getElementById('downloadNotes').addEventListener('click', () => { saveFile(document.getElementById('result').textContent); });

document.getElementById('Movies').addEventListener('click',() => { updateTabs('Movies'); });
document.getElementById('Words').addEventListener('click', () => { updateTabs('Words'); });
document.getElementById('Props').addEventListener('click', () => { updateTabs('Props'); });

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.globalStorage) {
    const updatedArray = changes.globalStorage.newValue;
	updateTabs(updatedArray["updateThis"]);
  }
});

if (!window.isSomeoneListening) {
 window.isSomeoneListening = true;

 document.getElementById('captureNote').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabID = tabs[0].id;
    const url = tabs[0].url;
    const lastPos = url.lastIndexOf('/');
    const character = url.substring(lastPos + 1);
    const decodedChar = decodeURIComponent(character);

	document.getElementById('message').textContent = "Grabbing " + decodedChar + " ...";
    chrome.scripting.executeScript({
      target: { tabId: tabID },
      files: ['content-script.js']
    }).then(() => {
      chrome.tabs.sendMessage(tabID, { decoded_char: decodedChar});
    });
  });
 });
}

document.getElementById('copyNotes').addEventListener('click', () => {
    document.getElementById('result').select();
    document.execCommand('copy');
	alert('Copied to clipboard');
});

document.getElementById('cleanAll').addEventListener('click', () => {
  document.getElementById('result').textContent = "";  
  chrome.storage.local.get(null, function (items) {
    for (var key in items) {
        if (key.startsWith('Movies') || key.startsWith('Words') || key.startsWith('Props')) {
            chrome.storage.local.remove(key);
        }
    }
  });
  
  const globalStorage = {};
  globalStorage["Movies"] = ["#"];
  globalStorage["Words"] = ["#"];
  globalStorage["Props"] = ["#"];
  globalStorage["updateThis"] = [""];
  
  chrome.storage.local.set({ globalStorage: globalStorage });
});

// -----------------------------------------------------------------------------------------------------------------------------
function displayContentBy(location) {
  chrome.storage.local.get('globalStorage', (result) => {
    const storage = result.globalStorage || {};
    let insideStorage = storage[location];
    let contentToAdd = "";
	let initPos = 0;
	for(let i=initPos+1; i<insideStorage.length; i+=2) {
     contentToAdd += insideStorage[i+1] + '\n';
	 if (insideStorage[i] !== "LIVED EXPERIENCE") {
	   contentToAdd += '\n';
	 }
    }
	document.getElementById('result').textContent = "";
    document.getElementById('result').textContent += contentToAdd;
	
	document.getElementById('message').textContent = "Your tabs have been updated but they are greedy ...so look around and grab another Movie, Word or Prop!";
 });
}

function updateTabs(location) {
  let checked_tab = document.getElementById(location);
  if (checked_tab !== null) { checked_tab.checked = true; }
  let previouslyChecked = document.getElementsByClassName('current')[0].id + "s";
  
  if(checked_tab.id !== previouslyChecked){
	  traverseAndRemoveClass('radioTab','current');
	  checked_tab.parentNode.classList.add('current');
  }
  displayContentBy(location);
}

function traverseAndRemoveClass(item, clase) {
	let allElementsByClass = document.getElementsByClassName(item);
	for (let element of allElementsByClass) { element.classList.remove(clase); }
}

function saveFile(packText) {
 let fileSaver = document.createElement("a");
 let fileContent = packText;
 let contentBlob = new Blob([fileContent], {type: "octet/stream"});
 
 fileSaver.setAttribute("style", "display:none");
 fileSaver.href = window.URL.createObjectURL(contentBlob);
 fileSaver.download = "download.txt";
 
 document.body.appendChild(fileSaver);
 fileSaver.click();
 document.body.removeChild(fileSaver);
 fileSaver = null;
}