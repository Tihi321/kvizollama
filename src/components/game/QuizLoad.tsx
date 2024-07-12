import { Component, createSignal, onMount, Show } from "solid-js";
import { emit } from "@tauri-apps/api/event";
import { styled } from "solid-styled-components";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@suid/material";
import { CdnQuizInfo, CustomQuizInfo, QuizInfo, SelectedQuizes } from "../../types";
import {
  getBooleanValue,
  getCustomQuizes,
  getLocalQuizes,
  getSelectedQuizes,
  getStringValue,
  removeLocalQuiz,
  removeSelectedQuiz,
  saveBooleanValue,
  saveSelectedQuiz,
} from "../../hooks/local";
import { get, includes, isEmpty, map } from "lodash";
import { Container } from "../layout/Container";
import { Trashcan } from "../icons/Trashcan";
import { Export } from "../icons/Export";
import { Back } from "../icons/Back";
import { useTranslations } from "../../hooks/translations";
import { getNameValueString } from "../../utils/quizes";
import { Load } from "../icons/Load";

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
  width: ${(props) => (props?.large ? "100%" : "150px")};

  @media (min-width: 700px) {
    width: ${(props) => (props?.large ? "350px" : "150px")};
  }
`;

const ButtonElement = styled(Button)`
  flex: 1;
  text-align: center;
