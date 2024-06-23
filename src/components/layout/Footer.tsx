import { styled } from "solid-styled-components";
import { Typography, Container, Box, Link, Grid } from "@suid/material";

// Footer Component
const StyledFooter = styled("footer")`
  margin-top: auto;
  padding: 24px 0;
  background-color: #004d40;
  color: #ffffff;
`;

const FooterLink = styled(Link)`
  color: #b2dfdb;
  &:hover {
    color: #ffffff;
  }
`;

export const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Created by Tihomir Selak</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Links
            </Typography>
            <Box>
              <FooterLink href="#!" underline="hover">
                GitHub
              </FooterLink>
            </Box>
            <Box>
              <FooterLink href="#!" underline="hover">
                Portfolio
              </FooterLink>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" align="center">
            © 2024 Copyright Tihomir Selak
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
};
