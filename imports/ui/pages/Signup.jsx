// signup component similar to login page (except loginWithPassword)
// instead createUser to insert a new user account document

// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import styled from 'styled-components';
// 1
//import { withRouter } from 'react-router';

const ErrorMessage = styled(Message)`
  width: 100% !important;
`;

const options=[
  { key: 'c', text: 'Client', value: 'client' },
  { key: 'o', text: 'Owner', value: 'owner' }
]
class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: '', password: '', error: '' }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  // Using a ref is accessing the DOM directly and not preferred
  // The React way to get the value from an input is using onChange
    
  handleChange(e, { name, value }) {
    this.setState({ [name]: value })
  }

  handleSubmit() {
    const { email, password, role } = this.state;

    Accounts.createUser({ email, username: email, password, roles: [role] }, (err) => {
      if (err) {
        this.setState({ error: err.reason })
      } else {
        // When the user is created. Redirect the user using withRouter() and the code that I added commented:
        
        // 2
        // this.props.history.push('/login');
        
        // browserHistory.push('/login');
      }
    });
  }

  render() {
    const { error } = this.state
    return (
      <Container>
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">
              <Image src="/logo.png" /> Register your account
            </Header>
            <Form onSubmit={this.handleSubmit}>
              <Segment stacked padded='very'>
                <Form.Input
                  label="Email"
                  icon="user"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="E-mail address"
                  onChange={this.handleChange}
                  required
                />
                <Form.Input
                  label="Password"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleChange}
                  required
                />
                <Form.Select
                  label="Type"
                  options={options}
                  placeholder="Client"
                  required
                  name="role"
                  onChange={this.handleChange}
                />
                <Form.Button content="Submit" />
              </Segment>
            </Form>
            <Message>
              Already have an account? Login <Link to="/signin">here</Link>
            </Message>
            {error === '' ? '' : <ErrorMessage error header="Registration was not successful" content={error} />}
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

// 3
// Signup = withRouter(Signup);

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(Signup);
