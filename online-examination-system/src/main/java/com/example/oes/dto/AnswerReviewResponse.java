package com.example.oes.dto;

import java.math.BigDecimal;

public class AnswerReviewResponse {

    private Long questionId;
    private String questionText;
    private Integer questionOrder;

    private String selectedOptionLabel;
    private String selectedOptionText;

    private String correctOptionLabel;
    private String correctOptionText;

    private Boolean correct;
    private BigDecimal marksObtained;
    private BigDecimal questionMarks;

    public AnswerReviewResponse(
            Long questionId,
            String questionText,
            Integer questionOrder,
            String selectedOptionLabel,
            String selectedOptionText,
            String correctOptionLabel,
            String correctOptionText,
            Boolean correct,
            BigDecimal marksObtained,
            BigDecimal questionMarks) {

        this.questionId = questionId;
        this.questionText = questionText;
        this.questionOrder = questionOrder;
        this.selectedOptionLabel = selectedOptionLabel;
        this.selectedOptionText = selectedOptionText;
        this.correctOptionLabel = correctOptionLabel;
        this.correctOptionText = correctOptionText;
        this.correct = correct;
        this.marksObtained = marksObtained;
        this.questionMarks = questionMarks;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public String getSelectedOptionLabel() {
        return selectedOptionLabel;
    }

    public String getSelectedOptionText() {
        return selectedOptionText;
    }

    public String getCorrectOptionLabel() {
        return correctOptionLabel;
    }

    public String getCorrectOptionText() {
        return correctOptionText;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public BigDecimal getMarksObtained() {
        return marksObtained;
    }

    public BigDecimal getQuestionMarks() {
        return questionMarks;
    }
}