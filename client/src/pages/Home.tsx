import { Container, Typography } from '@material-ui/core';
import { Fragment } from 'react';
import InitiateScanForm from '../components/scan/InitiateScanForm';

const Home = () => {
        return (
          <Fragment>
            <Container>
              <Typography component='h1' gutterBottom variant='h3' align='center'>
                Porthole, your one stop port scanning shop!
              </Typography>
              <InitiateScanForm/>
            </Container>
          </Fragment>
        )
}

export default Home