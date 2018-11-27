import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { withRouter, NavLink } from 'react-router-dom'
import { Menu, Dropdown, Image } from 'semantic-ui-react'

const TopHeader = ({ currentUser, currentRole }) => (
  <Menu secondary pointing>
    <Menu.Item as={NavLink} activeClassName="active" exact to="/">
      <Image src="/icon.png" size="tiny" />
    </Menu.Item>
    {currentUser === '' && (
    <Menu.Item as={NavLink} activeClassName="active" exact to="/signin">
    Sign In
    </Menu.Item>
    )}
    {currentUser === '' && (
    <Menu.Item as={NavLink} activeClassName="active" exact to="/signup">
    Sign Up
    </Menu.Item>
    )}
    {currentUser !== '' && currentRole === 'owner' && (
    <Menu.Item as={NavLink} activeClassName="active" exact to="/sites-admin">
    Your sites
    </Menu.Item>    
    )}
    {currentUser !== '' && currentRole === 'client' && (
    <Menu.Item as={NavLink} activeClassName="active" exact to="/sites">
    Sites
    </Menu.Item>    
    )}
    <Menu.Item position="right">
      {currentUser !== '' && (
        <Dropdown text={currentUser} pointing="top right" icon="user">
          <Dropdown.Menu>
            <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Menu.Item>
  </Menu>
)

TopHeader.propTypes = { currentUser: PropTypes.string, currentRole: PropTypes.string }
TopHeader.defaultProps = { currentUser: '', currentRole: ''}

// withRouter HOC.
// see explanation: https://reacttraining.com/react-router/web/api/withRouter

const TopHeaderContainer = withTracker(() => (
  { 
    currentUser: Meteor.user() ? Meteor.user().username : '',
    currentRole: (Meteor.user() && Meteor.user().roles) ? Meteor.user().roles[0] : ''
  }
))(TopHeader)

export default withRouter(TopHeaderContainer)
