import GiBillApp from './containers/GiBillApp';
import LandingPage from './containers/LandingPage';
import SearchPage from './containers/SearchPage';
import ProfilePage from './containers/ProfilePage';
import { withToggleProvider } from 'platform/utilities/toggles';

const legacyRoutes = {
  path: 'institutions',
  childRoutes: [
    { path: 'search', component: SearchPage },
    { path: 'profile', component: ProfilePage },
  ],
};

const routes = {
  path: '/',
  component: GiBillApp,
  indexRoute: { component: withToggleProvider(LandingPage) },
  childRoutes: [
    { path: 'search', component: SearchPage },
    { path: 'profile/:facilityCode', component: ProfilePage },
    { ...legacyRoutes },
  ],
};

export default routes;
