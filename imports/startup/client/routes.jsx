import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// This is the default semantic css but can be replaced by a customized version
import 'semantic-ui-css/semantic.css'

// Public components
import TopHeader from '../../ui/components/TopHeader.jsx';
import Home from '../../ui/pages/Home.jsx';
import AllSites from '../../ui/pages/AllSites.jsx';
import Settings from '../../ui/pages/Settings.jsx';
import Account from '../../ui/pages/Account.jsx';
import NotFound from '../../ui/pages/NotFound.jsx';
import Signin from '../../ui/pages/Signin.jsx';
import Signup from '../../ui/pages/Signup.jsx';
import Signout from '../../ui/pages/Signout.jsx';
import SitesAdmin from '../../ui/pages/SitesAdmin';

Meteor.startup(() => {
  render(
    <Router>
      <div>
        <TopHeader />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signin" component={Signin} />
          <Route path="/signup" component={Signup} />
          
          <ProtectedRoute path="/sites-admin" component={SitesAdmin} />
          <ProtectedRoute path="/sites" component={AllSites} />
          <ProtectedRoute path="/account" component={Account} />
          <ProtectedRoute path="/settings" component={Settings} />
          <ProtectedRoute path="/signout" component={Signout} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>,
    document.getElementById('app'),
  )
})

/**
 * ProtectedRoute (see React Router v4 sample)
 * will check the Meteor login before routing to the requested page
 * @param {any} { component: Component, ...rest }
 */


/**Usan este metodo para que evitar que gente que no este loggeada pueda acceder a las funcionalidades de la aplicacion, 
* sin embargo deberian implementar un metodo AdminProtectedRoute para que una persona loggeada no acceda a las funcionalidades 
* del admin , pude entrar a las funcionalidades de admin siendo usuario entrando desde un perfil usuario a este enlace
* https://rumbas.herokuapp.com/sites-admin
*/
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null
      return isLogged ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location },
          }}
        />
      )
    }}
  />
)

ProtectedRoute.propTypes = { component: PropTypes.func.isRequired }
