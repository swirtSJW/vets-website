import { values, every, capitalize } from 'lodash';
import React, { Component } from 'react';
import Raven from 'raven-js';

/**
 * VA Facility Known Operational Hours
 */
export default class LocationHours extends Component {
  colonizeTime(time) {
    const found = time.match(/(\d?\d)(\d\d)(\w\w)/);

    if (!found) {
      return '0:00AM';
    }

    return `${found[1]}:${found[2]}${found[3]}`;
  }

  renderNotes(notes) {
    if (notes) {
      return (
        <div className="row">
          <div className="small-12 columns">
            <p>Notes: {notes}</p>
          </div>
        </div>
      );
    }

    return null;
  }

  renderVetCenterContent() {
    const { location } = this.props;
    if (location && location.attributes.facilityType === 'vet_center') {
      return (
        <p>
          In addition to the hours listed above, all Vet Centers maintain
          non-traditional hours that are specific to each site and can change
          periodically given local Veteran, Service member & Family needs.
          Please contact your Vet Center to obtain the current schedule.
        </p>
      );
    }
    return null;
  }

  render() {
    const { location } = this.props;

    if (!location) {
      return null;
    }

    const {
      attributes: { hours },
    } = location;

    const isVetCenter = location.attributes.facilityType === 'vet_center';

    if (every(values(hours), h => !h) && !isVetCenter) {
      return null;
    }

    const mappedHours = {};

    Object.keys(hours).forEach(k => {
      mappedHours[k] = hours[k];
      if (hours[k] === '-') {
        mappedHours[k] = 'Closed';
      } else if (hours[k]) {
        const regex = /(([1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[01][0-9]{2}|12[0-4][0-9]|125[0-9])+\w\w)-(([1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[01][0-9]{2}|12[0-4][0-9]|125[0-9])+\w\w)/;
        const found = hours[k].match(regex);

        if (found) {
          mappedHours[k] = `${this.colonizeTime(found[1])}-${this.colonizeTime(
            found[3],
          )}`;
        } else {
          Raven.captureException('API data malformed', {
            data: this.props.location,
            errorData: {
              hours: { [k]: hours[k] },
            },
          });

          mappedHours[k] = '';
        }
      }
    });

    const hourRows = Object.keys(mappedHours).map(h => {
      if (h !== 'notes' && mappedHours[h] && mappedHours[h] !== '') {
        return (
          <div className="row" key={h}>
            <div className="small-6 columns">{capitalize(h)}:</div>
            <div className="small-6 columns">{capitalize(mappedHours[h])}</div>
          </div>
        );
      }
      return null;
    });

    return (
      <div>
        <h4 className="highlight">Hours of Operation</h4>
        <div>{hourRows}</div>
        {this.renderVetCenterContent()}
      </div>
    );
  }
}
