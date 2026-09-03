package com.example.oes.controller;

import com.example.oes.dto.QuestionRequest;
import com.example.oes.dto.QuestionResponse;
import com.example.oes.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // Create a question with its options
    @PostMapping("/exams/{examId}/questions")
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionResponse createQuestion(
            @PathVariable Long examId,
            @Valid @RequestBody QuestionRequest request) {

        return questionService.createQuestion(
                examId,
                request
        );
    }

    // Get all questions belonging to an exam
    @GetMapping("/exams/{examId}/questions")
    public List<QuestionResponse> getQuestionsByExam(
            @PathVariable Long examId) {

        return questionService.getQuestionsByExam(examId);
    }

    // Get a single question
    @GetMapping("/questions/{questionId}")
    public QuestionResponse getQuestionById(
            @PathVariable Long questionId) {

        return questionService.getQuestionById(questionId);
    }
    @PutMapping("/questions/{questionId}")
    public QuestionResponse updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionRequest request) {

        return questionService.updateQuestion(
                questionId,
                request
        );
    }
    @DeleteMapping("/questions/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuestion(
            @PathVariable Long questionId) {

        questionService.deleteQuestion(questionId);
    }
    @GetMapping("/questions")
    public List<QuestionResponse> getQuestionsForTeacher() {

        return questionService.getQuestionsForCurrentTeacher();
    }

}