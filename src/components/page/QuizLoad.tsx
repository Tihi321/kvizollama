import { Component, createSignal, onMount } from "solid-js";
import { emit } from "@tauri-apps/api/event";
import { styled } from "solid-styled-components";
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from "@suid/material";
import { CdnQuizInfo, CustomQuizInfo, QuizInfo } from "../../types";
import { getCustomQuizes, getLocalQuizes, removeLocalQuiz } from "../../hooks/local";
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
  onFetchCDNLoad: (path: string, name: string) => void;
  onFetchLoad: (url: string, name: string) => void;
  onBack: () => void;
  quizes: QuizInfo[];
  cdnQuizes: CdnQuizInfo[];
  isApp: boolean;
}

export const QuizLoad: Component<QuizLoadProps> = ({
  onLoad,
  onFetchCDNLoad,
  onFetchLoad,
  onBack,
  quizes,
  cdnQuizes,
  isApp,
}) => {
  const [localQuizes, setLocalQuizes] = createSignal<QuizInfo[]>([]);
  const [customQuizes, setCustomQuizes] = createSignal<CustomQuizInfo[]>([]);

  onMount(() => {
    const localQuizes = getLocalQuizes();
    setLocalQuizes(localQuizes);
    const customQuizes = getCustomQuizes();
    setCustomQuizes(customQuizes);
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
          <InputLabel>CDN</InputLabel>
          <Select value={""} onChange={() => {}}>
            {map(cdnQuizes, (values: CdnQuizInfo) => (
              <MenuItemStyled>
                <MenuTitle>{values.name}</MenuTitle>
                <Button
                  onClick={() => {
                    onFetchCDNLoad(values.path, values.name);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Load
                </Button>
              </MenuItemStyled>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Custom Quizes</InputLabel>
          <Select value={""} onChange={() => {}}>
            {map(customQuizes(), (values: CustomQuizInfo) => (
              <MenuItemStyled>
                <MenuTitle>{values.name}</MenuTitle>
                <Button
                  onClick={() => {
                    onFetchLoad(values.url, values.name);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Load
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(values.url));
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Local Storage</InputLabel>
          <Select value={""} onChange={() => {}}>
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
            <Select value={""} onChange={() => {}}>
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
