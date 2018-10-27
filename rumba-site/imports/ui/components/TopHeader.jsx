import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { withRouter, NavLink } from 'react-router-dom'
import { Menu, Dropdown, Image } from 'semantic-ui-react'

const TopHeader = ({ currentUser }) => (
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
    {currentUser !== '' && (
    <Menu.Item as={NavLink} activeClassName="active" exact to="/example">
    Example
    </Menu.Item>    
    )}
    {currentUser !== '' && (
    <Menu.Item as={NavLink} activeClassName="active" exact to="/sites">
    Sites
    </Menu.Item>    
    )}
    <Menu.Item position="right">
      {currentUser !== '' && (
        <Dropdown text={currentUser} pointing="top right" icon="user">
          <Dropdown.Menu>
            <Dropdown.Item icon="user" text="Account" as={NavLink} exact to="/account" />
            <Dropdown.Item icon="settings" text="Settings" as={NavLink} exact to="/settings" />
            <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Menu.Item>
  </Menu>
)

TopHeader.propTypes = { currentUser: PropTypes.string }
TopHeader.defaultProps = { currentUser: '' }

// withRouter HOC.
// see explanation: https://reacttraining.com/react-router/web/api/withRouter

const TopHeaderContainer = withTracker(() => ({ currentUser: Meteor.user() ? Meteor.user().username : '' }))(TopHeader)

export default withRouter(TopHeaderContainer)
