import { ThemeOptions } from '@material-ui/core';
import { deepPurple, indigo } from '@material-ui/core/colors';

const theme = (): ThemeOptions => ({
    palette: {
        type: 'dark',
        primary: {
            main: deepPurple[500]
        },
        secondary: {
            main: indigo[500],
        }
    },
});

export default theme;