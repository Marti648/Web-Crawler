const { sortPages } = require("./report.js");

test('sortPages', () => {
    const input = {
        "https://google.com": 5,
        "https://google.com/path": 1
    }


    const actual = sortPages(input);
    const expected = [
        ["https://google.com", 5],
        ["https://google.com/path", 1]
    ]
    expect(actual).toEqual(expected);
})