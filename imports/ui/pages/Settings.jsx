import React from 'react'
import { Header, Image } from 'semantic-ui-react'
//Settings y NotFound son redundantes, se podría eliminar alguno de ellos.
const Settings = () => (
  <Header as="h2" textAlign="center">
    <Image src="/logo.png" alt="logo"/>
    <p>Settings</p>
  </Header>
)

export default Settings
