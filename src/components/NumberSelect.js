import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

const values = [...Array(21).keys()].filter(f => f > 0);


export function NumberSelect(props) {
  return (
  <TextField
    id="standard-select-native"
    fullWidth={true}
    select
    type={"number"}
    value={props.value}
    label={"Select the number of colors"}
    onChange={(event) => props.setK(event.target.value)}
    >
    {values.map(value => (
        <MenuItem key={value} value={value}>
            {value}
        </MenuItem>
    ))
    }
    </TextField>
  )
}