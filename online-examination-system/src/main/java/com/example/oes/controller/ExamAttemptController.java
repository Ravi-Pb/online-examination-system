package com.example.oes.controller;

import com.example.oes.dto.*;
import com.example.oes.service.ExamAttemptService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExamAttemptController {

    private final ExamAttemptService examAttemptService;

    public ExamAttemptController(
            ExamAttemptService examAttemptService) {

        this.examAttemptService = examAttemptService;
    }

    @PostMapping("/exams/{examId}/start")
    @ResponseStatus(HttpStatus.CREATED)
    public ExamAttemptResponse startExam(
            @PathVariable Long examId) {
        System.out.println(
                ">>> START EXAM CONTROLLER REACHED: examId = "
                        + examId
        );

        return examAttemptService.startExam(examId);
    }
    @GetMapping("/attempts/{attemptId}")
    public ExamAttemptDetailsResponse getAttempt(
            @PathVariable Long attemptId) {

        return examAttemptService.getAttempt(attemptId);
    }

    @PostMapping("/attempts/{attemptId}/answers")
    public ResponseEntity<String> saveAnswer(
            @PathVariable Long attemptId,
            @RequestBody SaveAnswerRequest request) {

        System.out.println(">>> SAVE ANSWER CONTROLLER REACHED");

        examAttemptService.saveAnswer(
                attemptId,
                request
        );

        return ResponseEntity.ok(
                "Answer saved successfully"
        );
    }
    @PostMapping("/attempts/{attemptId}/submit")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void submitExam(
            @PathVariable Long attemptId) {

        examAttemptService.submitExam(attemptId);
    }
    @GetMapping("/attempts/{attemptId}/result")
    public ResultResponse getResult(
            @PathVariable Long attemptId) {

        return examAttemptService.getResult(attemptId);
    }
    @GetMapping("/attempts/my")
    public List<AttemptHistoryResponse> getMyAttempts() {

        return examAttemptService.getMyAttempts();
    }
    @GetMapping("/exams/{examId}/active-attempt")
    public ActiveAttemptResponse getActiveAttempt(
            @PathVariable Long examId) {

        return examAttemptService.getActiveAttempt(examId);
    }
    @GetMapping("/attempts/{attemptId}/questions")
    public List<ExamQuestionResponse> getExamQuestions(
            @PathVariable Long attemptId) {

        return examAttemptService.getExamQuestions(
                attemptId
        );
    }
    @GetMapping("/attempts/{attemptId}/review")
    public List<AnswerReviewResponse> getAnswerReview(
            @PathVariable Long attemptId) {

        return examAttemptService.getAnswerReview(
                attemptId
        );
    }


}