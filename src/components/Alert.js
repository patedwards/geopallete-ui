import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

export const GuidanceText = (props) => {
    const classes = useStyles();
    return (
      <Alert severity="info" icon={false} className={classes.root}>
        <AlertTitle>Help</AlertTitle>
        {props.text}
      </Alert>
    )
}
  
  