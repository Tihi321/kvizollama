import { styled } from "solid-styled-components";
import { Typography } from "@suid/material";

// Header Component
const StyledAppBar = styled("div")`
  background-color: ${(props) => props?.theme?.colors.background};
  color: ${(props) => props?.theme?.colors.text};
  text-align: center;
  padding: 8px;
  cursor: pointer;
`;

export const Header = () => {
  return (
    <StyledAppBar>
      <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
        Ollama Quiz
      </Typography>
    </StyledAppBar>
  );
};
