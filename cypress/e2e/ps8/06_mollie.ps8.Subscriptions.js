/// <reference types="Cypress" />
//Caching the BO and FO session
const login = (MollieBOFOLoggingIn) => {
  cy.session(MollieBOFOLoggingIn,() => {
  cy.visit('/admin1/')
  cy.url().should('contain', 'https').as('Check if HTTPS exists')
  cy.get('#email').type('demo@prestashop.com',{delay: 0, log: false})
  cy.get('#passwd').type('prestashop_demo',{delay: 0, log: false})
  cy.get('#submit_login').click().wait(1000).as('Connection successsful')
  cy.visit('/en/my-account')
  cy.get('#login-form [name="email"]').eq(0).type('demo@prestashop.com')
  cy.get('#login-form [name="password"]').eq(0).type('prestashop_demo')
  cy.get('#login-form [type="submit"]').eq(0).click({force:true})
  cy.get('#history-link > .link-item').click()
  })
  }
//Checking the console for errors
let windowConsoleError;
Cypress.on('window:before:load', (win) => {
windowConsoleError = cy.spy(win.console, 'error');
})
afterEach(() => {
expect(windowConsoleError).to.not.be.called;
})
describe('PS8 Subscriptions Test Suite', () => {
  beforeEach(() => {
      cy.viewport(1920,1080)
      login('MollieBOFOLoggingIn')
  })
it('C176305: Check if Subscription options added in Product BO', () => {
  cy.visit('/admin1/')
  cy.get('#subtab-AdminCatalog > :nth-child(1)').click()
  cy.get('#subtab-AdminProducts > .link').click()
  cy.get('[data-product-id="8"]').find('[class="btn tooltip-link product-edit"]').click()
  cy.contains('Product with combinations').click()
  cy.get('[id="tab_step3"]').click()
  cy.contains('Daily').click({force:true})
  cy.get('[class="token"]').should('be.visible')
  cy.get('#create-combinations').click()
  cy.wait(5000)
  cy.reload()
  cy.wait(5000)
  cy.contains('Mollie Subscription - Daily').should('be.visible')
  cy.get('[class="attribute-quantity"]').last().find('[type="text"]').clear().type('999')
  cy.get('#submit').click()
  cy.get('.growl-message').contains('Settings updated.')
})
it.skip('C1672516: Check if Subscription options are in Product Page FO and then register the Subscription product by purchasing it', () => { //PS805 test is not working on Cypress, deleting the Cart session somehow, checking for alternative test
  cy.visit('/en/')
  cy.get('[data-id-product="8"]').click()
  cy.get('[aria-label="Subscription"]').should('be.visible') //asserting if there is a Subscription dropdown in product page
  cy.contains('Add to cart').click()
  cy.contains('Proceed to checkout').click()
  cy.visit('/en/cart?action=show') //strangely, session is deleted somehow, but after the visit to the Cart page again, the Cart is with an item again
  cy.contains('Proceed to checkout').click()
  cy.contains('DE').click()
  cy.get('.clearfix > .btn').click()
  cy.get('#js-delivery > .continue').click()
  //Payment method choosing
  cy.contains('Card').click({force:true})
  //Credit card inputing
  cy.CreditCardFillingIframe()
  cy.get('.condition-label > .js-terms').click({force:true})
  cy.get('.ps-shown-by-js > .btn').click()
  cy.get('[value="paid"]').click()
  cy.get('[class="button form__button"]').click()
});
it('C1672517: Check if Subscription options are implemented in My Account FO', () => {
  cy.visit('/en/')
  cy.get('[class="account"]').click()
  cy.contains('Subscriptions').click()
  cy.get('[class="page-content"]').should('be.visible')
});
})
