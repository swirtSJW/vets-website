import React from 'react';

export default class FormFooter extends React.Component {
  render() {
    const { formConfig, currentLocation } = this.props;
    const GetFormHelp = formConfig.getHelp;

    if (
      currentLocation &&
      currentLocation.pathname.replace(/\/$/, '').endsWith('confirmation')
    ) {
      return null;
    }

    if (!GetFormHelp) {
      return null;
    }

    return (
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
          <div className="help-footer-box">
            <h2 className="help-heading">Need help?</h2>
            <div>
              <GetFormHelp />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
