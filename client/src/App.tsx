import { CssBaseline } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Route, Switch } from 'react-router-dom';
import './app.css';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import routes from './routes';
import theme from './theme';

const App = () =>  {
  const themeProvider = createMuiTheme(theme())

  return (
    <ThemeProvider theme={themeProvider}>
      <CssBaseline />
      <Navbar links={routes}/>
      <Container>
        <Switch>
          <Route exact path="/">
              <Home/>
          </Route>
          {routes.map(({title, to, page}) => (
            <Route path={to}>
              {page()}
            </Route>
          ))}
        </Switch>
      </Container>
      <ScrollToTop top="#toolbar">
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollToTop>
    </ThemeProvider>
  )
}

export default App