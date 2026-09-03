package com.example.oes.dto;

import java.time.LocalDateTime;

public class ExamResponse {

    private Long examId;
    private String title;

    private Long subjectId;
    private String subjectCode;
    private String subjectName;

    private String examDescription;
    private Integer durationMinutes;

    private LocalDateTime startAt;
    private LocalDateTime endAt;

    private String examStatus;

    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ExamResponse() {
    }

    public ExamResponse(
            Long examId,
            String title,
            Long subjectId,
            String subjectCode,
            String subjectName,
            String examDescription,
            Integer durationMinutes,
            LocalDateTime startAt,
            LocalDateTime endAt,
            String examStatus,
            Long createdBy,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.examId = examId;
        this.title = title;
        this.subjectId = subjectId;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.examDescription = examDescription;
        this.durationMinutes = durationMinutes;
        this.startAt = startAt;
        this.endAt = endAt;
        this.examStatus = examStatus;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getExamDescription() {
        return examDescription;
    }

    public void setExamDescription(String examDescription) {
        this.examDescription = examDescription;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDateTime startAt) {
        this.startAt = startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
        this.endAt = endAt;
    }

    public String getExamStatus() {
        return examStatus;
    }

    public void setExamStatus(String examStatus) {
        this.examStatus = examStatus;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}