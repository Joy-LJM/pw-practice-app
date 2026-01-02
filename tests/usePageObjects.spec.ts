import { expect, test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import {faker} from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("navigate to form layout page", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().datepickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("submit grid from with credentials", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formLayoutsPage();
  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      "test@example.com",
      "123456",
      "Option 1"
    );
});
test("parametrized methods", async ({ page }) => {
  const pm = new PageManager(page);
  const randomFullname= faker.person.fullName();
  const randomEmail=`${randomFullname.replace(" ",'')}${faker.number.int(1000)}@test.com`
  await pm.navigateTo().formLayoutsPage();
  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      randomEmail,
      "123456",
      "Option 1"
    );
  await page.screenshot({path:'screenshot/formLayoutsPage.png'})
  const buffer=await page.screenshot();
  console.log(buffer.toString('base64'));
  
  await pm
    .onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      randomFullname,
      randomEmail,
      false
    );
  await page.locator("nb-card", { hasText: "Inline Form" }).screenshot({path:'screenshot/InlineForm.png'})
  
});
