import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import TabNav from '../components/TabNav';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import AskVAQuestions from '../components/AskVAQuestions';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AddingDetails from '../components/AddingDetails';
import Notification from '../components/Notification';
import ClaimsBreadcrumbs from './ClaimsBreadcrumbs';
import { isPopulatedClaim, getClaimType } from '../utils/helpers';

const MAX_CONTENTIONS = 3;

export default class ClaimDetailLayout extends React.Component {
  render() {
    const {
      claim,
      loading,
      message,
      clearNotification,
      currentTab,
      synced,
      id,
    } = this.props;
    const tabs = ['Status', 'Files', 'Details'];
    const claimsPath = `your-claims/${id}`;

    let bodyContent;
    let headingContent;
    if (!loading) {
      headingContent = (
        <>
          {message && (
            <Notification
              title={message.title}
              body={message.body}
              type={message.type}
              onClose={clearNotification}
            />
          )}
          <h1 className="claim-title">Your {getClaimType(claim)} claim</h1>
          {!synced && <ClaimSyncWarning olderVersion={!synced} />}
          <div className="claim-contentions">
            <h6 className="claim-contentions-header">What you’ve claimed:</h6>
            <span>
              {claim.attributes.contentionList &&
              claim.attributes.contentionList.length
                ? claim.attributes.contentionList
                    .slice(0, MAX_CONTENTIONS)
                    .map(cond => cond.trim())
                    .join(', ')
                : 'Not available'}
            </span>
            {claim.attributes.contentionList &&
            claim.attributes.contentionList.length > MAX_CONTENTIONS ? (
              <span>
                <br />
                <Link to={`your-claims/${claim.id}/details`}>
                  See all your claimed contentions
                </Link>
                .
              </span>
            ) : null}
          </div>
        </>
      );

      bodyContent = (
        <div className="claim-container">
          <TabNav id={this.props.claim.id} />
          {tabs.map(tab => (
            <div
              key={tab}
              role="tabpanel"
              id={`tabPanel${tab}`}
              aria-labelledby={`tab${tab}`}
            >
              {currentTab === tab && (
                <div className="va-tab-content claim-tab-content">
                  {isPopulatedClaim(claim) || !claim.attributes.open ? null : (
                    <AddingDetails />
                  )}
                  {this.props.children}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      bodyContent = (
        <LoadingIndicator
          setFocus
          message="Loading your claim information..."
        />
      );
    }

    return (
      <div>
        <div name="topScrollElement" />
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12">
              <ClaimsBreadcrumbs>
                <Link to={claimsPath}>Status details</Link>
              </ClaimsBreadcrumbs>
            </div>
          </div>
          {!!headingContent && (
            <div className="vads-l-row vads-u-margin-x--neg2p5">
              <div className="vads-l-col--12 vads-u-padding-x--2p5">
                {headingContent}
              </div>
            </div>
          )}
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              {bodyContent}
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
              <AskVAQuestions />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ClaimDetailLayout.propTypes = {
  claim: PropTypes.object,
  loading: PropTypes.bool,
  message: PropTypes.object,
  clearNotification: PropTypes.func,
  synced: PropTypes.bool,
};
