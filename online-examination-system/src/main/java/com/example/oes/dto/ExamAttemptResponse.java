package com.example.oes.dto;

import com.example.oes.entity.ExamAttempt;
import java.util.Optional;

import java.time.LocalDateTime;

public class ExamAttemptResponse {

    private Long attemptId;
    private Long examId;
    private Integer attemptNumber;
    private LocalDateTime startedAt;
    private String attemptStatus;

    public ExamAttemptResponse(
            Long attemptId,
            Long examId,
            Integer attemptNumber,
            LocalDateTime startedAt,
            String attemptStatus) {

        this.attemptId = attemptId;
        this.examId = examId;
        this.attemptNumber = attemptNumber;
        this.startedAt = startedAt;
        this.attemptStatus = attemptStatus;
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
}