import React, { Fragment } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import Scan from './scan';

export const AddressDetails = (props: {latestScan?: Scan, previousScan?: Scan}) => {
  return (
    <Fragment>
      <ReactDiffViewer 
        newValue={props.latestScan?.ports || ''}
        oldValue={props.previousScan?.ports || ''}
        splitView={true}
      />
    </Fragment>
  )
}

export default AddressDetails
