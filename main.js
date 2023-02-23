const { crawlPage } = require("./crawl");
const { printReport } = require("./report.js");

async function main() {
    if (process.argv.length < 3) {
        console.log('no url provided');
    } else if (process.argv.length > 3) {
        console.log('too many arguments provided')
    }

    baseURL = process.argv[2]
    console.log(`starting crawl of ${baseURL}`);
    const pages = await crawlPage(baseURL, baseURL, {});

    printReport(pages);
}

main();