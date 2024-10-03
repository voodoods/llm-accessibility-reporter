"use server";

import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import { browser } from 'process';
 
export async function createReport(url: string) {
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();
        await page.goto(url);
        const results = await new AxePuppeteer(page).analyze();
        
        await browser.close();
        return results
    } catch (e) {
        await browser.close();
        throw new Error(`Axe Report failed on: ${url}`);
    }

}