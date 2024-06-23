import { Component, For } from "solid-js";
import { styled } from "solid-styled-components";
import { Typography, Button, Card, CardContent } from "@suid/material";
import { QuizQuestionResponse } from "../../types";

interface QuizSummaryProps {
  responses: QuizQuestionResponse[];
  totalPoints: number;
  onRestart: () => void;
}

const SummaryCard = styled(Card)`
  margin-top: 20px;
`;

const SummaryContent = styled(CardContent)`
  padding: 24px;
`;

const SummaryTable = styled("table")`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const SummaryTableCell = styled("td")`
  border: 1px solid #ddd;
  padding: 8px;
`;

const SummaryTableHeaderCell = styled("th")`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
`;

export const QuizSummary: Component<QuizSummaryProps> = (props) => {
  return (
    <SummaryCard>
      <SummaryContent>
        <Typography variant="h4" gutterBottom>
          Quiz Summary
        </Typography>
        <Typography variant="h6" gutterBottom>
          Total Points: {props.totalPoints}
        </Typography>
        <SummaryTable>
          <thead>
            <tr>
              <SummaryTableHeaderCell>Topic</SummaryTableHeaderCell>
              <SummaryTableHeaderCell>Question</SummaryTableHeaderCell>
              <SummaryTableHeaderCell>Your Answer</SummaryTableHeaderCell>
              <SummaryTableHeaderCell>Correct Answer</SummaryTableHeaderCell>
              <SummaryTableHeaderCell>Points</SummaryTableHeaderCell>
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
        <Button onClick={props.onRestart} variant="contained" color="primary">
          Retry Quiz
        </Button>
      </SummaryContent>
    </SummaryCard>
  );
};
