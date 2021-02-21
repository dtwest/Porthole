export interface Route {
  title: string;
  to: string;
  page: () => JSX.Element
}

const routes: Route[] = [ ]

export default routes