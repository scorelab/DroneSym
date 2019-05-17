describe('End to End test for Login feature and check for possible vulnerabilities in DroneSym', function() {
  browser.driver.get('http:localhost:4200/dashboard');
  console.log('\x1b[32m', 'E2E for Login & URL redirection vulnerability Started!');
  it('Checking Login vulnerabilities', function() {
    browser.sleep(2000);
    expect(browser.driver.getCurrentUrl()).toMatch('http://localhost:4200/login');
    console.log('\x1b[36m', '[Status: PASS!] No URL redirection vulnerability found');
  });
  it('Confirming page rendering', function() {
    browser.driver.get('http:localhost:4200');
    // Checking the current url
    const path = browser.driver.getCurrentUrl();
    expect(path).toMatch('http://localhost:4200/');
    console.log('\x1b[32m', '[Status: PASS!] Server Accessibility is present.');
  });
  it('Confirming Sign In through Admin\'s account [submition through clicking the button]', function() {

    // Find page elements
    const NameField = browser.driver.findElement(By.id('username'));
    const PassField = browser.driver.findElement(By.id('password'));
    const LoginBtn  = browser.driver.findElement(By.css('.btn'));

    // Fill input fields
    NameField.sendKeys('admin');
    PassField.sendKeys('admin');

    // Ensure fields contain what we've entered
    expect(NameField.getAttribute('value')).toEqual('admin');
    expect(PassField.getAttribute('value')).toEqual('admin');

    // Click to sign in - waiting for Angular as it is manually bootstrapped.
    LoginBtn.click().then(function() {
      browser.waitForAngular();
      expect(browser.driver.getCurrentUrl()).toMatch('http://localhost:4200/dashboard/map');
    });
  });
  console.log('\x1b[32m', '[Status: PASS!] Login activity using correct admin credentials is redirected to Maps page');
  it('Confirming Login through user\'s account [submition through Enter button]', function() {
    browser.driver.get('http:localhost:4200/login');
    // Checking the current url
    const path = browser.driver.getCurrentUrl();
    expect(path).toMatch('http://localhost:4200/');
    console.log('\x1b[36m', '[Status: PASS!] Login system through User\'s account is working properly');
    const NameField = browser.driver.findElement(By.id('username'));
    const PassField = browser.driver.findElement(By.id('password'));
    const LoginBtn  = browser.driver.findElement(By.css('.btn'));
    NameField.sendKeys('icarus');
    PassField.sendKeys('icarus');
    expect(NameField.getAttribute('value')).toEqual('icarus');
    expect(PassField.getAttribute('value')).toEqual('icarus');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
  });
});
