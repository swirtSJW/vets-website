const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const DisabilityHelpers = require('./claims-status-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  DisabilityHelpers.initClaimsListMock(token);

  // Claim is visible
  Auth.logIn(token, client, '/track-claims', 3)
    .waitForElementVisible('.claim-list-item-container', Timeouts.slow)
    .axeCheck('.main'); // TODO: Figure out why this is failing

  // Combined claim link
  client
    .click('button.claims-combined')
    .waitForElementVisible('.claims-status-upload-header', Timeouts.normal);
  client.expect
    .element('.claims-status-upload-header')
    .text.to.equal('A note about consolidated claims');
  client
    .click('.va-modal-close')
    .waitForElementNotPresent('.claims-status-upload-header', Timeouts.normal);

  // Verify text on page
  client.expect
    .element('.claims-container-title')
    .text.to.equal('Check your claim or appeal status');

  client.expect
    .element('.claim-list-item-header-v2')
    // .text.to.equal('Disability Compensation Claim – Received September 23, 2008');
    .text.to.equal(
      'Claim for disability compensation\nreceived September 23, 2008',
    );

  // Click to detail view
  client
    .click('.claim-list-item-container:first-child a.usa-button-primary')
    .assert.urlContains('/your-claims/11/status');

  client.end();
});
