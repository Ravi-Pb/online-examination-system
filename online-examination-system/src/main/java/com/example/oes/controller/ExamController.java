package com.example.oes.controller;

import com.example.oes.dto.ExamRequest;
import com.example.oes.dto.ExamResponse;
import com.example.oes.dto.ExamUpdateRequest;
import com.example.oes.entity.Exam;
import com.example.oes.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping
    public ExamResponse createExam(
            @Valid @RequestBody ExamRequest request) {

        return examService.createExam(request);
    }
    @GetMapping
    public List<ExamResponse> getAllExams() {
        return examService.getAllExams();
    }
    @GetMapping("/{examId}")
    public ExamResponse getExamById(@PathVariable Long examId) {
        return examService.getExamById(examId);
    }
    @PutMapping("/{examId}")
    public ExamResponse updateExam(
            @PathVariable Long examId,
            @Valid @RequestBody ExamUpdateRequest request) {

        return examService.updateExam(examId, request);
    }
    @DeleteMapping("/{examId}")
    public void deleteExam(@PathVariable Long examId) {

        examService.deleteExam(examId);
    }
    @PatchMapping("/{examId}/publish")
    public ExamResponse publishExam(@PathVariable Long examId) {

        return examService.publishExam(examId);
    }
    @GetMapping("/my")
    public List<ExamResponse> getMyExams() {
        return examService.getMyExams();
    }
}