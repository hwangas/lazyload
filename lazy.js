/* has a list of activeTabs
 * if a request comes in and the tab is not in activeTabs then cancel it
 * else fulfill the request
 * have a callback method for aa tab switching thing
 * if the tab switched to is not in activeTabs then add it to activeTabs
 * remove the tab from the activeTabs if it is closed (& it a member ofc)
 * when the current tab is switched to a tab never loaded before (aka not in activeTabs)
 *      then add it to activeTabs and reload it
 */

console.log("BEGINNING OF LAZYLOAD");

var activeTabs = {};

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {cancel: activeTabs[details.id] != null};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);

chrome.tabs.onActivated.addListener(function(activeInfo) {
    if(activeTabs[activeInfo.tabId] == null) {
        activeTabs[activeInfo.tabId] = 1;
        var reload = 'window.location.reload();';
        chrome.tabs.executeScript(activeInfo.tabId, {code: reload});
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    activeTabs[tabId] = null;
});

//do i need onCreated?
