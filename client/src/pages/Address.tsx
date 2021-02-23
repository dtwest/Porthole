import { Container, Typography } from "@material-ui/core";
import { Fragment, useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import ScanTable from '../components/scan/ScanTable';
import AddressDetails from '../components/scan/AddressDetails';
import Scan from "../components/scan/scan";

const Address = () => {
  const { address } = useParams() as { address: string}
  const dataSource = `http://localhost:8000/api/v1.0/scans/address/${address}`
  const [scans, setScans] = useState([] as Scan[])

  useEffect(() => {
    fetch(`${dataSource}?page_size=2&page=1`)
      .then(response => response.json())
      .then(data => {
        setScans(data.scans)
      })
  }, [])

  return (
    <Fragment>
      <Container>
        <Typography component='h1' gutterBottom variant='h3' align='center'>
          Scans for "{address}" 
        </Typography>
        <AddressDetails latestScan={scans[0]} previousScan={scans[1]}/>
      </Container>
      <ScanTable dataSource={dataSource}/>
    </Fragment>
  )
}

export default Address