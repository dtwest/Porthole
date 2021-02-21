import { Container, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { Email, GitHub, Home, LinkedIn, Telegram } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { Route } from '../routes';
import SideDrawer from './SideDrawer';

interface Props {
  children: React.ReactElement<any>;
}

const ElevationScroll = (props: Props) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(props.children, {
    elevation: trigger ? 4 : 0,
  });
}

const NavBar = (props: {links: Route[]}) => {

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar>
          <Toolbar component="nav" className="navbar">
            <Container maxWidth='md' className="navbar" style={{display: 'flex'}}>
            <IconButton edge="start" aria-label="home">
              <Link className="navLink" to="/">
                  <Home fontSize="large"/>
              </Link>
            </IconButton>
            <div>
              <IconButton edge="start" aria-label="linkedin">
                <a className="navLink" href="https://au.linkedin.com/in/dylantwest">
                  <LinkedIn fontSize="large"/>
                </a>
              </IconButton>
              <IconButton edge="start" aria-label="Github">
                <a className="navLink" href="https://github.com/dtwest">
                    <GitHub fontSize="large"/>
                </a>
              </IconButton>
              <IconButton edge="start" aria-label="Telegram">
                  <a className="navLink" href="https://t.me/dtwest">
                    <Telegram fontSize="large"/>
                  </a>
              </IconButton>
              <IconButton edge="start" aria-label="Email">
                  <a className="navLink" href="mailto:d.thomas.west@gmail.com">
                    <Email fontSize="large"/>
                  </a>
              </IconButton>
            </div>
            <SideDrawer links={props.links}/>
          </Container>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar id="toolbar"/>
    </React.Fragment>
  );
}

export default NavBar