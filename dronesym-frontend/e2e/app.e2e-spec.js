describe('LOGIN CHECK', function() {
it('should display an error if the Login Credentials are incorrect', function() {

// Visit the login page
browser.get('http://localhost:4200/');
//incorrect username entry and password entry
element(by.id('username')).sendKeys('lollipop');
element(by.id('password')).sendKeys('lollipop');
 //Find the submit button and click it
element(by.css('[class="waves-effect waves-light btn blue darken-3 col s4 offset-s4"]')).click();
//Check whether it has the same url
expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/');
  });
});
describe('LOGIN CHECK', function() {
it('should check the rest of the user interface', function() {
browser.get('http://localhost:4200/');
element(by.css('form>div:nth-of-type(1)>input')).click();
element(by.css('form>div:nth-of-type(1)>input')).clear().sendKeys('admin'); //use correct login credentials
element(by.css('form>div:nth-of-type(2)>input')).clear().sendKeys('admin');
element(by.css('button')).click(); //login button
  });
});
describe('Nav Buttons Check', function() {
it('should check Navigation Buttons i.e Dashboard', function() {
element(by.css('nav>div>ul>li:nth-of-type(1)>a>i')).click();// Click the Dashboard button
});
it('Should Create Test Drone Group', function() {
element(by.css('div:nth-of-type(4)>a')).click();
element(by.css('confirm-dialog>div:nth-of-type(1)>form>div:nth-of-type(1)>div>label')).click(); 
element(by.css('confirm-dialog>div:nth-of-type(1)>form>div:nth-of-type(1)>div>input')).click();
element(by.css('confirm-dialog>div:nth-of-type(1)>form>div:nth-of-type(1)>div>input')).clear().sendKeys('Test'); //add drone test
element(by.css('div:nth-of-type(4)>a:nth-of-type(1)')).click();
});
it('should click on manage drones and next click on manage users and create a test user', function() {
element(by.css('app-user-dashboard>ul:nth-of-type(1)>div:nth-of-type(2)>a:nth-of-type(2)>div')).click();
element(by.css('a:nth-of-type(3)>div')).click();
element(by.css('div:nth-of-type(4)>a')).click();
element(by.css('user-signup>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>form>div:nth-of-type(1)>input')).click(); //add user test
element(by.css('user-signup>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>form>div:nth-of-type(1)>input')).clear().sendKeys('test');//add username test
element(by.css('div:nth-of-type(4)>input')).click();
element(by.css('div:nth-of-type(4)>input')).clear().sendKeys('test'); //add password test
element(by.css('div:nth-of-type(5)>label')).click();
element(by.css('div:nth-of-type(5)>input')).click();
element(by.css('div:nth-of-type(5)>input')).clear().sendKeys('test'); // add confirmation password test
element(by.css('button')).click();
});
it('should check Navigation Buttons i.e  Map and also check map functionality i.e zoom in, out and also drop a test drone', function() {
element(by.css('div:nth-of-type(36)>div')).click(); // click on map
element(by.css('app-user-view>nav:nth-of-type(1)>div>ul>li:nth-of-type(2)>a')).click();     //// Check all the map functionalities
element(by.css('div:nth-of-type(125)>div:nth-of-type(1)>a:nth-of-type(1)>i')).click();
element(by.css('button[aria-label="Zoom in"]>div>img')).click();
element(by.css('button[aria-label="Zoom out"]')).click();
element(by.css('div:nth-of-type(125)>div:nth-of-type(1)>a:nth-of-type(1)>i')).click();
element(by.css('div:nth-of-type(126)>div>ul>li:nth-of-type(1)>a>i')).click();
element(by.css('div:nth-of-type(73)>div')).click();
element(by.css('input')).click();// drop drone
element(by.css('input')).clear().sendKeys('test');  // dropping drone name test
element(by.css('confirm-dialog>div:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1)')).click();
});
});
