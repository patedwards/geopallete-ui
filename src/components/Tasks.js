import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { BlockPicker, TwitterPicker } from 'react-color';
import { Card, Button } from '@material-ui/core';
import { samplePalettes } from '../data/samplePalettes';
import { NumberSelect } from './NumberSelect';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GuidanceText } from './Alert';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export function GeneratePalette(props) {
    const [k, setK] = useState(5)
  
    return (
      <div>
        <ListItem>
          <NumberSelect value={k} setK={setK}/>    
        </ListItem>
        <Button onClick={() => { props.setMode("generate-palette"); props.updatePalette(k)}}>Create palette</Button>
      </div>
    )
  }

export const NewPalette = props => 
  <ListItem>
    <Fab color="secondary" aria-label="add" variant="extended" onClick={() => {props.clearPalette(); props.setMode("create-palette")}}>
        <AddIcon />
        New palette
      </Fab>
  </ListItem>

export const NewPaletteOptions = props =>
  <List>
    {
      (props.blockAddNewFeature) ?
        <ListItem disabled>
          <ListItemText primary={"Generate for whole view"}/>
        </ListItem> :
        <ListItem button onClick={
          () => {
            props.setMode("generate-palette");
            props.handlePaletteFullView()
          }
        }>
          <ListItemText primary={"Generate for whole view"}/>
        </ListItem>
    }
    {
      (props.blockAddNewFeature) ?
        <ListItem disabled>
          <ListItemText primary={"Select area for palette"}/>
        </ListItem> :
        <ListItem button onClick={() => props.setMode("select-area-for-palette")}>
          <ListItemText primary={"Select area for palette"}/>
        </ListItem>
    }
  </List>

export const EditPaletteOptions = props =>
  <List>
    <ListItem button onClick={() => props.setMode("adjust-area-for-palette")}>
      <ListItemText primary={"Adjust area for palette"}/>
    </ListItem>
    <ListItem button onClick={() => props.setMode("slide-area-for-palette")}>
      <ListItemText primary={"Move area for palette"}/>
    </ListItem>
  </List>

export function ColorPalette(props) {
  const [color, setColor] = useState(props.colors[0])
  
  function handleChangeComplete(color) {
    setColor(color)
  }
  console.log(props);
  return (
    <ListItem>
      <BlockPicker color={color} onChangeComplete={handleChangeComplete} colors={props.colors} triangle={"hide"} width={340}/>  
    </ListItem>
  )
} 
  
export function SamplePalette(props) {
  return (
    <div>
      <Button onClick={() => {
        props.updateViewAndFeatures(props.deckViewState, props.featureCollection);
        props.setColors(props.colors)
        props.setMode("generate-palette")
      }
      } 
      >{props.name + " 🛫  🎨"}</Button>
      <ColorPalette colors={props.colors}/>
    </div>
  )
}

export function BackButton(props) {
  return (
    <ListItem button onClick={() => {props.setMode("init"); props.clearPalette()}}>
      <ArrowBackIcon/>
      <ListItemText primary={"Back to samples"} />
    </ListItem>
  )
}


