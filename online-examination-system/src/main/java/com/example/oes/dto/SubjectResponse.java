package com.example.oes.dto;

import java.time.LocalDateTime;

public class SubjectResponse {

    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SubjectResponse(
            Long subjectId,
            String subjectCode,
            String subjectName,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.subjectId = subjectId;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}