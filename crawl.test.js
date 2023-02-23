const { normalizeURL, getURLsFromHTML } = require('./crawl');
const { test, expect } = require('@jest/globals');

test('normalizeURL', () => {
    const actual = normalizeURL('https://google.com/path');
    const expected = 'google.com/path'
    expect(actual).toEqual(expected);
})

test('normalizeURL strip trailing slash', () => {
    const actual = normalizeURL('https://google.com/path/');
    const expected = 'google.com/path'
    expect(actual).toEqual(expected);
})

test('normalizeURL capitals', () => {
    const actual = normalizeURL('https://GOOGLE.com/path/');
    const expected = 'google.com/path'
    expect(actual).toEqual(expected);
})

test('getURLsFromHTML absolute', () => {
    const htmlBody = `
    <html>
        <body>
            <a href="https://google.com"> Google </a>
        </body>
    </html>`

    const baseUrl = "https://google.com";
    const actual = getURLsFromHTML(htmlBody, baseUrl);
    const expected = ["google.com"];
    expect(actual).toEqual(expected);
});


test('getURLsFromHTML relative', () => {
    const htmlBody = `
    <html>
        <body>
            <a href="/path"> Google </a>
        </body>
    </html>`

    const baseUrl = "https://google.com";
    const actual = getURLsFromHTML(htmlBody, baseUrl);
    const expected = ["google.com/path"];
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML relative and absolute', () => {
    const htmlBody = `
    <html>
        <body>
            <a href="https://google.com/path1"> Google </a>
            <a href="/path2"> Google </a>
        </body>
    </html>`

    const baseUrl = "https://google.com";
    const actual = getURLsFromHTML(htmlBody, baseUrl);
    const expected = ["google.com/path1", "google.com/path2"];
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML invalid URL', () => {
    const htmlBody = `
    <html>
        <body>
            <a href="invalid"> Google </a>
        </body>
    </html>`

    const baseUrl = "https://google.com";
    const actual = getURLsFromHTML(htmlBody, baseUrl);
    const expected = [];
    expect(actual).toEqual(expected);
});


