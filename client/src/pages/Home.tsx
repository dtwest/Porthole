import { Container } from '@material-ui/core';
import { Fragment } from 'react';
import InitiateScanForm from '../components/scan/InitiateScanForm';

const Home = () => {
        return (
          <Fragment>
            <Container>
              <h1>Placeholder Home Page</h1>
              <InitiateScanForm/>
            </Container>
          </Fragment>
        )
}

export default Home