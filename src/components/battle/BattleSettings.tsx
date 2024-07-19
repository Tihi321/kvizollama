import { Component, createSignal, createEffect } from "solid-js";
import { Button, Select, MenuItem, Typography } from "@suid/material";
import { Container } from "../layout/Container";
import { Back } from "../icons/Back";
import { styled } from "solid-styled-components";
import { getStringValue, saveStringValue } from "../../hooks/local";

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColorPicker = styled.input`
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
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
  const [playerColors, setPlayerColors] = createSignal<string[]>([]);

  createEffect(() => {
    const storedColors = [1, 2, 3, 4].map(
      (player) => getStringValue(`kvizolamma/player${player}Color`) || getDefaultColor(player)
    );
    setPlayerColors(storedColors);
  });

  const handleNumberOfPlayersChange = (event: any) => {
    const newValue = Number(event.target.value);
    setNumberOfPlayers(newValue);
    onSettingsChange({ numberOfPlayers: newValue });
  };

  const handleColorChange = (player: number, color: string) => {
    const newColors = [...playerColors()];
    newColors[player - 1] = color;
    setPlayerColors(newColors);
    saveStringValue(`kvizolamma/player${player}Color`, color);
  };

  const getDefaultColor = (player: number): string => {
    const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"];
    return colors[player - 1] || colors[0];
  };

  return (
    <Container>
      <SettingsContainer>
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

        {[1, 2, 3, 4].slice(0, numberOfPlayers()).map((player) => (
          <SettingRow>
            <Typography variant="body1">Player {player} Color:</Typography>
            <ColorPicker
              type="color"
              value={playerColors()[player - 1]}
              onChange={(e) => handleColorChange(player, e.target.value)}
            />
          </SettingRow>
        ))}

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
