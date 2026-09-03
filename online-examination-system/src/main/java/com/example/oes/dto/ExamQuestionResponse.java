package com.example.oes.dto;

import java.math.BigDecimal;
import java.util.List;

public class ExamQuestionResponse {

    private Long questionId;
    private String questionText;
    private BigDecimal marks;
    private Integer questionOrder;
    private List<ExamOptionResponse> options;

    private Long selectedOptionId;

    public ExamQuestionResponse(
            Long questionId,
            String questionText,
            BigDecimal marks,
            Integer questionOrder,
            List<ExamOptionResponse> options,
            Long selectedOptionId) {

        this.questionId = questionId;
        this.questionText = questionText;
        this.marks = marks;
        this.questionOrder = questionOrder;
        this.options = options;
        this.selectedOptionId = selectedOptionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public BigDecimal getMarks() {
        return marks;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public List<ExamOptionResponse> getOptions() {
        return options;
    }

    public Long getSelectedOptionId() {
        return selectedOptionId;
    }
}