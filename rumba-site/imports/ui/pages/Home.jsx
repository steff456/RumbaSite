import React from 'react'
import { Image, Grid } from 'semantic-ui-react';
import styled from 'styled-components';

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
        <Image src="/images/home-page.jpg" />
      </MainGridColumn>
    </MainGridRow>
  </Grid>
);

export default Home
