import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export const VetTecAdditionalResourcesLinks = () => (
  <div>
    <p>
      <a
        href="https://va.careerscope.net/gibill"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Get started with CareerScope
      </a>
    </p>
    <p>
      <a
        href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Learn more about VET TEC
      </a>
    </p>
    <p>
      <a
        href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/introduction"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Apply for VET TEC
      </a>
    </p>
    <p>
      <a
        href="/education/submit-school-feedback"
        target="/education/submit-school-feedback/introduction"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Submit a complaint through our Feedback System
      </a>
    </p>
  </div>
);

const VetTecAdditionalResources = () => (
  <div className="additional-resources usa-width-one-third medium-4 small-12 column">
    <h4 className="highlight">Additional Resources</h4>
    <VetTecAdditionalResourcesLinks />
  </div>
);

export default VetTecAdditionalResources;
