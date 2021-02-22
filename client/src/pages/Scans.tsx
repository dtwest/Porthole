import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import Address from './Address';
import ScanTable from '../components/scan/ScanTable';

const Scans = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/Addresses/:address'>
          <Address />
        </Route>
        <Route path='/'>
          <h1>All Scans</h1>
          <ScanTable dataSource='http://localhost:8000/api/v1.0/scans'/>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Scans