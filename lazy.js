/* Lazyload
 * @author  Anna Hwang <anna.s.hwang@vanderbilt.edu>
 *          Copyright 2015
 * @descrip A Chrome browser extension created to enable "lazy tab loading".
 *          Tabs will not load on startup unless they are the active tab.
 *          Makes bootup a bit faster and Chrome take up less memory.
 * @url     https://github.com/hwangas/lazyload
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @etc     Tested in Google Chrome 42.0.2311.135 (64-bit) and
 *          Google Chrome OS 42.0.2311.134 (64-bit)
 */

// the object of active tabs
var activeTabs = {};

// add the currently selected tab
chrome.tabs.query( {active: true, currentWindow: true}, function(tab) {
    activeTabs[tab.id] = 1;
});

// body-check every webrequest make sure they're authorized
// Google seems to do things in the background with tab id -1 so let those go
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {cancel: details.tabId != -1 &&
                        activeTabs[details.tabId] == null};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);

// when a tab is selected, add it to activeTabs if it is not already there
chrome.tabs.onActivated.addListener(function(activeInfo) {
    if(activeTabs[activeInfo.tabId] == null) {
        activeTabs[activeInfo.tabId] = 1;
        chrome.tabs.reload(activeInfo.tabId);
    }
});

// remove any tab from activeTabs that is closed
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    delete activeTabs[tabId];
});

// add any tab that is created
chrome.tabs.onCreated.addListener(function(tab) {
    activeTabs[tab.tabId] = 1;
});
