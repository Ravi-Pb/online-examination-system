package com.example.oes.dto;

import java.time.LocalDateTime;

public class AttemptHistoryResponse {

    private Long attemptId;
    private Long examId;
    private String examTitle;
    private Integer attemptNumber;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private String attemptStatus;

    public AttemptHistoryResponse(
            Long attemptId,
            Long examId,
            String examTitle,
            Integer attemptNumber,
            LocalDateTime startedAt,
            LocalDateTime submittedAt,
            String attemptStatus) {

        this.attemptId = attemptId;
        this.examId = examId;
        this.examTitle = examTitle;
        this.attemptNumber = attemptNumber;
        this.startedAt = startedAt;
        this.submittedAt = submittedAt;
        this.attemptStatus = attemptStatus;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public Long getExamId() {
        return examId;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public String getAttemptStatus() {
        return attemptStatus;
    }
}