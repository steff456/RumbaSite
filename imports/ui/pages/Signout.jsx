import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Header, Image } from 'semantic-ui-react'

const Signout = () => {
  Meteor.logout()
  return (
    <Header as="h2" textAlign="center">
      <Image src="/logo.png" size='massive' alt="logo"/>
      <p>Hope to see you soon!</p>
    </Header>
  )
}

export default Signout
