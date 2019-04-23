import React from 'react';
import MessageTemplate from './MessageTemplate';

const NeedaSSNResolution = () => {
  const content = {
    heading: 'We couldn’t match your information to our VA patient records',
    alertContent: (
      <p>
        We’re sorry. We couldn't find a match for you in our VA patient records.
      </p>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h3>What you can do:</h3>
        <div className="vads-u-padding-bottom--0p5">
          <p>
            <strong>
              If you’re currently registered as a patient at a VA health
              facility
            </strong>
          </p>
          <p>
            Call MyVA311 (<a href="tel:1-844-698-2311">844-698-2311</a>
            ), and select 3 to reach your nearest VA medical center. If you have
            hearing loss, call TTY: 711.
          </p>
          <p>
            Tell the representative that you tried to sign in to use health
            tools on VA.gov, but you received an error message telling you that
            the site couldn’t match your information to a VA patient record.
          </p>
        </div>

        <div className="vads-u-padding-bottom--0p5">
          <p>
            <strong>
              If you’re enrolled in VA health care, but not currently registered
              as a patient at a VA health facility
            </strong>
          </p>
          <p>
            Call <a href="tel:1-844-698-2311">844-698-2311</a>, and select 3 to
            reach your nearest VA medical center. If you have hearing loss, call
            TTY: 711.
          </p>
          <p>
            Tell the representative that you’re enrolled in VA health care and
            you’d like to register as a VA patient.
          </p>
        </div>

        <div className="vads-u-padding-bottom--0p5">
          <p>
            <strong>If you're not enrolled in VA health care</strong>
          </p>
          <p>
            You’ll need to apply for enrollment before you can register as a VA
            patient.
          </p>
          <a href="/health-care/how-to-apply/">
            Find out how to apply for VA health care
          </a>
        </div>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

export default NeedaSSNResolution;
