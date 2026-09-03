package com.example.oes.dto;

import java.math.BigDecimal;
import java.util.List;

public class QuestionResponse {

    private Long questionId;
    private Long examId;
    private String questionText;
    private BigDecimal marks;
    private Integer questionOrder;
    private List<OptionResponse> options;

    public QuestionResponse() {
    }

    public QuestionResponse(
            Long questionId,
            Long examId,
            String questionText,
            BigDecimal marks,
            Integer questionOrder,
            List<OptionResponse> options) {

        this.questionId = questionId;
        this.examId = examId;
        this.questionText = questionText;
        this.marks = marks;
        this.questionOrder = questionOrder;
        this.options = options;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public BigDecimal getMarks() {
        return marks;
    }

    public void setMarks(BigDecimal marks) {
        this.marks = marks;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(Integer questionOrder) {
        this.questionOrder = questionOrder;
    }

    public List<OptionResponse> getOptions() {
        return options;
    }

    public void setOptions(List<OptionResponse> options) {
        this.options = options;
    }
}