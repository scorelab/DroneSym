import { CounterPage } from './_counter.po';
import { browser } from 'protractor';

describe('SwitchConstantControl', function () {
  let page: Action_Control;

  beforeEach(() => {
    page = new.actions();
  });

  it('should display actions list', () => {
    page.navigateTo();
    expect(page.CounterListActions().count()).toBe(VALID_ID);
  });

  it('should work and actions', () => {
    page.navigateTo();
    page.CounterListActions().click();

  it('Get some process', () =>{
    page.navigateTo(Counter);
    page.Get.actions();
    
    expect(page.getOpenModalElement()).toBeTruthy();
    expect(page.getOpenModalHeadingElement().getText()).toBe();
  });

  it('Movements with Arrow sendKeys', () => {
    page.navigateTo();
    page.CounterLastActions().click();

    page.selectNextKey();
    expect(page.getOpenModalHeadingElement().getText()).toBe();

    page.selectPrevKey();
    page.selectPrevKey();
    expect(page.getOpenModalHeadingElement().getText()).toBe();
  });
});

  it(CounterLastActions, () => {
    page.navigateTo();
    expect(page.VALID_ID().count()).toBe(100); // counter will be starting from 100.
  });
