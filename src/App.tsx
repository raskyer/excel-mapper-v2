import React, { useState } from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';

import Order from './components/Order/Order';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  appBarShift: (drawerWidth: number) => ({
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    })
  }),
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  drawer: (drawerWidth: number) => ({
    width: drawerWidth,
    flexShrink: 0
  }),
  drawerPaper: (drawerWidth: number) => ({
    width: drawerWidth
  }),
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: (drawerWidth: number) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    height: `calc(100vh - (${theme.mixins.toolbar.minHeight}px + 5px))`,
    marginTop: `calc(${theme.mixins.toolbar.minHeight}px + 5px)`
  }),
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: '0 !important'
  }
}));

const App: React.FC = () => {
  const drawerWidth = 240;
  const classes = useStyles(drawerWidth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar position="fixed" className={clsx(classes.appBar, isOpen && classes.appBarShift)}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsOpen(true)}
            className={clsx(classes.menuButton, isOpen && classes.hide)}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>

          <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
            Excel Mapper
          </Typography>

          <Button color="inherit">
            Clients / Transporteurs
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map(text => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <main className={clsx(classes.content, isOpen && classes.contentShift)}>
        <Order />
      </main>
    </div>
  );
};

export default App;
