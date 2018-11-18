import { LoginPage } from './login.po';

describe('Dronesym Login Page', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('Should display Login Form With The title "Login"', () => {
    page.navigateTo();
    expect(page.getLoginFormTitle()).toEqual('Login');
  });

  it('Should Login User', async () => {
    await page.loginUser();
    const loggedUrl = await page.getUrl();
    expect(loggedUrl).toContain('/dashboard');
  });
});
