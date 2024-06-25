import { Component, createSignal, onMount } from "solid-js";
import { emit } from "@tauri-apps/api/event";
import { styled } from "solid-styled-components";
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from "@suid/material";
import { QuizInfo } from "../../types";
import { getLocalQuizes, removeLocalQuiz } from "../../hooks/local";
import { map } from "lodash";
import { Container } from "../layout/Container";

const MenuTitle = styled("div")`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 10px;
  flex: 1;
`;

const MenuItemStyled = styled(MenuItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

interface QuizLoadProps {
  onLoad: (quiz: QuizInfo) => void;
  onBack: () => void;
  quizes: QuizInfo[];
  isApp: boolean;
}

export const QuizLoad: Component<QuizLoadProps> = ({ onLoad, onBack, quizes, isApp }) => {
  const [localQuizes, setLocalQuizes] = createSignal<QuizInfo[]>([]);

  onMount(() => {
    const localQuizes = getLocalQuizes();
    setLocalQuizes(localQuizes);
  });

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          flex: 1,
          gap: 2,
        }}
      >
        <FormControl fullWidth margin="normal">
          <InputLabel>Local Storage</InputLabel>
          <Select value={""} onChange={(e) => {}}>
            {map(localQuizes(), (values: QuizInfo) => (
              <MenuItemStyled>
                <MenuTitle>{values.name}</MenuTitle>
                <Button
                  onClick={() => {
                    onLoad(values);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Load
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(values.data));
                  }}
                  variant="contained"
                  color="primary"
                >
                  Export
                </Button>
                <Button
                  onClick={() => {
                    const localQuizes = removeLocalQuiz(values.name);
                    setLocalQuizes(localQuizes);
                  }}
                  variant="contained"
                  color="secondary"
                >
                  Remove
                </Button>
              </MenuItemStyled>
            ))}
          </Select>
        </FormControl>
        {isApp && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Disk</InputLabel>
            <Select value={""} onChange={(e) => {}}>
              {map(quizes, (values: QuizInfo) => (
                <MenuItemStyled>
                  <MenuTitle>{values.name}</MenuTitle>
                  <Button
                    onClick={() => {
                      onLoad(values);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Load
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(values.data));
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Export
                  </Button>
                  <Button
                    onClick={() => {
                      emit("remove_quiz", values.name);
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    Remove
                  </Button>
                </MenuItemStyled>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Button onClick={onBack} variant="contained" color="primary">
        Back
      </Button>
    </Container>
  );
};
