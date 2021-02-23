import { DataGrid, PageChangeParams, ValueGetterParams } from '@material-ui/data-grid';
import React, { useEffect } from 'react';
import { Scan, ScanResponse } from './scan';

export const ScanTable = (props: {dataSource: string}) => {
  const [state, setState] = React.useState({
    scans: [] as Scan[],
    total: 10,
  })
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);


  const fetchRows = () => {
    fetch(`${props.dataSource}?page_size=${pageSize}&page=${page + 1}`)
      .then(response => response.json())
      .then((data: ScanResponse) => {
        setState((prevState) => {
          return {
            ...prevState,
            scans: data.scans,
            total: data.total,
          }
        })
      }).finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    fetchRows()
  }, [page, pageSize])
  
  const handleChangePage = (params: PageChangeParams) => {
    setPage(params.page);
    setPageSize(params.pageSize)
  };

  return (
    <div style={{ minHeight: '500px', width: '100%' }}>
      <DataGrid 
        rows={state.scans.map(s => ({...s, id: s.uri.split('/').pop()}))} 
        columns={[
          { field: 'id', headerName: 'ID', flex: 0.25 },
          { field: 'address', headerName: 'Address', flex: 0.25 },
          { field: 'ports', headerName: 'Ports', flex: 0.50 },
          { field: 'created_date', headerName: 'Created Date', flex: 0.25 },
        ]}
        rowCount={state.total}
        pageSize={pageSize} 
        pagination
        paginationMode="server"
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageChange={handleChangePage}
        loading={loading}
        autoHeight
      />
    </div>
  );
}

export default ScanTable