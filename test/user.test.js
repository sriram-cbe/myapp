var sum = require('../routes/sum');

test("Adding 1 + 2 to yield 3", () => {
    expect(sum.add(1, 2)).toBe(3);
});

