import { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/homePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NoFound from '../../features/errors/NoFound';
import ServerError from '../../features/errors/ServerError';

function App() {

  const location = useLocation();
  return (
    <Fragment>
      <ToastContainer position="bottom-right" hideProgressBar />
      <Route exact path="/" component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route key={location.key} path={["/createActivity", '/manage/:id']} component={ActivityForm} />
                <Route path={'/errors'} component={TestErrors} />
                <Route path={'/server-error'} component={ServerError} />
                <Route component={NoFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment >
  );
}

export default observer(App);
