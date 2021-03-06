import { Drawer, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Route } from '../routes';

const SideDrawer = (props: {links: Route[]}) => {
    const [state, setState] = useState({ right: false });

    const toggleDrawer = (right: boolean) => (event: any) => {
        if (
          event.type === "keydown" &&
          (event.key === "Tab" || event.key === "Shift")
        ) {
          return;
        }
    
        setState({ right });
    };

    const sideDrawerList = () => (
        <div
        className="drawerList"
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List component="nav">
            <Link className="navLink" style={{color: "white"}} to="/" >
              <ListItem  color='white' button>
                <ListItemText color='white' primary="Home"/>
              </ListItem>
            </Link>
          {props.links.map(({ title, to }) => (
            <Link className="navLink" style={{color: "white"}} to={to}>
               <ListItem color='white' button>
                 <ListItemText color='white' primary={title}/>
               </ListItem>
             </Link>
          ))}
        </List>
      </div>
    )

    return (
        <React.Fragment>
            <div>
              <IconButton 
                edge="start"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                  <Menu fontSize="large" style={{ color: 'white'}} />
              </IconButton>
            </div>
            <Drawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer(false)}
            >
                {sideDrawerList()}
            </Drawer>
        </React.Fragment>
    );
}

export default SideDrawer