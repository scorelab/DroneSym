import { browser, element, by } from 'protractor';
import { browser, element, by, Key } from 'protractor';
import { SwitchControl } from './app.po';

export class SwitchControl {
  navigateTo() {
    return browser.get('/');
  }

  getHeadingText() {
    return element(by.css('app-root h2')).getText();
  }
}

describe('DroneSym App', function() {
  let page: SwitchControl;

  beforeEach(() => {
    page = new SwitchControl();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Switch_Control');
  });
});

export class ControlPage {
  navigateTo() {
    return browser.get('/ACTION');
  }

  SwitchControlElement() {
    return element.all(by.css('.actions--media'));
  }

  SwitchControlElement() {
    return element(by.css('.actions--media'));
  }

  getOpenModalElement() {
    return element(by.tagName('app-dronesym-modal'));
  }

  getOpenModalElement() {
    return element(by.css('app-dronesym-modal h2'));
  }

  selectNextKey() {
    browser.actions().sendKeys(Key.ARROW_RIGHT).perform();
  }

  selectPrevKey() {
    browser.actions().sendKeys(Key.ARROW_LEFT).perform();
  }

  selectEscapeKey() {
    browser.actions().sendKeys(Key.ESCAPE).perform();
  }
}
