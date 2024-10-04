"use server";

import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import { AxeResults } from 'axe-core';
import { createHtmlReport } from 'axe-html-reporter'; 

export async function createReport(url: string) {
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();
        await page.goto(url);
        const results = await new AxePuppeteer(page).analyze();
        
        await browser.close();
        return results
    } catch (e : unknown) {
        await browser.close();
        console.error(e)
        throw new Error("Failed creating Axe Report. Check console logs for more information.");
    }
}

export async function createHTMLReportFormJSON(report: AxeResults) {
    const convertedPageName = report.url.replace('https:', '').replaceAll('/', '').replaceAll('.', '-');
    const convertedTimeStamp = Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'short' }).format(new Date(report.timestamp)).replaceAll('.', '-');
    const fileName = `${convertedPageName}-${convertedTimeStamp}.html`;
    const htmlReport = createHtmlReport({
        results: report,
        options: {
            reportFileName: fileName
        }
    });

    return htmlReport;
}
