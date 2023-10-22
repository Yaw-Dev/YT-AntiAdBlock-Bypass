// ==UserScript==
// @name         YouTube Anti-AdBlock Bypass via YouTube Enhancer
// @namespace    https://e-z.bio/yaw
// @homepage     https://github.com/AWeirDKiD/YT-AntiAdBlock-Bypass
// @icon         https://www.gstatic.com/youtube/img/branding/favicon/favicon_192x192.png
// @version      1.5.3
// @description  A simple method of bypassing YouTube's AdBlock Detection using Enhancer for YouTube's "Remove Ads" button. Does not require the use of any external website like similar tools do. | Now featuring a GUI for easy configuration!
// @author       Yaw
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    var searchInterval = GM_getValue('searchInterval', 800);
    var failCounter = 0;
    var masterSwitch = true;

    function createSettingsMenu() {
        const settingsButton = Object.assign(document.createElement('button'), {
            textContent: 'Bypasser Settings'
        });

        Object.assign(settingsButton.style, {
            position: 'fixed',
            top: '15px',
            left: '200px',
            background: 'rgba(12, 12, 12, 0.3)',
            color: '#fff',
            border: '1px solid #FE2020',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            zIndex: '9999'
        });

        document.body.appendChild(settingsButton);

        const settingsMenuHTML = `
            <div id="yt-settings-menu" style="display: none; position: fixed; top: 50px; left: 52px; background: rgba(12, 12, 12, 0.7); color: #fff; border: 1px solid #FE2020; border-radius: 10px; padding: 10px; z-index: 10000;">
            <button id="close-menu" style="position: absolute; top: 8px; right: 10px; background: transparent; color: #DEDDDD; border: none; cursor: pointer; font-size: 15px;">x</button>
                <h2 style="text-align: center;">Bypasser Settings</h2>
                <br>
                <div style="text-align: center; margin-top: 5px; margin-bottom: 0px;">
                    <label for="search-interval" style="display: inline-block; width: 100px; vertical-align: middle;">Search Interval:</label>
                    <input type="range" id="search-interval" min="100" max="5000" style="display: inline-block; vertical-align: middle; cursor: pointer;">
                    <span id="search-interval-value" style="display: inline-block; vertical-align: middle;">800</span>
                </div>
                <div style="text-align: center; margin-top: 10px;">
                    <button id="save-settings" style="background: #555; color: #fff; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">Save Settings</button>
                    <p style="color: #aaa; display: inline-block; margin-left: 10px;">(Page will refresh)</p>
                </div>
                <p style="text-align: center; color: #aaa; margin-top: 10px;">Made by github.com/AWeirDKiD (Yaw)</p>
            </div>
        `;

        const settingsMenu = Object.assign(document.createElement('div'), {
            innerHTML: settingsMenuHTML,
            style: "z-index: 10000;"
        });
        document.body.appendChild(settingsMenu);

        settingsButton.addEventListener('click', () => {
            document.getElementById('yt-settings-menu').style.display = 'block';
            document.getElementById('search-interval').value = searchInterval;
            document.getElementById('search-interval-value').textContent = searchInterval;
        });

        document.getElementById('search-interval').addEventListener('input', () => {
            searchInterval = parseInt(document.getElementById('search-interval').value);
            document.getElementById('search-interval-value').textContent = searchInterval;
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            GM_setValue('searchInterval', searchInterval);
            location.reload()
            document.getElementById('yt-settings-menu').style.display = 'none';
        });

        document.getElementById('close-menu').addEventListener('click', () => {
            document.getElementById('yt-settings-menu').style.display = 'none';
        });
    }

    function removeAds() {
        const currentURL = window.location.href;
        if (masterSwitch) {
            if (/https:\/\/www\.youtube\.com\/watch\?.*/.test(currentURL)) {
                const button = document.getElementById("efyt-not-interested");
                const adShowing = document.querySelector('.ad-showing');
                if (adShowing) {
                    if (button) {
                        button.click();
                        console.log("Button found and clicked.")
                        failCounter = 0;
                    }
                    else {
                        console.log("Failed to find button. Retrying in ", searchInterval, " ms");
                        failCounter = failCounter + 1;
                    }
                    if (failCounter > 10) {
                        var buttonNotFound = window.confirm("Failed to find the 'Remove Ads' button. Please make sure that Enhancer for YouTube is installed.\n\nPress 'OK' to redirect to the installation page.\nPress 'Cancel' to disable the Bypasser for this session.");
                        if (buttonNotFound) {
                            window.open("https://chrome.google.com/webstore/detail/enhancer-for-youtube/ponfpcnoihfmfllpaingbgckeeldkhle");
                            failCounter = 0;
                        } else {
                            masterSwitch = false;
                        }
                    }
                }
            }
        }
    }
    createSettingsMenu();
    setInterval(removeAds, searchInterval);
})();
