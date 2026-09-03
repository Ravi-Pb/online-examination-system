package com.example.oes.dto;

import java.math.BigDecimal;

public class ResultResponse {

    private Long attemptId;
    private Long examId;
    private Integer attemptNumber;

    private BigDecimal totalMarks;
    private BigDecimal obtainedMarks;
    private BigDecimal percentage;

    private Integer totalQuestions;
    private Integer answeredQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;

    public ResultResponse(
            Long attemptId,
            Long examId,
            Integer attemptNumber,
            BigDecimal totalMarks,
            BigDecimal obtainedMarks,
            BigDecimal percentage,
            Integer totalQuestions,
            Integer answeredQuestions,
            Integer correctAnswers,
            Integer wrongAnswers) {

        this.attemptId = attemptId;
        this.examId = examId;
        this.attemptNumber = attemptNumber;
        this.totalMarks = totalMarks;
        this.obtainedMarks = obtainedMarks;
        this.percentage = percentage;
        this.totalQuestions = totalQuestions;
        this.answeredQuestions = answeredQuestions;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
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

    public BigDecimal getTotalMarks() {
        return totalMarks;
    }

    public BigDecimal getObtainedMarks() {
        return obtainedMarks;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Integer getAnsweredQuestions() {
        return answeredQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public Integer getWrongAnswers() {
        return wrongAnswers;
    }
}