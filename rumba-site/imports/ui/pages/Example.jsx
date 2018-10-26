import React from 'react'
import { Header, Image } from 'semantic-ui-react'
import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

const role = Roles.userIsInRole(Meteor.user(), ['client'])


class Example extends React.Component {
  render(){
    console.log(this.props.currentUser)
    return(
      <Header as="h2" textAlign="center">
        <Image src="/logo.png" />
        <p>Example</p>
        <p>(Only visible when logged in.)</p>
        <p>--{Meteor.userId()}--</p>
      </Header>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(Example);