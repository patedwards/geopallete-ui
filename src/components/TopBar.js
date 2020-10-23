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
const GeneratePallete = props => 
  <ListItem button onClick={() => {props.setMode("generate-pallete"); props.updatePallete()}}>
    <ListItemText primary={"Generate pallete"} />
  </ListItem>

//<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
const NewPalleteItem = props => 
  <ListItem button onClick={() => props.setMode("create-pallete")}>
    <ListItemText primary={"New pallete"} />
  </ListItem>

const NewPalleteOptions = props =>
  <List>
    <ListItem button onClick={() => props.setMode("generate-pallete")}>
      <ListItemText primary={"Generate for whole view"}/>
    </ListItem>
    <ListItem button onClick={() => props.setMode("select-area-for-pallete")}>
      <ListItemText primary={"Select area for pallete"}/>
    </ListItem>
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
  


export default function ClippedDrawer(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            GeoPallete
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
          <List>
            <NewPalleteItem setMode={props.setMode}/>
          </List>
          <Divider />
          <NewPalleteOptions setMode={props.setMode}/>
          <Divider />
          <List>
            <GeneratePallete setMode={props.setMode} updatePallete={props.updatePallete}/>
            {(props.colors != null) ?
              <ColorPallete colors={props.colors}/> :
              <div/>
            }
          </List>
        </div>
      </Drawer>
    </div>
  );
}