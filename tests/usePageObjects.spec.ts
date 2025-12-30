import { expect, test } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutsPage } from "../page-objects/formLayoutsPage";
import { passwordStrategyOptions } from "@nebular/auth";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("navigate to form layout page", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.formLayoutsPage();
  await navigateTo.datepickerPage();
  await navigateTo.smartTablePage();
  await navigateTo.toastrPage();
  await navigateTo.tooltipPage();
});

test('submit grid from with credentials',async ({page})=>{
    const navigateTo = new NavigationPage(page);
    const formLayoutsPage=new FormLayoutsPage(page);

    await navigateTo.formLayoutsPage();
    await formLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption('test@example.com','123456','Option 1');
})
test('parametrized methods',async ({page})=>{
    const navigateTo = new NavigationPage(page);
    const formLayoutsPage=new FormLayoutsPage(page);

    await navigateTo.formLayoutsPage();
    await formLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption('test@example.com','123456','Option 1');
    await formLayoutsPage.submitInlineFormWithNameEmailAndCheckbox('test','test@example.com',false);
})