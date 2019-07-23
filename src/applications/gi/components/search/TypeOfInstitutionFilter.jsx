import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';
import { isVetTecSelected } from '../../utils/helpers';
import classNames from 'classnames';

class TypeOfInstitutionFilter extends React.Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    displayVetTecOption: false,
    displayAllOption: false,
  };

  options = () => {
    const options = [];
    const { displayAllOption, displayVetTecOption } = this.props;

    if (displayAllOption) {
      options.push({
        value: 'ALL',
        label: 'All',
      });
    }

    options.push({ value: 'school', label: 'Schools only' });
    options.push({ value: 'employer', label: 'Employers only' });

    if (displayVetTecOption) {
      const vetTecLabel = (
        <span>
          VET TEC training providers only &nbsp;(
          <a
            href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More)
            <br />
          </a>
        </span>
      );
      options.push({
        value: 'vettec',
        label: vetTecLabel,
      });
    }
    return options;
  };

  renderLogo = () => {
    const spanClasses = classNames(
      'vads-u-margin-bottom--1',
      'small-screen:vads-u-margin-x--neg1',
      'small-screen:vads-u-margin-bottom--neg1',
    );

    const imgClasses = classNames(
      'vettec-logo',
      'small-screen:vads-u-padding-top--0p5',
      'small-screen:vads-u-margin-bottom--neg1',
    );

    if (isVetTecSelected(this.props)) {
      return (
        <div>
          <span className={spanClasses}>
            <img
              className={imgClasses}
              src="/img/logo/vet-tec-logo.png"
              alt="Vet Tec Logo"
            />
          </span>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div>
        <RadioButtons
          label="Type of institution"
          name="category"
          options={this.options()}
          value={this.props.category}
          onChange={this.props.onChange}
        />
        {this.renderLogo()}
      </div>
    );
  }
}

export default TypeOfInstitutionFilter;
