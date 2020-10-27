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
import { GeneratePalette, NewPalette, NewPaletteOptions, EditPaletteOptions, ColorPalette, SamplePalette, BackButton } from './Tasks';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));




export default function TaskBar(props) {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" noWrap>
            Palette Map
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          {
            (props.mode.panelMode.backButton) ?
            <div>
              <BackButton setMode={props.setMode} clearPalette={props.handleClearPalette}/> 
              <Divider />
            </div> :
            <div/>
          }
            <NewPalette clearPalette={props.handleClearPalette} setMode={props.setMode}/>

          {
            (props.mode.panelMode.create) ?
            <div>
              <Divider />
              <NewPaletteOptions blockAddNewFeature={props.featureCollection.features.length > 0} setMode={props.setMode} handlePaletteFullView={props.handlePaletteFullView}/> 
            </div> :
            <div/>
          }
          {
            (props.mode.panelMode.edit && props.featureCollection.features.length > 0) ?
            <div>
              <Divider />
              <EditPaletteOptions blockAddNewFeature={props.featureCollection.features.length > 0} setMode={props.setMode} handlePaletteFullView={props.handlePaletteFullView}/> 
            </div> :
            <div/>
          }
          {( props.mode.generate || props.featureCollection.features.length > 0 ) ?
          <div>
            <Divider />
            <List>
              <GeneratePalette setMode={props.setMode} updatePalette={props.updatePalette}/>
              {(props.colors != null) ?
                <ColorPalette colors={props.colors}/> :
                (props.loadingPalette) ?
                  <CircularProgress color="secondary" /> :
                  <div/>
              }
            </List>
          </div> :
          <div/>
          }
          {( props.mode.panelMode.library ) ?
          <div>
            <Divider />
            <List>
              {samplePalettes.map(p => <SamplePalette setColors={props.setColors} setMode={props.setMode} onClick={() => console.log("HERE")} {...p} updateViewAndFeatures={props.updateViewAndFeatures}/>)}
            </List>
          </div> :
          <div/>
          }
          {( props.mode.guidanceText ) ?
          <div>
            <Divider />
            <GuidanceText text={props.mode.guidanceText}/>
          </div> :
          <div/>
          }
        </div>
      </Drawer>
    </div>
  );
}