`;

interface QuizLoadProps {
  onBack: () => void;
  fileQuizes: QuizInfo[];
  serverQuizes: QuizInfo[];
  cdnQuizes: CdnQuizInfo[];
  isApp: boolean;
}

export const QuizLoad: Component<QuizLoadProps> = (props) => {
  const [localQuizes, setLocalQuizes] = createSignal<QuizInfo[]>([]);
  const [customQuizes, setCustomQuizes] = createSignal<CustomQuizInfo[]>([]);
  const [selectedQuizes, setSelectedQuizes] = createSignal<SelectedQuizes>();
  const [serverUrl, setServerUrl] = createSignal("");
  const [useServerUrl, setUseServerUrl] = createSignal(false);
  const { getTranslation } = useTranslations();

  onMount(() => {
    const localQuizes = getLocalQuizes();
    setLocalQuizes(localQuizes);
    const customQuizes = getCustomQuizes();
    setCustomQuizes(customQuizes);
    const selectedQuizes = getSelectedQuizes();
    setSelectedQuizes(selectedQuizes);
    const useServer = getBooleanValue("kvizolamma/useserver");
    setUseServerUrl(useServer);
    const url = getStringValue("kvizolamma/serverurl");
    setServerUrl(url);
  });

  const getSelectedChecked = (selectedQuizes: SelectedQuizes, value: string, type: string) => {
    const selectedLocalQuizes = get(selectedQuizes, type) || [];
    return includes(selectedLocalQuizes, value);
  };

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
        <Show when={!isEmpty(selectedQuizes())}>
          <FormControl fullWidth margin="normal" disabled={useServerUrl()}>
            <InputLabel>{getTranslation("cdn")}</InputLabel>
            <Select>
              {map(props.cdnQuizes, (values: CdnQuizInfo) => (
                <MenuItemStyled>
                  <MenuTitle>{values.name}</MenuTitle>
                  <ButtonsContainer large={false}>
                    <FormControlLabel
                      sx={{ width: "100%" }}
                      control={
                        <Checkbox
                          checked={getSelectedChecked(
                            selectedQuizes() as SelectedQuizes,
                            getNameValueString(values.name, values.path),
                            "cdn"
                          )}
                          onChange={() => {}}
                        />
                      }
                      label={getTranslation("select")}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const checked = !getSelectedChecked(
                          selectedQuizes() as SelectedQuizes,
                          getNameValueString(values.name, values.path),
                          "cdn"
                        );

                        if (checked) {
                          const output = saveSelectedQuiz(
                            getNameValueString(values.name, values.path),
                            "cdn"
                          );
                          setSelectedQuizes(output);
                        } else {
                          const output = removeSelectedQuiz(
                            getNameValueString(values.name, values.path),
                            "cdn"
                          );
                          setSelectedQuizes(output);
                        }
                      }}
                    />
                  </ButtonsContainer>
                </MenuItemStyled>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" disabled={useServerUrl()}>
            <InputLabel>{getTranslation("custom_quizes")}</InputLabel>
            <Select value={""} onChange={() => {}}>
              {map(customQuizes(), (values: CustomQuizInfo) => (
                <MenuItemStyled>
                  <MenuTitle>{values.name}</MenuTitle>
                  <ButtonsContainer large={true}>
                    <FormControlLabel
                      sx={{ width: "100%" }}
                      control={
                        <Checkbox
                          checked={getSelectedChecked(
                            selectedQuizes() as SelectedQuizes,
                            getNameValueString(values.name, values.url),
                            "custom"
                          )}
                          onChange={() => {}}
                        />
                      }
                      label={getTranslation("select")}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const checked = !getSelectedChecked(
                          selectedQuizes() as SelectedQuizes,
                          getNameValueString(values.name, values.url),
                          "custom"
                        );

                        if (checked) {
                          const output = saveSelectedQuiz(
                            getNameValueString(values.name, values.url),
                            "custom"
                          );
                          setSelectedQuizes(output);
                        } else {
                          const output = removeSelectedQuiz(
                            getNameValueString(values.name, values.url),
                            "custom"
                          );
                          setSelectedQuizes(output);
                        }
                      }}
                    />
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
          <FormControl fullWidth margin="normal" disabled={useServerUrl()}>
            <InputLabel>{getTranslation("local_storage")}</InputLabel>
            <Select value={""} onChange={() => {}}>
              {map(localQuizes(), (values: QuizInfo) => (
                <MenuItemStyled>
                  <MenuTitle>{values.name}</MenuTitle>
                  <ButtonsContainer large={true}>
                    <FormControlLabel
                      sx={{ width: "100%" }}
                      control={
                        <Checkbox
                          checked={getSelectedChecked(
                            selectedQuizes() as SelectedQuizes,
                            values.name,
                            "local"
                          )}
                          onChange={() => {}}
                        />
                      }
                      label={getTranslation("select")}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const checked = !getSelectedChecked(
                          selectedQuizes() as SelectedQuizes,
                          values.name,
                          "local"
                        );

                        if (checked) {
                          const output = saveSelectedQuiz(values.name, "local");
                          setSelectedQuizes(output);
                        } else {
                          const output = removeSelectedQuiz(values.name, "local");
                          setSelectedQuizes(output);
                        }
                      }}
                    />
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
          {props.isApp && (
            <FormControl fullWidth margin="normal" disabled={useServerUrl()}>
              <InputLabel>{getTranslation("disk")}</InputLabel>
              <Select value={""} onChange={() => {}}>
                {map(props.fileQuizes, (values: QuizInfo) => (
                  <MenuItemStyled>
                    <MenuTitle>{values.name}</MenuTitle>
                    <ButtonsContainer large={true}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={getSelectedChecked(
                              selectedQuizes() as SelectedQuizes,
                              values.name,
                              "file"
                            )}
                            onChange={() => {}}
                          />
                        }
                        label={getTranslation("select")}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const checked = !getSelectedChecked(
                            selectedQuizes() as SelectedQuizes,
                            values.name,
                            "file"
                          );

                          if (checked) {
                            const output = saveSelectedQuiz(values.name, "file");
                            setSelectedQuizes(output);
                          } else {
                            const output = removeSelectedQuiz(values.name, "file");
                            setSelectedQuizes(output);
                          }
                        }}
                      />
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
                          emit("add_to_server_quiz", values.name);
                        }}
                        variant="contained"
                        color="info"
                      >
                        <Load />
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
          {props.isApp && (
            <FormControl fullWidth margin="normal" disabled={useServerUrl()}>
              <InputLabel>{getTranslation("server")}</InputLabel>
              <Select value={""} onChange={() => {}}>
                {map(props.serverQuizes, (values: QuizInfo) => (
                  <MenuItemStyled>
                    <MenuTitle>{values.name}</MenuTitle>
                    <ButtonsContainer large={false}>
                      <ButtonElement
                        onClick={() => {
                          emit("remove_server_quiz", values.name);
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
          <FormControlLabel
            disabled={isEmpty(serverUrl())}
            control={
              <Checkbox
                checked={useServerUrl()}
                onChange={(event: any) => {
                  const checked = !event.target.checked;
                  setUseServerUrl(checked);
                  saveBooleanValue("kvizolamma/useserver", checked);
                }}
              />
            }
            label={getTranslation("use_server_url")}
          />
        </Show>
      </Box>
      <Button onClick={props.onBack} variant="contained" color="info">
        <Back />
      </Button>
    </Container>
  );
};
