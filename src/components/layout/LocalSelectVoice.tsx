import { onMount, createSignal, createEffect } from "solid-js";
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from "@suid/material";
import { isEmpty, map } from "lodash";
import { styled } from "solid-styled-components";
import { getStringValue, saveStringValue } from "../../hooks/local";
import { getVoices } from "../../utils";

const MenuItemStyled = styled(MenuItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const MenuTitle = styled("div")`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 10px;
  flex: 1;
`;

export const LocalSelectVoice = () => {
  const [selectedVoice, setSelectedVoice] = createSignal("");
  const [mounted, setMounted] = createSignal(false);
  const [availableVoices, setAvailableVoices] = createSignal<SpeechSynthesisVoice[]>([]);

  onMount(() => {
    const voice = getStringValue("selectedVoice");
    setSelectedVoice(voice || "");
    setMounted(true);
  });

  createEffect(() => {
    if (mounted()) {
      const voices = getVoices();
      setAvailableVoices(voices);
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        gap: 2,
        flex: 1,
      }}
    >
      <FormControl fullWidth margin="normal">
        <InputLabel>Voices</InputLabel>
        <Select
          value={selectedVoice()}
          onChange={(event) => {
            setSelectedVoice(event.target.value);
          }}
        >
          {map(availableVoices(), (values: SpeechSynthesisVoice) => (
            <MenuItemStyled value={values.name}>
              <MenuTitle>{values.name}</MenuTitle>
            </MenuItemStyled>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          gap: 2,
          flex: 1,
        }}
      >
        <Button
          disabled={isEmpty(availableVoices())}
          variant="contained"
          color="primary"
          onClick={() => {
            const voice = getStringValue("selectedVoice");
            saveStringValue("selectedVoice", voice || "");
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};
