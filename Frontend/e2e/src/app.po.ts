import {browser, by, element, ElementFinder, protractor} from 'protractor';

const clickWhenVisible = async (el: ElementFinder, time: number, name?: string) => {
  const s = time / 1000;
  const msg = `${!!name ? name : 'Element'} should be visible in ${s} seconds`;
  await browser.wait(browser.ExpectedConditions.visibilityOf(el), time, msg);
  await el.click();
};

const ec = protractor.ExpectedConditions;

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  isLoading() {
    return element(by.tagName('loader')).isPresent();
  }

  getVehiclesListEl()
  {
    return browser.element(by.tagName('vehicles-list'));
  }

  getVehiclesListRowsEl()
  {
    return browser.element.all(by.tagName('datatable-body-row'));
  }

  async clickNewVehicleButton(time: number)
  {
    await clickWhenVisible(browser.element(by.className('add-new')), time, "'Add new vehicle' button");
  }

  getVehicleFormEl()
  {
    return browser.element(by.tagName('add-vehicle'));
  }

  async waitForVehicleFormToBeVisible(time: number, error: string)
  {
    const formEl = this.getVehicleFormEl();
    const s = time / 1000;
    await browser.wait(ec.visibilityOf(formEl), time, error ? error : `Vehicles form should be visible in ${s} seconds`);
    return formEl;
  }

  async openVehiclesForm(time: number)
  {
    await this.clickNewVehicleButton(time);
    return await this.waitForVehicleFormToBeVisible(time, 'Vehicles form should be visible after clicking button to add new vehicle');
  }

  async fillValidNewVehicleForm(time: number)
  {
    // browser.ignoreSynchronization = false;
    const formEl: ElementFinder = await this.openVehiclesForm(time);
    browser.pause(2000);
    const numberInputEl = formEl.element(by.css('input[formControlName=number]'));
    numberInputEl.sendKeys('QQQ777');
    const ownerInputEl = formEl.element(by.css('input[formControlName=owner]'));
    ownerInputEl.sendKeys('Test owner');
    formEl.element(by.css('mat-select[formControlName=model] .mat-select-trigger')).click();
    // mat-select-panel-wrap ng-tns-c5-7 ng-trigger ng-trigger-transformPanelWrap ng-star-inserted
    const firstOptionSelector = by.xpath('//div[contains(@class, "mat-select-panel-wrap")]//mat-option[2]/span[contains(@class, "mat-option-text")]');
    const modelOptionsEl = browser.element(firstOptionSelector);
    await browser.wait(ec.visibilityOf(modelOptionsEl), time);
    modelOptionsEl.click();
    await browser.wait(ec.invisibilityOf(modelOptionsEl), time);
    formEl.element(by.css('mat-select[formControlName=make] .mat-select-trigger')).click();
    // await browser.waitForAngular();
    // browser.sleep(2000);
    const makeOptionsEl = browser.element(firstOptionSelector);
    await browser.wait(ec.elementToBeClickable(makeOptionsEl), time);
    // await browser.actions().mouseMove(makeOptionsEl, await makeOptionsEl.getLocation()).click().perform();
    makeOptionsEl.click();
    formEl.element(by.tagName('button')).click();

    // browser.element(firstOptionSelector).click();
    // formEl.element(by.css('mat-select[formControlName=model] .mat-select-trigger')).click();
    browser.sleep(10000);
  }
}
