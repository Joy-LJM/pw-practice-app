import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page },testinfo) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

test("auto waiting", async ({ page }) => {
  const successBtn = page.locator(".bg-success");
  await successBtn.click();

  // const text=await successBtn.textContent();
  await successBtn.waitFor({ state: "attached" });
  const text = await successBtn.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
  await expect(successBtn).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test("alternative waits", async ({ page }) => {
  const successBtn = page.locator(".bg-success");

  // wait for element
  // await page.waitForSelector(".bg-success");
  // wait for particular response
  await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  const text = await successBtn.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});

test('timeout', async ({ page }) => {
  const successBtn = page.locator(".bg-success");
  // test.setTimeout(10000);

  test.slow()
  await successBtn.click();
  // await successBtn.click({timeout:16000});
})