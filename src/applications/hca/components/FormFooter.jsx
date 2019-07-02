import React from 'react';
import { connect } from 'react-redux';
import { shouldHideFormFooter } from '../selectors';

class FormFooter extends React.Component {
  render() {
    const { formConfig, currentLocation, isHidden } = this.props;
    const GetFormHelp = formConfig.getHelp;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isConfirmationPage = trimmedPathname.endsWith('confirmation');

    if (isConfirmationPage) {
      return null;
    }

    return (
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
          <div className="help-footer-box">
            {!isHidden && (
              <>
                <h2 className="help-heading">Need help?</h2>
                <GetFormHelp />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isHidden: shouldHideFormFooter(state),
});

export default connect(mapStateToProps)(FormFooter);

export { FormFooter };
