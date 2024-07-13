import { Component } from "solid-js";
import { Button } from "@suid/material";
import { Container } from "../layout/Container";
import { Back } from "../icons/Back";

interface BattleSettingsProps {
  onBack: () => void;
}

export const BattleSettings: Component<BattleSettingsProps> = ({ onBack }) => {
  return (
    <Container>
      <Button variant="contained" color="info" onClick={onBack}>
        <Back />
      </Button>
    </Container>
  );
};
