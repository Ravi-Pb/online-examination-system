package com.example.oes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class OptionRequest {

    @NotBlank(message = "Option label is required")
    @Size(max = 10, message = "Option label must not exceed 10 characters")
    private String optionLabel;

    @NotBlank(message = "Option text is required")
    @Size(max = 500, message = "Option text must not exceed 500 characters")
    private String optionText;

    @NotNull(message = "Correct status is required")
    private Boolean correct;

    @NotNull(message = "Option order is required")
    @jakarta.validation.constraints.Positive(
            message = "Option order must be greater than 0"
    )
    private Integer optionOrder;

    public OptionRequest() {
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

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public Integer getOptionOrder() {
        return optionOrder;
    }

    public void setOptionOrder(Integer optionOrder) {
        this.optionOrder = optionOrder;
    }
}