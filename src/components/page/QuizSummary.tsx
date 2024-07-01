import { Component, For } from "solid-js";
import { styled } from "solid-styled-components";
import { Typography, Button } from "@suid/material";
import { QuizQuestionResponse } from "../../types";

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
  return (
    <SummaryCard>
      <Header>
        <Typography variant="h4" gutterBottom>
          Quiz Summary
        </Typography>
        <Typography variant="h6" gutterBottom>
          Total Points: {props.totalPoints}
        </Typography>
        <Button onClick={props.onSubmit} variant="contained" color="primary">
          Finish
        </Button>
      </Header>
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
    </SummaryCard>
  );
};
