if (!window.hasAddedListener) {
  window.hasAddedListener = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

	const idBody = ["/Mandarin_Blueprint/","-field-"];
	const detectors = ["PROP", "NOTES", "LIVED EXPERIENCE", "MNEMONIC"];

	let decodedChar = message.decoded_char;
	let identifier = idBody.join(decodedChar);
	
	let notfound = true;
	let index = 0;
	let infoSend = null;


	while (index < detectors.length-1 && notfound === true) {
	 let tempIdentifier = identifier + detectors[index];
	 let element = document.getElementById(tempIdentifier);
	 
	 if (!Object.is(element, null)) {
	   let info = decodedChar + "|" + (element.innerText || element.value);
	   infoSend = [detectors[index], info];
	   
	   if (detectors[index] === "LIVED EXPERIENCE") {
	     let extraIdentifier = detectors[index+1];
	     tempIdentifier = identifier + extraIdentifier;

		 element = document.getElementById(tempIdentifier);
		 info = decodedChar + "|" + (element.innerText || element.value);
		 
		 infoSend.push(extraIdentifier);
		 infoSend.push(info);
	   }
	   index = index + 1;
	   notfound = false;
	 }
	 index = index + 1;
	}
		
    if (infoSend !== undefined && infoSend !== null) {
	 chrome.storage.local.get(['globalStorage'], (result) => {
	  const storage = result.globalStorage || {};
	  for (let i=0; i<infoSend.length; i+=2) {
	   let finalHandle = transformHandle(infoSend[i]);
	   let insideStorage = storage[finalHandle];
	     insideStorage.push(infoSend[i]);
	     insideStorage.push(infoSend[i+1]);
		 if (infoSend[i] === "MENMONIC") { insideStorage[0] = insideStorage.length-4; } else { insideStorage[0] = insideStorage.length-2; }
		 storage["updateThis"] = finalHandle;
		 chrome.storage.local.set({ globalStorage: storage });
	  }
	 });
    }

  });
}

function transformHandle(originalHandle) {
  let handle = "";
  switch (originalHandle) {
   case 'PROP':
     handle = 'Props';
   break;
   case 'NOTES':
     handle = 'Movies';
   break;
   
   case 'LIVED EXPERIENCE':
   case 'MNEMONIC':
     handle = 'Words';
   break;
  }
  return handle;
}