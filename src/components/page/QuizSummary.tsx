import { Component, For } from "solid-js";
import { styled } from "solid-styled-components";
import { Typography, Button } from "@suid/material";
import { QuizQuestionResponse } from "../../types";
import { useTranslations } from "../../hooks/translations";

interface QuizSummaryProps {
  responses: QuizQuestionResponse[];
  totalPoints: number;
  onSubmit: () => void;
}

const SummaryCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SummaryTable = styled("table")`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const SummaryTableCell = styled("td")`
  border: 1px solid ${(props) => props?.theme?.colors.border};
  padding: 8px;
`;

const SummaryTableHeaderCell = styled("th")`
  border: 1px solid ${(props) => props?.theme?.colors.border}
  padding: 8px;
  background-color: ${(props) => props?.theme?.colors.lightBackground};
`;

export const QuizSummary: Component<QuizSummaryProps> = (props) => {
  const { getTranslation } = useTranslations();

  return (
    <SummaryCard>
      <Header>
        <Typography variant="h4" gutterBottom>
          {getTranslation("summary")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {getTranslation("points")} {props.totalPoints}
        </Typography>
        <Button onClick={props.onSubmit} variant="contained" color="primary">
          {getTranslation("finish")}
        </Button>
      </Header>
      <SummaryTable>
        <thead>
          <tr>
            <SummaryTableHeaderCell>{getTranslation("topic")}</SummaryTableHeaderCell>
            <SummaryTableHeaderCell>{getTranslation("question")}</SummaryTableHeaderCell>
            <SummaryTableHeaderCell>{getTranslation("answer")}r</SummaryTableHeaderCell>
            <SummaryTableHeaderCell>{getTranslation("correct_answer")}</SummaryTableHeaderCell>
            <SummaryTableHeaderCell>{getTranslation("points")}</SummaryTableHeaderCell>
          </tr>
        </thead>
        <tbody>
          <For each={props.responses}>
            {(response) => (
              <tr>
                <SummaryTableCell>{response.topic}</SummaryTableCell>
                <SummaryTableCell>{response.question}</SummaryTableCell>
                <SummaryTableCell>{response.userAnswer}</SummaryTableCell>
                <SummaryTableCell>{response.correctAnswer}</SummaryTableCell>
                <SummaryTableCell>{response.points}</SummaryTableCell>
              </tr>
            )}
          </For>
        </tbody>
      </SummaryTable>
    </SummaryCard>
  );
};
