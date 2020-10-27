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
import { BlockPicker, TwitterPicker } from 'react-color';
import { Card, Button } from '@material-ui/core';
import { samplePalletes } from '../data/samplePalletes';
import { NumberSelect } from './NumberSelect';

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


// GeneratePallete setMode={props.setMode} updatePallete={updatePallete
function GeneratePallete(props) {
  const [k, setK] = useState(5)

  return (
    <div>
      <ListItem>
        <NumberSelect value={k} setK={setK}/>    
      </ListItem>
      <Button onClick={() => {props.setMode("generate-pallete"); props.updatePallete(k)}}>Create pallete</Button>
    </div>
  )
}
  

//<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
const NewPalleteItem = props => 
  <ListItem button onClick={() => {props.clearPallete(); props.setMode("create-pallete")}}>
    <ListItemText primary={"New pallete"} />
  </ListItem>

const NewPalleteOptions = props =>
  <List>
    {
      (props.blockAddNewFeature) ?
        <ListItem disabled>
          <ListItemText primary={"Generate for whole view"}/>
        </ListItem> :
        <ListItem button onClick={
          () => {
            props.setMode("generate-pallete");
            props.handlePalleteFullView()
          }
        }>
          <ListItemText primary={"Generate for whole view"}/>
        </ListItem>
    }
    {
      (props.blockAddNewFeature) ?
        <ListItem disabled>
          <ListItemText primary={"Select area for pallete"}/>
        </ListItem> :
        <ListItem button onClick={() => props.setMode("select-area-for-pallete")}>
          <ListItemText primary={"Select area for pallete"}/>
        </ListItem>
    }
    <ListItem button onClick={() => props.setMode("adjust-area-for-pallete")}>
      <ListItemText primary={"Adjust area for pallete"}/>
    </ListItem>
    <ListItem button onClick={() => props.setMode("slide-area-for-pallete")}>
      <ListItemText primary={"Move area for pallete"}/>
    </ListItem>
  </List>

function ColorPallete(props) {
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
  
function SamplePallete(props) {
  return (
    <div>
      <Button onClick={() => {
        props.updateViewAndFeatures(props.deckViewState, props.featureCollection);
        props.setColors(props.colors)
        props.setMode("generate-pallete")
      }
      } 
      >{props.name + " 🛫  🎨"}</Button>
      <ColorPallete colors={props.colors}/>
    </div>
  )
}

function BackButton(props) {
  return (
    <ListItem button onClick={() => {props.setMode("init"); props.clearPallete()}}>
      <ListItemText primary={"Back to samples"} />
    </ListItem>
  )
}


export default function ClippedDrawer(props) {
  const classes = useStyles();
  const styles = {
    rectangle: {
        width: '50px',
        height: '50px',
    }
}
  console.log("App mode", props.mode)
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" noWrap>
            Geopallete
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
              <BackButton setMode={props.setMode} clearPallete={props.clearPallete}/> 
              <Divider />
            </div> :
            <div/>
          }
          <List>
            <NewPalleteItem clearPallete={props.clearPallete} setMode={props.setMode}/>
          </List>
          {
            (props.mode.panelMode.edit) ?
            <div>
              <Divider />
              <NewPalleteOptions blockAddNewFeature={props.featureCollection.features.length > 0} setMode={props.setMode} handlePalleteFullView={props.handlePalleteFullView}/> 
            </div> :
            <div/>
          }
          {( props.mode.generate || props.featureCollection.features.length > 0 ) ?
          <div>
            <Divider />
            <List>
              <GeneratePallete setMode={props.setMode} updatePallete={props.updatePallete}/>
              {(props.colors != null) ?
                <ColorPallete colors={props.colors}/> :
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
              {samplePalletes.map(p => <SamplePallete setColors={props.setColors} setMode={props.setMode} onClick={() => console.log("HERE")} {...p} updateViewAndFeatures={props.updateViewAndFeatures}/>)}
            </List>
          </div> :
          <div/>
          }
        </div>
      </Drawer>
    </div>
  );
}

/*
 <Card style={{backgroundColor: "#86815C"}}>
        Your card content..
        </Card>
*/