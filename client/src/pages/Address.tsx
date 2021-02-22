import { Fragment } from "react"
import { useParams } from "react-router-dom";
import ScanTable from '../components/scan/ScanTable';

const Address = () => {
  const { address } = useParams() as { address: string}
  
  return (
    <Fragment>
      <h1>Address {address}</h1>
      <ScanTable dataSource={`http://localhost:8000/api/v1.0/scans/address/${address}`}/>
    </Fragment>
  )
}

export default Address