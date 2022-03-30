var str

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        userstatus: "Good"
    });
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') 
    {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["/content.js"]
        })
        .then(() => {
            console.log("Injecting content script");
            chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, function(response) {
                console.log(response.status)
                str = response.status
                if(str == "yes")
                {
                    chrome.scripting.insertCSS({
                        target: { tabId: tabId },
                        files: ["./foreground_styles.css"]
                    })
                    .then(() => {
                        console.log("INJECTED THE FOREGROUND STYLES.");
        
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ["./foreground.js"]
                        })
                            .then(() => {
                                console.log("INJECTED THE FOREGROUND SCRIPT.");
                            });
                    })
                    .catch(err => console.log(err));
                }
            })
        });
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_user_status') {
        chrome.storage.local.get('userstatus', data => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    message: 'fail'
                });

                return;
            }

            sendResponse({
                message: 'success',
                payload: data.userstatus
            });
        });

        return true;
    } else if (request.message === 'change_status') {
        chrome.storage.local.set({
            userstatus: request.payload
        }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({ message: 'fail' });
                return;
            }
                sendResponse({ message: 'success' });
            
        })

        return true;
    }
});