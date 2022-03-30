
var str = "no"

var labels = document.getElementsByTagName('LABEL');
for(var i = 0; i < labels.length; i++)
{
    if(labels[i].innerHTML.includes("Card number") || labels[i].innerHTML.includes("Card Number"))
        str = "yes"

}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        sendResponse({status: str});
    }
});