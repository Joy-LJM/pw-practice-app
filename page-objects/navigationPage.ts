import { Page } from "@playwright/test";

export class NavigationPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async formLayoutsPage() {
    // await this.page.getByText("Forms").click();
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
  }

  async datepickerPage() {
    // if called formLayoutsPage method consecutively, menu item is not expanded as it is closed after click
    // await this.page.getByText("Forms").click();
    // delay to avoid page unnatural transition
    // await this.page.waitForTimeout(1000);

    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }
  async smartTablePage() {
    // await this.page.getByText("Tables & Data").click();
    await this.selectGroupMenuItem("Tables & Data");
    await this.page.getByText("Smart Table").click();
  }
  async toastrPage() {
    // await this.page.getByText("Modal & Overlays").click();
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Toastr").click();
  }
  async tooltipPage() {
    // await this.page.getByText("Modal & Overlays").click();
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Tooltip").click();
  }

  // check menu item is expanded or not and click if it's collapsed
  private async selectGroupMenuItem(groupItemTitle:string){
    const menuItem=this.page.getByTitle(groupItemTitle);
    const expandedState=await menuItem.getAttribute('aria-expanded');
    if(expandedState==='false'){
      await menuItem.click();
    }
  }
}
