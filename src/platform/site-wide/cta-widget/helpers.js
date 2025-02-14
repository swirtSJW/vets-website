import backendServices from 'platform/user/profile/constants/backendServices';
import environment from 'platform/utilities/environment';

export const frontendApps = {
  HEALTH_RECORDS: 'health-records',
  RX: 'rx',
  MESSAGING: 'messaging',
  LAB_AND_TEST_RESULTS: 'lab-and-test-results',
  APPOINTMENTS: 'appointments',
  GI_BILL_BENEFITS: 'gi-bill-benefits',
  DISABILITY_BENEFITS: 'disability-benefits',
  CLAIMS_AND_APPEALS: 'claims-and-appeals',
  LETTERS: 'letters',
  VETERAN_ID_CARD: 'vic',
  VET_TEC: 'vet-tec',
  DIRECT_DEPOSIT: 'direct-deposit',
};

const HEALTH_TOOLS = [
  frontendApps.HEALTH_RECORDS,
  frontendApps.RX,
  frontendApps.MESSAGING,
  frontendApps.LAB_AND_TEST_RESULTS,
  frontendApps.APPOINTMENTS,
  frontendApps.DIRECT_DEPOSIT,
];

const MHV_ACCOUNT_TYPES = ['Premium', 'Advanced', 'Basic'];

export const hasRequiredMhvAccount = (appId, accountLevel) => {
  switch (appId) {
    case frontendApps.HEALTH_RECORDS:
    case frontendApps.LAB_AND_TEST_RESULTS:
      return MHV_ACCOUNT_TYPES.includes(accountLevel);
    case frontendApps.RX:
      return MHV_ACCOUNT_TYPES.slice(0, 2).includes(accountLevel);
    case frontendApps.MESSAGING:
    case frontendApps.APPOINTMENTS:
      return accountLevel === 'Premium';
    default:
      // Not a recognized health tool.
      return false;
  }
};

export const isHealthTool = appId => HEALTH_TOOLS.includes(appId);

export const mhvBaseUrl = () => {
  const mhvSubdomain = !environment.isProduction() ? 'mhv-syst' : 'www';

  return `https://${mhvSubdomain}.myhealth.va.gov`;
};

export const mhvToolName = appId => {
  switch (appId) {
    case frontendApps.HEALTH_RECORDS:
      return 'VA Blue Button';

    case frontendApps.RX:
      return 'Prescription Refill and Tracking';

    case frontendApps.MESSAGING:
      return 'Secure Messaging';

    case frontendApps.LAB_AND_TEST_RESULTS:
      return 'Lab and Test Results';

    case frontendApps.APPOINTMENTS:
      return 'VA Appointments';

    case frontendApps.DIRECT_DEPOSIT:
      return 'Direct Deposit';

    default: // Not a recognized health tool.
  }

  return null;
};

export const toolUrl = (appId, index) => {
  switch (appId) {
    case frontendApps.HEALTH_RECORDS:
      return {
        url: `${mhvBaseUrl()}/mhv-portal-web/download-my-data`,
        redirect: false,
      };

    case frontendApps.RX:
      return {
        url: `${mhvBaseUrl()}/mhv-portal-web/web/myhealthevet/refill-prescriptions`,
        redirect: true,
      };

    case frontendApps.MESSAGING:
      return {
        url: `${mhvBaseUrl()}/mhv-portal-web/secure-messaging`,
        redirect: true,
      };

    case frontendApps.APPOINTMENTS:
      return {
        url: [
          `${mhvBaseUrl()}/mhv-portal-web/appointments`,
          `${mhvBaseUrl()}/mhv-portal-web/web/myhealthevet/scheduling-a-va-appointment`,
        ][index],
        redirect: false,
      };

    case frontendApps.LAB_AND_TEST_RESULTS:
      return {
        url: `${mhvBaseUrl()}/mhv-portal-web/labs-tests`,
        redirect: true,
      };

    case frontendApps.CLAIMS_AND_APPEALS:
      return {
        url: '/track-claims/',
        redirect: true,
      };

    case frontendApps.GI_BILL_BENEFITS:
      return {
        url: '/education/gi-bill/post-9-11/ch-33-benefit/status',
        redirect: false,
      };

    case frontendApps.DISABILITY_BENEFITS:
      return {
        url: '/disability/how-to-file-claim',
        redirect: false,
      };

    case frontendApps.LETTERS:
      return {
        url: '/records/download-va-letters/letters',
        redirect: false,
      };

    case frontendApps.VETERAN_ID_CARD:
      return {
        url: '/records/get-veteran-id-cards/apply',
        redirect: false,
      };

    case frontendApps.VET_TEC:
      return {
        url:
          '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994',
        redirect: false,
      };

    case frontendApps.DIRECT_DEPOSIT:
      return {
        url: '/profile',
        redirect: false,
      };

    default:
      return {};
  }
};

// Map frontend apps to their required services.
// Note: frontend apps and backend services don't necessarily map one-to-one.
// For example, some apps might require the same backend services.
// Some apps might also require access to multiple backend services.

export const requiredServices = appId => {
  switch (appId) {
    case frontendApps.HEALTH_RECORDS:
      return backendServices.HEALTH_RECORDS;

    case frontendApps.RX:
      return backendServices.RX;

    case frontendApps.MESSAGING:
      return backendServices.MESSAGING;

    case frontendApps.LAB_AND_TEST_RESULTS:
    case frontendApps.APPOINTMENTS:
      return null;

    case frontendApps.GI_BILL_BENEFITS:
    case frontendApps.DISABILITY_BENEFITS:
    case frontendApps.LETTERS:
      return backendServices.EVSS_CLAIMS;

    case frontendApps.CLAIMS_AND_APPEALS:
      return [backendServices.EVSS_CLAIMS, backendServices.APPEALS_STATUS];

    case frontendApps.VETERAN_ID_CARD:
      return backendServices.ID_CARD;

    case frontendApps.VET_TEC:
      return backendServices.EDUCATION_BENEFITS;

    default:
      return null;
  }
};

export const serviceDescription = (appId, index) => {
  switch (appId) {
    case frontendApps.HEALTH_RECORDS:
      return 'view your VA medical records';

    case frontendApps.RX:
      return 'refill prescriptions';

    case frontendApps.MESSAGING:
      return 'send secure messages';

    case frontendApps.LAB_AND_TEST_RESULTS:
      return 'view your lab and test results';

    case frontendApps.APPOINTMENTS:
      return [
        'view your appointments',
        'schedule, reschedule, or cancel a VA appointment online',
      ][index];

    case frontendApps.GI_BILL_BENEFITS:
      return 'check your GI Bill Benefits';

    case frontendApps.DISABILITY_BENEFITS:
      return 'apply for disability benefits';

    case frontendApps.CLAIMS_AND_APPEALS:
      return 'see your claim or appeal status';

    case frontendApps.LETTERS:
      return 'get your VA Benefit Letters';

    case frontendApps.VETERAN_ID_CARD:
      return 'apply for a Veteran ID Card';

    case frontendApps.VET_TEC:
      return 'apply for VET TEC';

    case frontendApps.DIRECT_DEPOSIT:
      return 'change your direct deposit information online';

    default:
      return 'use this service';
  }
};
