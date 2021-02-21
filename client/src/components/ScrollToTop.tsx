import { createStyles, makeStyles, Theme, Zoom } from '@material-ui/core';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import React from 'react';

interface Props {
  top?: string;
  children: React.ReactElement<any>;
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
  }),
)

const ScrollToTop = (props: Props) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
      props.top ? props.top : '#',
    );
  
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={styles().root}>
        {props.children}
      </div>
    </Zoom>
  )
}

export default ScrollToTop