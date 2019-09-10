import { AppPage } from './app.po';
import {browser, by, element, logging, protractor} from 'protractor';
import {error} from 'util';

const WAIT = 5000;
const WAIT_S = WAIT / 1000;

describe('workspace-project App', () => {
  let page: AppPage;
  let ec = protractor.ExpectedConditions;

  beforeEach(async () => {
    page = new AppPage();
    await page.navigateTo();
  });

  // it('should show loader first', async () => {
  //   await page.navigateTo();
  //   const isLoading = await page.isLoading();
  //   expect(isLoading).toBeTruthy();
  //   // expect(page.getTitleText()).toEqual('Frontend app is running!');
  // });

  it('should load vehicles list', async function() {
    browser.wait(ec.visibilityOf(page.getVehiclesListEl()), WAIT, `Vehicles list should be visible in ${WAIT_S} seconds`);
  });

  it('vehicles list should not be empty', async function() {
    browser.wait(ec.visibilityOf(page.getVehiclesListRowsEl().first()), WAIT, `Vehicles list rows should be visible in ${WAIT_S} seconds`);
  });

  it('should open new vehicle form', async function() {
    await page.openVehiclesForm(WAIT);
  });

  it('should add new vehicle', async function() {
    await page.fillValidNewVehicleForm(WAIT);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });


});
