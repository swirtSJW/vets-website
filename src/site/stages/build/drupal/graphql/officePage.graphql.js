/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
// Get current feature flags
const {
  featureFlags,
  enabledFeatureFlags,
} = require('./../../../../utilities/featureFlags');

module.exports = `
 fragment officePage on NodeOffice {
    ${entityElementsFromPages}
    changed
    title
    fieldDescription
    ${
      enabledFeatureFlags[featureFlags.FEATURE_FIELD_BODY]
        ? 'fieldBody { processed }'
        : ''
    }
    reverseFieldOfficeNode {
      entities {
    ... on NodeEvent {
        title
         entityUrl {
            path
        }
        fieldDate {
            startDate
            value
            endDate
            endValue
        }
        fieldDescription
        fieldLocationHumanreadable
        fieldFacilityLocation {
          entity {
            title
            entityUrl {
              path
            }
          }
        }
      }
    }
   }
 }
`;
