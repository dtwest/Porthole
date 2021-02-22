import { SnackbarProps, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export interface Props {
  alertProps: AlertProps;
  snackBarProps: SnackbarProps;
  message: string;
}

export default function SnackBar(props: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar {...props.snackBarProps} >
        <Alert {...props.alertProps} >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}