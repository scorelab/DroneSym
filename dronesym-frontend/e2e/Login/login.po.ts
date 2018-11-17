import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login');
  }

  getLoginFormTitle() {
    return element(by.className('card-title')).getText();
  }

  async loginUser() {
    const usernameInput = element(by.id('username'));
    const passwordInput = element(by.id('password'));
    const submitButton = element(by.css('button.btn'));

    await usernameInput.sendKeys('admin');
    await passwordInput.sendKeys('admin');
    return submitButton.click();
  }

  async getUrl() {
    return await browser.getCurrentUrl();
  }
}
