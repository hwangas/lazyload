/* has a list of activeTabs
 * if a request comes in and the tab is not in activeTabs then cancel it
 * else fulfill the request
 * have a callback method for a tab switching thing
 * if the tab switched to is not in activeTabs then add it to activeTabs
 * remove the tab from the activeTabs if it is closed
 * when the current tab is switched to a tab never loaded before (aka not in activeTabs)
 *      then add it to activeTabs and reload it
 */

console.log("BEGINNING OF LAZYLOAD");

var activeTabs = {};

// add the current selected tab
chrome.tabs.query( {active: true, currentWindow: true}, function(tab) {
    console.log("adding current tab: " + tab.id);
    activeTabs[tab.id] = 1;
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var value = activeTabs[details.tabId] == null;
        console.log("reached onBeforeRequest details.tabId: " + details.tabId);
        console.log("should fulfill request?: " + value);
        return {cancel: value};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log("reached onActivated activeInfo.tabId: " + activeInfo.tabId);
    if(activeTabs[activeInfo.tabId] == null) {
        console.log("adding tabId: " + activeInfo.tabId);
        activeTabs[activeInfo.tabId] = 1;
        //don't refresh here it breaks things for some fucking reason
        //unfortunately if you don't refresh  then the user has to wait a bit for
        //the page to naturally refresh itself due to incoming requests
        //(length of wait depends on when the next request naturally comes in)
        //chrome.tabs.reload(activeInfo.tabId);
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    console.log("reached onRemoved tabId: " + tabId);
    delete activeTabs[tabId];
});
