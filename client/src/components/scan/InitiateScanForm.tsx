import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { Link } from 'react-router-dom';
import Scan from './scan';
import SnackBar from '../SnackBar';
import { Props as SnackBarProps } from '../SnackBar';
import { Color } from '@material-ui/lab/Alert';


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
  snackBarProps: SnackBarProps
}

export default function InitiateScanForm() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    loading: false,
    snackBarProps: {
      snackBarProps: {
        open: false,
        autoHideDuration: 3000,
      },
      alertProps: {
        severity: 'info'
      },
      message: 'Welcome!'
    }
  } as InitiateScanFormState);



  const snackBarOnClose = (_: React.SyntheticEvent<Element, Event>, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    state.snackBarProps.snackBarProps.open = false
    setState((prevState: InitiateScanFormState) => {
      const clone = JSON.parse(JSON.stringify(prevState)) as InitiateScanFormState
      clone.snackBarProps.snackBarProps.open = false

      return clone
    });
  };

  const handleClick = () => {
    setState({...state, loading: true})
      type Data = {scans: Scan[]}
      const getNewState = (appState: InitiateScanFormState, message: string, severity?: Color, data?: Data) => {
        const clone = JSON.parse(JSON.stringify(appState)) as InitiateScanFormState
        clone.snackBarProps.alertProps.onClose = snackBarOnClose
        clone.snackBarProps.alertProps.severity = severity
        clone.snackBarProps.snackBarProps.onClose = snackBarOnClose
        clone.snackBarProps.message = message
        clone.snackBarProps.snackBarProps.open = true
        clone.scans = data?.scans || []
        clone.loading = false
        return clone
     }

    fetch('http://localhost:8000/api/v1.0/scans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        addresses: state.addresses?.split(',').map(str => str.trim())
      })
    }).then(response => {
      if (response.status > 299) {
        throw Error(`${response.status}: ${response.statusText}!`)
      }

      return response.json()
    })
    .then((data: {scans: Scan[]}) => {
      setState((prevState: InitiateScanFormState) => {
        return getNewState(prevState, 'Scan Request Creation Was Successful!', 'success', data)
      })
    })
    .catch(error => {
      console.error(error)
      setState((prevState: InitiateScanFormState) => {
        return getNewState(prevState, error.message, 'error')
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
                <Link style={{color: "white"}} to={`/Addresses/${scan.address}`}>
                  {`localhost:8000/Addresses/${scan.address}`}
                </Link>
              </li>
            ))}
          </ul>
      </Fade>
      <SnackBar {...state.snackBarProps}/>
    </Fragment>
  );
}
