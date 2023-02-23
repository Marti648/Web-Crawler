// import fetch from "node-fetch";
const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL, pages) {

    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    if (baseURLObj.hostname !== currentURLObj.hostname) { //same host ex google.com
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages;
    }

    pages[normalizedCurrentURL] = 1

    console.log(`currently crawling page ${currentURL}`);

    try {
        const response = await fetch(currentURL)

        if (response.status > 399) {
            console.log(`error with status code: ${response.status} on page ${currentURL}`);
            return pages
        }
        const contentType = response.headers.get('content-type');

        if (!contentType.includes('text/html')) {
            console.log(`non html response. Content type: ${contentType} on page ${currentURL}`);
            return pages
        }


        const htmlBody = response.text();
        const nextURLs = getURLsFromHTML(htmlBody, baseURL);
        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages);
        }

    } catch (err) {
        console.log(`error in fetch: ${err.message} on page ${currentURL}`);
    }
    return pages;
}

function getURLsFromHTML(htmlBody, baseUrl) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0, 1) === '/') {
            //relative URL (only path for ex /path)
            try {
                const urlObj = new URL(`${baseUrl}${linkElement.href}`);
                urls.push(normalizeURL(urlObj.href));
            } catch (err) {
                console.log(`error with relative URL: ${err.message}`);
            }

        } else {
            //absolute URL (full URL ex https://google.com)
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(normalizeURL(urlObj.href));
            } catch (err) {
                console.log(`error with absolute URL: ${err.message}`);
            }
        }
    }
    return urls;
}


function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostpath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostpath.length > 0 && hostpath.slice(-1) === '/') {
        return hostpath.slice(0, -1);
    }
    return hostpath;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}