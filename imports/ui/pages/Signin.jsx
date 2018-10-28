// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { Container, Form, Grid, Header, Image, Message, Segment, Button } from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data';
class Signin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToReferer: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  // Using a ref is accessing the DOM directly and not preferred
  // The React way to get the value from an input is using onChange
  handleChange(e, { name, value }) {
    this.setState({ [name]: value })
  }

  handleSubmit() {
    const { email, password } = this.state

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({ error: err.reason })
      } else {
        this.setState({
          error: '',
          redirectToReferer: true,
        })
      }
    })
    const { redirectToReferer } = this.state
    if (redirectToReferer) {
      return <Redirect to={from} />
    }
  }

  render() {
    // const error = this.state.error;
    const { location } = this.props
    const { redirectToReferer, error } = this.state
    const { from } = location.state || { from: { pathname: '/' } }
    // if correct authentication, redirect to page instead of login screen
    if (redirectToReferer) {
      return <Redirect to={from} />
    }

    return (
      <Container>
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">
              <Image src="/logo.png" /> Log-in to your account
            </Header>
            <Segment stacked padded='very'>
              <Form onSubmit={this.handleSubmit}>
                <Form.Input
                  label="Email"
                  icon="user"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="E-mail address"
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Password"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleChange}
                />
                <Button content="Submit" />
              </Form>
            </Segment>
            <Message>
              <Link to="/signup">Click here to Register</Link>
            </Message>
            {error === '' ? '' : <Message error header="Login was not successful" content={error} />}
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

Signin.propTypes = { location: PropTypes.object.isRequired }

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(Signin);