import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Link from '@material-ui/core/Link';
import Scan from './scan';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export interface InitiateScanFormState {
  loading: boolean;
  scans?: Scan[];
  addresses?: string;
}

export default function InitiateScanForm() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    loading: false,
  } as InitiateScanFormState);

  const handleClick = () => {
    setState({...state, loading: true})
    fetch('http://localhost:8000/api/v1.0/scans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        addresses: state.addresses?.split(',').map(str => str.trim())
      })
    }).then(response => response.json())
      .then((data: {scans: Scan[]}) => {
        setState({
          ...state,
          loading: false,
          scans: data.scans
        })
      })
      .catch(error => {
        console.error(error)
        setState({
          ...state,
          loading: false,
        })
      })
  }

  return (
    <Fragment>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder='Initiate Port Scans, e.g "1.1.1.1", or "google.com, 8.8.8.8"'
          inputProps={{ 'aria-label': 'Initiate a Port Scan' }}
          disabled={state.loading}
          onChange={(event) => {
            setState({
              ...state, 
              addresses: event.target.value
            })
          }}
        />
        <div>
          <Fade
            in={state.loading}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        </div>
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton onClick={handleClick} disabled={state.loading || !state.addresses} className={classes.iconButton} aria-label="directions">
          <DirectionsIcon />
        </IconButton>
      </Paper>
      <Fade in={!state.loading && !!state.scans} unmountOnExit>
          <ul>
            {state.scans?.map((scan: Scan) => (
              <li>
                <Link href={scan.uri} color='textPrimary'>
                  {`localhost:8000${scan.uri}`}
                </Link>
              </li>
            ))}
          </ul>
      </Fade>
    </Fragment>
  );
}
