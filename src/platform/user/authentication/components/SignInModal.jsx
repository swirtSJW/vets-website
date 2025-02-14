import PropTypes from 'prop-types';
import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import ExternalServicesError from 'platform/monitoring/external-services/ExternalServicesError';
import { EXTERNAL_SERVICES } from 'platform/monitoring/external-services/config';
import recordEvent from 'platform/monitoring/record-event';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import { login, signup } from 'platform/user/authentication/utilities';
import environment from 'platform/utilities/environment';

const loginHandler = loginType => () => {
  recordEvent({ event: `login-attempted-${loginType}` });
  login(loginType);
};

const handleDsLogon = loginHandler('dslogon');
const handleMhv = loginHandler('mhv');
const handleIdMe = loginHandler('idme');

const vaGovFullDomain = environment.BASE_URL;
const logoSrc = `${vaGovFullDomain}/img/design/logo/va-logo.png`;

class SignInModal extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      recordEvent({ event: 'login-modal-opened' });
    } else if (prevProps.visible && !this.props.visible) {
      recordEvent({ event: 'login-modal-closed' });
    }
  }

  downtimeBanner = (dependencies, headline, status, message) => (
    <ExternalServicesError dependencies={dependencies}>
      <div className="downtime-notification row">
        <div className="columns small-12">
          <div className="form-warning-banner">
            <AlertBox headline={headline} isVisible status={status}>
              {message}
            </AlertBox>
            <br />
          </div>
        </div>
      </div>
    </ExternalServicesError>
  );

  renderModalContent = () => (
    <main className="login">
      <div className="row">
        <div className="columns">
          <div className="logo">
            <a href="/">
              <img alt="VA.gov" className="va-header-logo" src={logoSrc} />
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="columns small-12">
            <h1>Sign in to VA.gov</h1>
          </div>
        </div>
        <div className="row medium-screen:vads-u-display--none mobile-explanation">
          <div className="columns small-12">
            <h2>
              One site. A lifetime of benefits and services at your fingertips.
            </h2>
          </div>
        </div>
        {this.downtimeBanner(
          [EXTERNAL_SERVICES.idme],
          'Our sign in process isn’t working right now',
          'error',
          'We’re sorry. We’re working to fix some problems with our sign in process. If you’d like to sign in to VA.gov, please check back later.',
        )}
        {this.downtimeBanner(
          [EXTERNAL_SERVICES.dslogon],
          'You may have trouble signing in with DS Logon',
          'warning',
          'We’re sorry. We’re working to fix some problems with our DS Logon sign in process. If you’d like to sign in to VA.gov with your DS Logon account, please check back later.',
        )}
        {this.downtimeBanner(
          [EXTERNAL_SERVICES.mhv],
          'You may have trouble signing in with My HealtheVet',
          'warning',
          'We’re sorry. We’re making some scheduled updates to our My HealtheVet sign-in process. If you’d like to sign in to VA.gov with your My HealtheVet username and password, please check back later.',
        )}
        {this.downtimeBanner(
          [EXTERNAL_SERVICES.mvi],
          'You may have trouble signing in or using some tools or services',
          'warning',
          'We’re sorry. We’re working to fix a problem that affects some parts of our site. If you have trouble signing in or using any tools or services, please check back soon.',
        )}
        <div>
          <div className="usa-width-one-half">
            <div className="signin-actions-container">
              <div className="top-banner">
                <div>
                  <img
                    alt="ID.me"
                    src={`${vaGovFullDomain}/img/signin/lock-icon.svg`}
                  />{' '}
                  Secured & powered by{' '}
                  <img
                    alt="ID.me"
                    src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
                  />
                </div>
              </div>
              <div className="signin-actions">
                <h5>Sign in with an existing account</h5>
                <div>
                  <button className="dslogon" onClick={handleDsLogon}>
                    <img
                      alt="DS Logon"
                      src={`${vaGovFullDomain}/img/signin/dslogon-icon.svg`}
                    />
                    <strong> Sign in with DS Logon</strong>
                  </button>
                  <button className="mhv" onClick={handleMhv}>
                    <img
                      alt="My HealtheVet"
                      src={`${vaGovFullDomain}/img/signin/mhv-icon.svg`}
                    />
                    <strong> Sign in with My HealtheVet</strong>
                  </button>
                  <button
                    className="usa-button-primary va-button-primary"
                    onClick={handleIdMe}
                  >
                    <img
                      alt="ID.me"
                      src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
                    />
                    <strong> Sign in with ID.me</strong>
                  </button>
                  <span className="sidelines">OR</span>
                  <div className="alternate-signin">
                    <h5>Don't have those accounts?</h5>
                    <button
                      className="idme-create usa-button usa-button-secondary"
                      onClick={signup}
                    >
                      <img
                        alt="ID.me"
                        src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
                      />
                      <strong> Create an ID.me account</strong>
                    </button>
                    <p>Use your email, Google, or Facebook</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="usa-width-one-half">
            <div className="explanation-content">
              <div className="vads-u-display--none medium-screen:vads-u-display--block usa-font-lead">
                One site. A lifetime of benefits and services at your
                fingertips.
              </div>
              <p>
                You spoke. We listened. VA.gov is the direct result of what you
                said you wanted most—one easy-to-use place to:
              </p>
              <ul>
                <li>Check your disability claim and appeal status</li>
                <li>
                  Find out how much money you have left to pay for school or
                  training
                </li>
                <li>
                  Refill your prescriptions and communicate with your health
                  care team
                </li>
                <li>...and more</li>
              </ul>
              <p>
                <strong>A secure account powered by ID.me</strong>
                <br />
                ID.me is our trusted technology partner in helping to keep your
                personal information safe. They specialize in digital identity
                protection and help us make sure you're you—and not someone
                pretending to be you—before we give you access to your
                information.
              </p>
              <p>
                <a href="/sign-in-faq/#what-is-idme" target="_blank">
                  Learn more about ID.me
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="columns small-12">
            <div className="help-info">
              <h4>Having trouble signing in?</h4>
              <p>
                <a href="/sign-in-faq/" target="_blank">
                  Get answers to Frequently Asked Questions
                </a>
              </p>
              <p>
                <SubmitSignInForm startSentence />
              </p>
            </div>
            <hr />
            <div className="fed-warning">
              <p>
                When you sign in to VA.gov, you’re using a United States federal
                government information system.
              </p>
              <p>
                By signing in, you agree to only use information you have legal
                authority to view and use. You also agree to let us monitor and
                record your activity on the system and share this information
                with auditors or law enforcement officials.
              </p>
              <p>
                By signing in, you confirm that you understand the following:
              </p>
              <p>
                Unauthorized use of this system is prohibited and may result in
                criminal, civil, or administrative penalties. Unauthorized use
                includes gaining unauthorized data access, changing data,
                harming the system or its data, or misusing the system. We can
                suspend or block your access to this system if we suspect any
                unauthorized use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  render() {
    return (
      <Modal
        cssClass="va-modal-large"
        visible={this.props.visible}
        focusSelector="button"
        onClose={this.props.onClose}
        id="signin-signup-modal"
      >
        {this.renderModalContent()}
      </Modal>
    );
  }
}

SignInModal.propTypes = {
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};

export default SignInModal;
