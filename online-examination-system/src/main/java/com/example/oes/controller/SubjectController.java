package com.example.oes.controller;

import com.example.oes.dto.SubjectRequest;
import com.example.oes.dto.SubjectResponse;
import com.example.oes.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(
            SubjectService subjectService) {

        this.subjectService = subjectService;
    }


    // ========================================
    // CREATE SUBJECT
    // ========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubjectResponse createSubject(
            @Valid @RequestBody SubjectRequest request) {

        return subjectService.createSubject(request);
    }


    // ========================================
    // GET ALL SUBJECTS
    // ========================================

    @GetMapping
    public List<SubjectResponse> getAllSubjects() {

        return subjectService.getAllSubjects();
    }


    // ========================================
    // GET SUBJECT BY ID
    // ========================================

    @GetMapping("/{subjectId}")
    public SubjectResponse getSubjectById(
            @PathVariable Long subjectId) {

        return subjectService.getSubjectById(subjectId);
    }


    // ========================================
    // UPDATE SUBJECT
    // ========================================

    @PutMapping("/{subjectId}")
    public SubjectResponse updateSubject(
            @PathVariable Long subjectId,
            @Valid @RequestBody SubjectRequest request) {

        return subjectService.updateSubject(
                subjectId,
                request
        );
    }


    // ========================================
    // DELETE SUBJECT
    // ========================================

    @DeleteMapping("/{subjectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubject(
            @PathVariable Long subjectId) {

        subjectService.deleteSubject(subjectId);
    }
}