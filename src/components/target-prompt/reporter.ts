"use server";

import * as chromeLauncher from 'chrome-launcher';

export async function createReports(sites: string[]) {
    let report;
    const chrome = await chromeLauncher.launch({chromeFlags: ['--no-sandbox'], port: 8080 });

    import('lighthouse').then(lighthouse => {
        const options = {logLevel: "info", output: 'html', onlyCategories: ['accessibility'], port: chrome.port};
        report = lighthouse(sites[0], options);
    
        chrome.kill();
    }).catch(e => console.error(e))


    return report;
}