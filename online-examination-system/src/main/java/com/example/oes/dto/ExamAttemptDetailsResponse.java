package com.example.oes.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ExamAttemptDetailsResponse {

    private Long attemptId;
    private Long examId;
    private Integer attemptNumber;
    private LocalDateTime startedAt;
    private String attemptStatus;
    private List<QuestionResponse> questions;

    public ExamAttemptDetailsResponse(
            Long attemptId,
            Long examId,
            Integer attemptNumber,
            LocalDateTime startedAt,
            String attemptStatus,
            List<QuestionResponse> questions) {

        this.attemptId = attemptId;
        this.examId = examId;
        this.attemptNumber = attemptNumber;
        this.startedAt = startedAt;
        this.attemptStatus = attemptStatus;
        this.questions = questions;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public Long getExamId() {
        return examId;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public String getAttemptStatus() {
        return attemptStatus;
    }

    public List<QuestionResponse> getQuestions() {
        return questions;
    }
}