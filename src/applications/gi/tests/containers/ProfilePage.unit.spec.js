import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import createCommonStore from '../../../../platform/startup/store';
import { ProfilePage } from '../../containers/ProfilePage';
import reducer from '../../reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<ProfilePage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<ProfilePage {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should render VET TEC institution', () => {
    const vetTecProps = {
      ...defaultProps,
      showModal: () => {},
      profile: {
        ...defaultProps.profile,
        attributes: {
          vetTecProvider: true,
          type: 'FOR PROFIT',
        },
      },
    };
    const tree = SkinDeep.shallowRender(<ProfilePage {...vetTecProps} />);
    expect(tree.subTree('VetTecInstitutionProfile')).to.be.ok;
  });

  it('should show LoadingState when profile is fetching', () => {
    const inProgressProps = {
      ...defaultProps,
      profile: { inProgress: true },
    };
    const tree = SkinDeep.shallowRender(<ProfilePage {...inProgressProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });
});
