import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {alpha} from "@mui/material";

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
    justifyContent: 'center' as const,
    width: '100%',
    minHeight: '100%',
  })),
  LoginBox: styled(Box, {
    name: 'MuiLoginBox',
    slot: 'root',
  })(({theme}) => ({
    background: alpha(theme.palette.background.paper, 0.3),
    backdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: theme.spacing(5),
    padding: theme.spacing(5),
    flex: 1,
    zIndex: 1,
  })),
  Feathers: styled(Box, {
    name: 'MuiFeathersBox',
    slot: 'root',
  })(() => ({
    background: 'transparent',
    width: '66%',
  })),
  Background: styled("div", {
    name: 'MuiBackground',
    slot: 'root',
    shouldForwardProp: (prop) => prop !== 'src',
  })<BackgroundProps>(({theme, src}) => ({
    position: 'absolute',
    background: `url(${src})`,
    width: '100%',
    height: '100%',
    borderColor: theme.palette.background.paper
  })),
}

export default Styled;
