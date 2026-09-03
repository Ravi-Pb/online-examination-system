package com.example.oes.dto;

public class OptionResponse {

    private Long optionId;
    private String optionLabel;
    private String optionText;
    private Integer optionOrder;

    public OptionResponse() {
    }

    public OptionResponse(
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

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public String getOptionLabel() {
        return optionLabel;
    }

    public void setOptionLabel(String optionLabel) {
        this.optionLabel = optionLabel;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Integer getOptionOrder() {
        return optionOrder;
    }

    public void setOptionOrder(Integer optionOrder) {
        this.optionOrder = optionOrder;
    }
}