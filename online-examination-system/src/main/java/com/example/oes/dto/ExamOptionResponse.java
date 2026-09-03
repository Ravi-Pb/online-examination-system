package com.example.oes.dto;

public class ExamOptionResponse {

    private Long optionId;
    private String optionLabel;
    private String optionText;
    private Integer optionOrder;

    public ExamOptionResponse(
            Long optionId,
            String optionLabel,
            String optionText,
            Integer optionOrder) {

        this.optionId = optionId;
        this.optionLabel = optionLabel;
        this.optionText = optionText;
        this.optionOrder = optionOrder;
    }

    public Long getOptionId() {
        return optionId;
    }

    public String getOptionLabel() {
        return optionLabel;
    }

    public String getOptionText() {
        return optionText;
    }

    public Integer getOptionOrder() {
        return optionOrder;
    }
}