import { Component, createSignal } from "solid-js";
import { Button, Select, MenuItem, Typography } from "@suid/material";
import { Container } from "../layout/Container";
import { Back } from "../icons/Back";
import { styled } from "solid-styled-components";

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface BattleSettingsProps {
  onBack: () => void;
  onSettingsChange: (settings: { numberOfPlayers: number }) => void;
  initialNumberOfPlayers: number;
}

export const BattleSettings: Component<BattleSettingsProps> = ({
  onBack,
  onSettingsChange,
  initialNumberOfPlayers,
}) => {
  const [numberOfPlayers, setNumberOfPlayers] = createSignal(initialNumberOfPlayers);

  const handleNumberOfPlayersChange = (event: any) => {
    const newValue = Number(event.target.value);
    setNumberOfPlayers(newValue);
    onSettingsChange({ numberOfPlayers: newValue });
  };

  return (
    <Container>
      <SettingsContainer>
        <Typography variant="h4" component="h1">
          Battle Settings
        </Typography>

        <SettingRow>
          <Typography variant="body1">Number of Players:</Typography>
          <Select
            value={numberOfPlayers()}
            onChange={handleNumberOfPlayersChange}
            style={{ width: "100px" }}
          >
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
          </Select>
        </SettingRow>

        <Button variant="contained" color="primary" onClick={onBack}>
          Save and Return
        </Button>
      </SettingsContainer>

      <Button variant="contained" color="info" onClick={onBack} sx={{ marginTop: "20px" }}>
        <Back />
      </Button>
    </Container>
  );
};
