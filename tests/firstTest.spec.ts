import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test.describe("test suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
  });
});

test("locator syntax rules", async ({ page }) => {
  // by tag name
  await page.locator("input").first().click();
  // by class value
  await page.locator(".shape-rectangle").first().click();
  // by id
  await page.locator("#inputEmail1").click();
  // by attribute
  await page.locator('[type="email"]').first().click();
  // by class value (full)
  await page
    .locator(
      '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
    )
    .first().click();
  // by partial text
  await page.locator(':text("Using")');
  // by exact text
  await page.locator(':text-is("Using the Grid")');
});

test('user facing locators',async({page})=>{
  await page.getByRole('button',{name:'Sign in'}).first().click();
  await page.getByRole('textbox').first().fill('test');
  await page.getByLabel('Email').first().click();
  await page.getByPlaceholder('Jane Doe').click();
  // use data-testid to set a custom locator in html element
  await page.getByTestId('SignIn').click();
  await page.getByTitle('IoT Dashboard').click();

})
test('locating child elements',async({page})=>{
  // nb-card>nb-radio
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")').click();
  // nth-child, index starts from 0
  await page.locator('nb-card').nth(3).getByRole('button').click();
  // combining
  await page.locator('nb-card').getByRole('button',{name:"Sign in"}).first().click();
})