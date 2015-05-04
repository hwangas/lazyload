/* Lazyload
 * @author  Anna Hwang (github: hwangas)
 * @descrip A Chrome browser extension created to enable "lazy tab loading".
 *          Tabs will not load on startup unless they are the active tab.
 *          Makes bootup a bit faster and Chrome take up less memory.
 */

// the object of active tabs
var activeTabs = {};
var empty = true;

// add the current selected tab
chrome.tabs.query( {active: true, currentWindow: true}, function(tab) {
    if(empty == true) {
        activeTabs[tab.id] = 1;
        chrome.tabs.reload(activeInfo.tabId);
        empty = false;
    }
});

// body check every webrequest make sure they're authorized
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var value = activeTabs[details.tabId] == null;
        return {cancel: value};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);

// when a tab is selected, add it to activeTabs if it is not already there
chrome.tabs.onActivated.addListener(function(activeInfo) {
    if(activeTabs[activeInfo.tabId] == null) {
        activeTabs[activeInfo.tabId] = 1;
        //don't refresh here it breaks things for some fucking reason
        //unfortunately if you don't refresh then the user has to wait a bit for
        //the page to naturally refresh itself due to incoming requests
        //(length of wait depends on when the next request naturally comes in)
        //OR MAYBE ITS NOT AN ISSUE
        //???
        chrome.tabs.reload(activeInfo.tabId);
    }
});

// remove any tab from activeTabs that is closed cuz they are not relevant anymore
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    delete activeTabs[tabId];
});
