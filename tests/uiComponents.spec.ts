import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("form layout page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    await usingTheGridEmailInput.fill("test@example.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test2@example.com", {
      delay: 500,
    });

    // generic assertion
    const inputVal = await usingTheGridEmailInput.inputValue();
    expect(inputVal).toBe("test2@example.com");

    // locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2@example.com");
  });

  test('radio buttons',async ({page})=>{
    const usingTheGridForm = page
      .locator("nb-card", { hasText: "Using the Grid" });

    // await usingTheGridForm.getByLabel('Option 1').check({force:true})
    await usingTheGridForm.getByRole('radio',{name:'Option 1'}).check({force:true});

    // generic assertion
    // const radioStatus=await usingTheGridForm.getByRole('radio',{name:'Option 1'}).isChecked();
    // expect(radioStatus).toBeTruthy(); 

    // locator assertion
    await expect(usingTheGridForm.getByRole('radio',{name:'Option 1'})).toBeChecked();

    await usingTheGridForm.getByRole('radio',{name:'Option 2'}).check({force:true});
    expect(await usingTheGridForm.getByRole('radio',{name:'Option 1'}).isChecked()).toBeFalsy();
    expect(await usingTheGridForm.getByRole('radio',{name:'Option 2'}).isChecked()).toBeTruthy();
  })
});

test('checkbox',async({page})=>{
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Toastr').click();
  // check() method doesn't work when a checkbox is checked; click() doesn't check status
  // await page.getByRole('checkbox',{name:'Hide on click'}).click({force:true})
  await page.getByRole('checkbox',{name:'Prevent arising of duplicate toast'}).check({force:true})
  // await page.getByRole('checkbox',{name:'Show toast with icon'}).uncheck({force:true})

  // uncheck all checkboxes
  const allCheckboxes=page.getByRole('checkbox');
  for (const checkbox of await allCheckboxes.all()){
    await checkbox.uncheck({force:true});
    expect(await checkbox.isChecked()).toBeFalsy();
  }
}
)
