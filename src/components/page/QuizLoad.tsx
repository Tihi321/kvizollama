import { Component, createSignal, onMount } from "solid-js";
import { emit } from "@tauri-apps/api/event";
import { styled } from "solid-styled-components";
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from "@suid/material";
import { CdnQuizInfo, CustomQuizInfo, QuizInfo } from "../../types";
import { getCustomQuizes, getLocalQuizes, removeLocalQuiz } from "../../hooks/local";
import { map } from "lodash";
import { Container } from "../layout/Container";
import { Trashcan } from "../icons/Trashcan";
import { Export } from "../icons/Export";
import { Load } from "../icons/Load";
import { Back } from "../icons/Back";

const MenuItemStyled = styled(MenuItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const MenuTitle = styled("div")`
  font-size: 14px;
  margin: 10px;
  word-break: break-all;
  flex: 1;

  @media (min-width: 700px) {
    font-size: 18px;
  }
`;

const ButtonsContainer = styled("div")<{ large: boolean }>`
  display: flex;
  gap: 10px;
  justify-content: center;
  width: ${(props) => (props?.large ? "100%" : "80px")};

  @media (min-width: 700px) {
    width: ${(props) => (props?.large ? "220px" : "80px")};
  }
`;

const ButtonElement = styled(Button)`
  flex: 1;
  text-align: center;
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
                <ButtonsContainer large={false}>
                  <ButtonElement
                    onClick={() => {
                      onFetchCDNLoad(values.path, values.name);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    <Load />
                  </ButtonElement>
                </ButtonsContainer>
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
                <ButtonsContainer large={true}>
                  <ButtonElement
                    onClick={() => {
                      onFetchLoad(values.url, values.name);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    <Load />
                  </ButtonElement>
                  <ButtonElement
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(values.url));
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    <Export />
                  </ButtonElement>
                  <ButtonElement
                    onClick={() => {
                      const localQuizes = removeLocalQuiz(values.name);
                      setLocalQuizes(localQuizes);
                    }}
                    variant="contained"
                    color="error"
                  >
                    <Trashcan />
                  </ButtonElement>
                </ButtonsContainer>
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
                <ButtonsContainer large={true}>
                  <ButtonElement
                    onClick={() => {
                      onLoad(values);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    <Load />
                  </ButtonElement>
                  <ButtonElement
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(values.data));
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    <Export />
                  </ButtonElement>
                  <ButtonElement
                    onClick={() => {
                      const localQuizes = removeLocalQuiz(values.name);
                      setLocalQuizes(localQuizes);
                    }}
                    variant="contained"
                    color="error"
                  >
                    <Trashcan />
                  </ButtonElement>
                </ButtonsContainer>
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
                  <ButtonsContainer large={true}>
                    <ButtonElement
                      onClick={() => {
                        onLoad(values);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      <Load />
                    </ButtonElement>
                    <ButtonElement
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(values.data));
                      }}
                      variant="contained"
                      color="secondary"
                    >
                      <Export />
                    </ButtonElement>
                    <ButtonElement
                      onClick={() => {
                        emit("remove_quiz", values.name);
                      }}
                      variant="contained"
                      color="error"
                    >
                      <Trashcan />
                    </ButtonElement>
                  </ButtonsContainer>
                </MenuItemStyled>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Button onClick={onBack} variant="contained" color="info">
        <Back />
      </Button>
    </Container>
  );
};
