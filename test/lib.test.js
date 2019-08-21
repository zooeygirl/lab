const functions = {
  add: (num1, num2) => num1 + num2
};

test("our first test", () => {
  throw new Error("Something failed.");
});

test("add", () => {
  expect(functions.add(2, 2)).toBe(4);
});
