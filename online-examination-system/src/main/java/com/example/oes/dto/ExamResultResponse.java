package com.example.oes.dto;

import java.math.BigDecimal;

public class ExamResultResponse {

    private Long attemptId;
    private Long examId;
    private String examTitle;

    private BigDecimal totalMarks;
    private BigDecimal obtainedMarks;
    private BigDecimal percentage;

    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer unanswered;

    private String resultStatus;

    public ExamResultResponse(
            Long attemptId,
            Long examId,
            String examTitle,
            BigDecimal totalMarks,
            BigDecimal obtainedMarks,
            BigDecimal percentage,
            Integer totalQuestions,
            Integer correctAnswers,
            Integer wrongAnswers,
            Integer unanswered,
            String resultStatus) {

        this.attemptId = attemptId;
        this.examId = examId;
        this.examTitle = examTitle;
        this.totalMarks = totalMarks;
        this.obtainedMarks = obtainedMarks;
        this.percentage = percentage;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
        this.unanswered = unanswered;
        this.resultStatus = resultStatus;
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

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public Integer getWrongAnswers() {
        return wrongAnswers;
    }

    public Integer getUnanswered() {
        return unanswered;
    }

    public String getResultStatus() {
        return resultStatus;
    }
}