import Scans from './pages/Scans';

export interface Route {
  title: string;
  to: string;
  page: () => JSX.Element
}

const routes: Route[] = [ 
  {
    title: 'Addresses',
    to: '/Addresses',
    page: Scans
  },
  {
    title: 'Scans',
    to: '/Scans',
    page: Scans
  }
]

export default routes