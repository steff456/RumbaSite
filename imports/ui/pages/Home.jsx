import React from 'react'
import { Image, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
//Se debería dejar el css en otro archivo
const MainGridRow = styled(Grid.Row)`
  padding: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`;

const MainGridColumn = styled(Grid.Column)`
  padding: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const Home = () => (
  <Grid columns={1}>
    <MainGridRow>
      <MainGridColumn>
        <Image src="/images/home-page.jpg" alt="home-page"/>
      </MainGridColumn>
    </MainGridRow>
  </Grid>
);

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(Home);