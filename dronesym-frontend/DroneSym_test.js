
describe('Check The Login Button and try loggin in with incorrect credentials', function () {
it('Should check that the login button works', function () {
    cy.visit('http://localhost:4200/') 
      cy.get('input:first').should('have.attr', 'id', 'username').clear().type('test@m.com').should('have.value', 'test@m.com')
	cy.get('input:last').should('have.attr', 'id', 'password').clear().type('test')
	 cy.get('button').click().wait(1000)
	  cy.url().should('eq', 'http://localhost:4200/')//this means that incorrect login attempt does not work
 }) 
})
describe('Check The Login Button and Try Loggin In with correct credentials and check if the buttons on the webpage work',function(){
 it('Should check that the login button works and check that all the buttons on the website work', function () {
    cy.visit('http://localhost:4200/')
      cy.get('input:first').should('have.attr', 'id', 'username').clear().type('admin').should('have.value', 'admin')
  	cy.get('input:last').should('have.attr', 'id', 'password').clear().type('admin')
	 cy.get('button').click().wait(1000)
	 cy.url().should('eq', 'http://localhost:4200/dashboard/map')// this means that the correct credentials have successfully logged in
	cy.get('#nav-mobile').within(function(){
  cy.get('a:first').should('have.attr', 'routerlink', '/dashboard/user/groups').click()//this will check the dashboard button
})
cy.get('#slide-out').within(function(){
cy.get('.dash-green').click()  //click the manage drones button
cy.get('.dash-blue').click()   //click the manage users button
cy.get('.dash-yellow').click() //click the manage groups button
})
cy.get('#nav-mobile > :nth-child(2) > .nav-button').click()//this will check the map button
cy.get('.btn-large > .material-icons').click()//this will select the map menu option
cy.get(':nth-child(3) > .nav-button').click()//finally click the logout button
})
})

