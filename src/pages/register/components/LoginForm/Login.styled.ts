import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Alert } from "@mui/material";

interface BackgroundProps {
    src: string;
}

const Styled = {
  LoginRoot: styled(Box, {
    name: 'MuiLoginRoot',
    slot: 'root',
  })(({theme}) => ({
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start' as const,
    width: '100%',
    maxHeight: '100%',
  })),
  LoginBox: styled(Box, {
    name: 'MuiLoginBox',
    slot: 'root',
  })(() => ({
    backdropFilter: 'blur(20px)',
    overflowY: 'auto',
    height: '100vh',
    width: '100%'
  })),
  LoginWrapper: styled(Box, {
    name: 'MuiLoginBox',
    slot: 'root',
  })(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: theme.spacing(5),
    padding: theme.spacing(5),
    zIndex: 1,
    position: 'relative',
    minHeight: '100%',
  })),
  Feathers: styled(Box, {
    name: 'MuiFeathersBox',
    slot: 'root',
  })(({theme}) => ({
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
      width: `calc(100% - 50%)`,
      padding: theme.spacing(5),
    },
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - 450px)`,
    },
    display: 'none',
    zIndex: 2,
  })),
  Background: styled("div", {
    name: 'MuiBackground',
    slot: 'root',
    shouldForwardProp: (prop) => prop !== 'src',
  })<BackgroundProps>(({theme, src}) => ({
    position: 'absolute',
    background: `url(${src})`,
    width: '100%',
    height: '100vh',
    borderColor: theme.palette.background.paper,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  })),
  Alert: styled(Alert, {
    name: 'MuiAlert',
    slot: 'root',
  })(({theme}) => ({
    position: 'absolute',
    top: '2%',
    zIndex: 2,
    width: `calc(100% - ${theme.spacing(5)} - ${theme.spacing(5)})`,
  })),
}

export default Styled;
