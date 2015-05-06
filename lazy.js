/* Lazyload
 * @author  Anna Hwang (github: hwangas)
 * @descrip A Chrome browser extension created to enable "lazy tab loading".
 *          Tabs will not load on startup unless they are the active tab.
 *          Makes bootup a bit faster and Chrome take up less memory.
 */

//console.log("LAZYTABS");

// the object of active tabs
var activeTabs = {};

// add the current selected tab
chrome.tabs.query( {active: true, currentWindow: true}, function(tab) {
    /*
    console.log("query adding tab: " + tab.id);
    console.log("tab url: " + tab.url);
    */
    activeTabs[tab.id] = 1;
});

// body check every webrequest make sure they're authorized
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        /*
        console.log("request from tab: " + details.tabId);
        console.log("tab url: " + details.url);
        console.log(details.tabId != -1 && activeTabs[details.tabId] == null);
        */
        return {cancel: details.tabId != -1 && activeTabs[details.tabId] == null};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);

// when a tab is selected, add it to activeTabs if it is not already there
chrome.tabs.onActivated.addListener(function(activeInfo) {
    /*
    console.log("onActivated from tab: " + activeInfo.tabId);
    */
    if(activeTabs[activeInfo.tabId] == null) {
        /*
        console.log("(ADDED) tab url: " + activeInfo.url);
        */
        activeTabs[activeInfo.tabId] = 1;
        chrome.tabs.reload(activeInfo.tabId);
    }
});

// remove any tab from activeTabs that is closed cuz they are not relevant anymore
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    /*
    console.log("removed tab: " + tabId);
    */
    delete activeTabs[tabId];
});
