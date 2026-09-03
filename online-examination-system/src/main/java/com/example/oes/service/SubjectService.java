package com.example.oes.service;

import com.example.oes.dto.SubjectRequest;
import com.example.oes.dto.SubjectResponse;
import com.example.oes.entity.Subject;
import com.example.oes.exception.ResourceNotFoundException;
import com.example.oes.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(
            SubjectRepository subjectRepository) {

        this.subjectRepository = subjectRepository;
    }

    // ========================================
    // CREATE SUBJECT
    // ========================================

    @Transactional
    public SubjectResponse createSubject(
            SubjectRequest request) {

        String subjectCode =
                request.getSubjectCode()
                        .trim()
                        .toUpperCase();

        // Check duplicate subject code
        if (subjectRepository
                .existsBySubjectCode(subjectCode)) {

            throw new IllegalArgumentException(
                    "Subject code already exists: "
                            + subjectCode
            );
        }

        Subject subject = new Subject();

        subject.setSubjectCode(subjectCode);

        subject.setSubjectName(
                request.getSubjectName().trim()
        );

        Subject savedSubject =
                subjectRepository.save(subject);

        return convertToResponse(savedSubject);
    }


    // ========================================
    // GET ALL SUBJECTS
    // ========================================

    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {

        return subjectRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ========================================
    // GET SUBJECT BY ID
    // ========================================

    @Transactional(readOnly = true)
    public SubjectResponse getSubjectById(
            Long subjectId) {

        Subject subject =
                subjectRepository.findById(subjectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Subject not found with id: "
                                                + subjectId
                                ));

        return convertToResponse(subject);
    }


    // ========================================
    // UPDATE SUBJECT
    // ========================================

    @Transactional
    public SubjectResponse updateSubject(
            Long subjectId,
            SubjectRequest request) {

        Subject subject =
                subjectRepository.findById(subjectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Subject not found with id: "
                                                + subjectId
                                ));

        String subjectCode =
                request.getSubjectCode()
                        .trim()
                        .toUpperCase();

        // Check whether another subject
        // already uses this code
        if (!subject.getSubjectCode()
                .equals(subjectCode)
                && subjectRepository
                .existsBySubjectCode(subjectCode)) {

            throw new IllegalArgumentException(
                    "Subject code already exists: "
                            + subjectCode
            );
        }

        subject.setSubjectCode(subjectCode);

        subject.setSubjectName(
                request.getSubjectName().trim()
        );

        Subject updatedSubject =
                subjectRepository.save(subject);

        return convertToResponse(updatedSubject);
    }


    // ========================================
    // DELETE SUBJECT
    // ========================================

    @Transactional
    public void deleteSubject(
            Long subjectId) {

        Subject subject =
                subjectRepository.findById(subjectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Subject not found with id: "
                                                + subjectId
                                ));

        subjectRepository.delete(subject);
    }


    // ========================================
    // ENTITY → RESPONSE
    // ========================================

    private SubjectResponse convertToResponse(
            Subject subject) {

        return new SubjectResponse(
                subject.getSubjectId(),
                subject.getSubjectCode(),
                subject.getSubjectName(),
                subject.getCreatedAt(),
                subject.getUpdatedAt()
        );
    }
}