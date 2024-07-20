import { Component, createSignal, onMount, createMemo, Show } from "solid-js";
import { Button, Select, MenuItem, Typography, Box } from "@suid/material";
import { Container } from "../layout/Container";
import { Back } from "../icons/Back";
import { styled } from "solid-styled-components";
import { getStringValue, saveStringValue } from "../../hooks/local";
import { getDefaultColor } from "./utils";
import { Trashcan } from "../icons/Trashcan";

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
}

export const BattleSettings: Component<BattleSettingsProps> = ({ onBack }) => {
  const [boardSize, setBoardSize] = createSignal();
  const [numberOfPlayers, setNumberOfPlayers] = createSignal();
  const [playerColors, setPlayerColors] = createSignal<string[]>([]);

  const mounted = createMemo(() => {
    return boardSize() !== undefined && numberOfPlayers() !== undefined;
  });

  onMount(() => {
    const storedColors = [1, 2, 3, 4].map(
      (player) => getStringValue(`kvizolamma/player${player}Color`) || getDefaultColor(player)
    );
    setPlayerColors(storedColors);
    const storedBoardSize = Number(getStringValue(`kvizolamma/boardsize`)) || 8;
    setBoardSize(storedBoardSize);
    const storedNumberOfPlayers = Number(getStringValue(`kvizolamma/numberofplayers`)) || 2;
    setNumberOfPlayers(storedNumberOfPlayers);
  });

  const handleNumberOfPlayersChange = (event: any) => {
    const newValue = Number(event.target.value);
    setNumberOfPlayers(newValue);
    saveStringValue(`kvizolamma/numberofplayers`, newValue.toString());
  };

  const handleColorChange = (player: number, color: string) => {
    const newColors = [...playerColors()];
    newColors[player - 1] = color;
    setPlayerColors(newColors);
    saveStringValue(`kvizolamma/player${player}Color`, color);
  };

  return (
    <Container>
      <Show when={mounted()} fallback={<div>Loading</div>}>
        <SettingsContainer>
          <SettingRow>
            <Typography variant="body1">Board Size:</Typography>
            <Select
              value={boardSize()}
              onChange={(event: any) => {
                const newValue = Number(event.target.value);
                setBoardSize(newValue);
                saveStringValue(`kvizolamma/boardsize`, newValue.toString());
              }}
              style={{ width: "100px" }}
            >
              <MenuItem value={6}>6x6</MenuItem>
              <MenuItem value={8}>8x8</MenuItem>
            </Select>
          </SettingRow>
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

          {[1, 2, 3, 4].slice(0, numberOfPlayers() as number).map((player) => (
            <SettingRow>
              <Typography variant="body1">Player {player} Color:</Typography>
              <Box
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}
              >
                <ColorPicker
                  type="color"
                  value={playerColors()[player - 1]}
                  onChange={(e) => handleColorChange(player, e.target.value)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleColorChange(player, getDefaultColor(player))}
                >
                  <Trashcan />
                </Button>
              </Box>
            </SettingRow>
          ))}

          <Button variant="contained" color="primary" onClick={onBack}>
            Save and Return
          </Button>
        </SettingsContainer>

        <Button variant="contained" color="info" onClick={onBack} sx={{ marginTop: "20px" }}>
          <Back />
        </Button>
      </Show>
    </Container>
  );
};
