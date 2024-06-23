import { styled } from "solid-styled-components";
import { AppBar, Toolbar, Typography } from "@suid/material";

// Header Component
const StyledAppBar = styled(AppBar)`
  background-color: #004d40;
`;

export const Header = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Ollama Quiz
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
};
