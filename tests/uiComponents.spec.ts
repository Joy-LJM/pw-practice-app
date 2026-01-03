import { expect, test } from "@playwright/test";

// run specific test file in parallel mode
test.describe.configure({mode:'parallel'})

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe.only("form layout page @block", () => {
  test.describe.configure({retries:2})

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

  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    // await usingTheGridForm.getByLabel('Option 1').check({force:true})
    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });

    // generic assertion
    // const radioStatus=await usingTheGridForm.getByRole('radio',{name:'Option 1'}).isChecked();
    // expect(radioStatus).toBeTruthy();

    // locator assertion
    await expect(
      usingTheGridForm.getByRole("radio", { name: "Option 1" })
    ).toBeChecked();

    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy();
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy();
  });
});

test("checkbox", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();
  // check() method doesn't work when a checkbox is checked; click() doesn't check status
  // await page.getByRole('checkbox',{name:'Hide on click'}).click({force:true})
  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true });
  // await page.getByRole('checkbox',{name:'Show toast with icon'}).uncheck({force:true})

  // uncheck all checkboxes
  const allCheckboxes = page.getByRole("checkbox");
  for (const checkbox of await allCheckboxes.all()) {
    await checkbox.uncheck({ force: true });
    expect(await checkbox.isChecked()).toBeFalsy();
  }
});
test("lists and dropdowns", async ({ page }) => {
  const dropDownMenu = page.locator("ngx-header nb-select");
  await dropDownMenu.click();

  page.getByRole("list");
  page.getByRole("listitem");

  const optionList = page.locator("nb-option-list nb-option");
  await expect(optionList).toHaveText([
    " Light",
    " Dark",
    " Cosmic",
    " Corporate",
  ]);
  await optionList.filter({ hasText: "Dark" }).click();

  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(34, 43, 69)");
  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };
  await dropDownMenu.click();
  for (const color in colors) {
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
    if (color !== "Corporate") {
      await dropDownMenu.click();
    }
  }
});
test("tooltips", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipcard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await toolTipcard.getByRole("button", { name: "Top" }).hover();

  // page.getByRole('tooltip');
  const tooltip = await page.locator("nb-tooltip").textContent();
  // shortcut for inspect tooltip text in browser: source tab-> hover on the element and double click F8 key on windows to froze the browser to enable tooltip available in DOM
  expect(tooltip).toEqual("This is a tooltip");
});
test("window dialog box action confirm", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // listener for dialog box
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();
  await expect(page.locator("table tr").first()).not.toHaveText(
    "mdo@gmail.com"
  );
});
test("web tables data update", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1. get the row by any test in this row
  const targetRow = page.getByRole("row", {
    name: "twitter@outlook.com",
  });
  await targetRow.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("25");
  await page.locator(".nb-checkmark").click();

  // 2. get the row based on the value in the specific column while same values existing in different rows
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
  const targetRowById = page
    .getByRole("row", { name: "11" }) //2 rows have id 11 in the second column
    .filter({ has: page.locator("td").nth(1).getByText("11") }); //get id 11 in the second column
  await targetRowById.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").clear();
  await page
    .locator("input-editor")
    .getByPlaceholder("E-mail")
    .fill("test@gmail.com");
  await page.locator(".nb-checkmark").click();
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@gmail.com");

  // 3. test filter of the table
  const ages = ["20", "30", "40", "300"];
  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    await page.waitForTimeout(500);

    const ageRows = page.locator("tbody tr");
    for (let row of await ageRows.all()) {
      const cellVal = await row.locator("td").last().textContent();
      if (age == "300") {
        expect(await page.locator("tbody").textContent()).toContain(
          "No data found"
        );
      } else {
        expect(cellVal).toEqual(age);
      }
    }
  }
});
test("datepicker", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calendarInputField = page.getByPlaceholder("Form Picker");
  await calendarInputField.click();

  let date = new Date();
  date.setDate(date.getDate() + 200);
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
  const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  // update calendar month and year as expected date
  let calendarMonthAndYear = await page
    .locator("nb-calendar-view-mode")
    .textContent();
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;
  //loop until the calendar month and year matches with expected date
  while (calendarMonthAndYear !== expectedMonthAndYear) {
    await page.locator('[data-name="chevron-right"]').click();
    calendarMonthAndYear = await page
      .locator("nb-calendar-view-mode")
      .textContent();
  }

  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText(expectedDate, { exact: true })
    .click(); //1 is partial match so use exact:true to match exactly 1

  await expect(calendarInputField).toHaveValue(dateToAssert);
});
test("sliders", async ({ page }) => {
  // update attribute
  // const temGauge=page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
  // // Execute JavaScript code in the page, taking the matching element as an argument.
  // await temGauge.evaluate(el=>{
  //   el.setAttribute('cx','232.630');
  //   el.setAttribute('cy','232.630');
  // })
  // await temGauge.click();

  // mouse movement
  const tempBox = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger '
  );
  await tempBox.scrollIntoViewIfNeeded();
  const box = await tempBox.boundingBox();
  console.log(box.x, box.y);

  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  console.log(x, y, "x y");

  await page.mouse.down();

  await page.mouse.move(x + 100, y);
  await page.mouse.move(x + 100, y + 100);

  await page.mouse.up();
  await expect(tempBox).toContainText("30");
});
