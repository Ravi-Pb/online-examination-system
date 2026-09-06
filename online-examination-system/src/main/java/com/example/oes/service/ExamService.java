package com.example.oes.service;

import com.example.oes.dto.ExamRequest;
import com.example.oes.dto.ExamResponse;
import com.example.oes.dto.ExamUpdateRequest;
import com.example.oes.entity.Exam;
import com.example.oes.entity.Subject;
import com.example.oes.entity.User;
import com.example.oes.exception.ResourceNotFoundException;
import com.example.oes.repository.ExamRepository;
import com.example.oes.repository.SubjectRepository;
import com.example.oes.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public ExamService(
            ExamRepository examRepository,
            SubjectRepository subjectRepository,
            UserRepository userRepository) {

        this.examRepository = examRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public ExamResponse createExam(ExamRequest request) {

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subject not found"
                        ));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        ));

        Exam exam = new Exam();

        exam.setTitle(request.getTitle());
        exam.setSubject(subject);
        exam.setExamDescription(request.getExamDescription());
        exam.setDurationMinutes(request.getDurationMinutes());
        exam.setStartAt(request.getStartAt());
        exam.setEndAt(request.getEndAt());

        exam.setExamStatus("DRAFT");

        exam.setCreatedBy(user);

        Exam savedExam = examRepository.save(exam);
        return new ExamResponse(
                savedExam.getExamId(),
                savedExam.getTitle(),
                savedExam.getSubject().getSubjectId(),
                savedExam.getSubject().getSubjectCode(),
                savedExam.getSubject().getSubjectName(),
                savedExam.getExamDescription(),
                savedExam.getDurationMinutes(),
                savedExam.getStartAt(),
                savedExam.getEndAt(),
                savedExam.getExamStatus(),
                savedExam.getCreatedBy().getUserId(),
                savedExam.getCreatedAt(),
                savedExam.getUpdatedAt()
        );
    }
    public List<ExamResponse> getAllExams() {

        return examRepository.findAll()
                .stream()
                .map(exam -> new ExamResponse(
                        exam.getExamId(),
                        exam.getTitle(),
                        exam.getSubject().getSubjectId(),
                        exam.getSubject().getSubjectCode(),
                        exam.getSubject().getSubjectName(),
                        exam.getExamDescription(),
                        exam.getDurationMinutes(),
                        exam.getStartAt(),
                        exam.getEndAt(),
                        exam.getExamStatus(),
                        exam.getCreatedBy().getUserId(),
                        exam.getCreatedAt(),
                        exam.getUpdatedAt()
                ))
                .toList();
    }
    public ExamResponse getExamById(Long examId) {

//        Exam exam = examRepository.findById(examId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Exam not found with id: " + examId
//                        ));
        Exam exam = getExamOwnedByCurrentTeacher(examId);

        return new ExamResponse(
                exam.getExamId(),
                exam.getTitle(),
                exam.getSubject().getSubjectId(),
                exam.getSubject().getSubjectCode(),
                exam.getSubject().getSubjectName(),
                exam.getExamDescription(),
                exam.getDurationMinutes(),
                exam.getStartAt(),
                exam.getEndAt(),
                exam.getExamStatus(),
                exam.getCreatedBy().getUserId(),
                exam.getCreatedAt(),
                exam.getUpdatedAt()
        );
    }
    public ExamResponse updateExam(
            Long examId,
            ExamUpdateRequest request) {

//        Exam exam = examRepository.findById(examId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Exam not found with id: " + examId
//                        ));
        Exam exam = getExamOwnedByCurrentTeacher(examId);

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subject not found with id: "
                                        + request.getSubjectId()
                        ));

        exam.setTitle(request.getTitle());
        exam.setSubject(subject);
        exam.setExamDescription(request.getExamDescription());
        exam.setDurationMinutes(request.getDurationMinutes());
        exam.setStartAt(request.getStartAt());
        exam.setEndAt(request.getEndAt());

        Exam updatedExam = examRepository.save(exam);

        return new ExamResponse(
                updatedExam.getExamId(),
                updatedExam.getTitle(),
                updatedExam.getSubject().getSubjectId(),
                updatedExam.getSubject().getSubjectCode(),
                updatedExam.getSubject().getSubjectName(),
                updatedExam.getExamDescription(),
                updatedExam.getDurationMinutes(),
                updatedExam.getStartAt(),
                updatedExam.getEndAt(),
                updatedExam.getExamStatus(),
                updatedExam.getCreatedBy().getUserId(),
                updatedExam.getCreatedAt(),
                updatedExam.getUpdatedAt()
        );
    }
    public void deleteExam(Long examId) {

//        Exam exam = examRepository.findById(examId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Exam not found with id: " + examId
//                        ));
        Exam exam = getExamOwnedByCurrentTeacher(examId);

        examRepository.delete(exam);
    }

    public ExamResponse publishExam(Long examId) {

//        Exam exam = examRepository.findById(examId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Exam not found with id: " + examId
//                        ));
        Exam exam = getExamOwnedByCurrentTeacher(examId);

        if ("PUBLISHED".equals(exam.getExamStatus())) {
            throw new IllegalStateException(
                    "Exam is already published"
            );
        }

        exam.setExamStatus("PUBLISHED");

        Exam publishedExam = examRepository.save(exam);

        return new ExamResponse(
                publishedExam.getExamId(),
                publishedExam.getTitle(),
                publishedExam.getSubject().getSubjectId(),
                publishedExam.getSubject().getSubjectCode(),
                publishedExam.getSubject().getSubjectName(),
                publishedExam.getExamDescription(),
                publishedExam.getDurationMinutes(),
                publishedExam.getStartAt(),
                publishedExam.getEndAt(),
                publishedExam.getExamStatus(),
                publishedExam.getCreatedBy().getUserId(),
                publishedExam.getCreatedAt(),
                publishedExam.getUpdatedAt()
        );
    }
    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        ));
    }
    private Exam getExamOwnedByCurrentTeacher(Long examId) {

        User user = getAuthenticatedUser();

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id: " + examId
                        ));

        if (!exam.getCreatedBy().getUserId()
                .equals(user.getUserId())) {

            throw new IllegalStateException(
                    "You are not allowed to access this exam"
            );
        }

        return exam;
    }

    public List<ExamResponse> getMyExams() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        ));

        if (!"TEACHER".equalsIgnoreCase(teacher.getUserRole())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Only teachers can access their exams"
            );
        }

        return examRepository.findByCreatedBy(teacher)
                .stream()
                .map(exam -> new ExamResponse(
                        exam.getExamId(),
                        exam.getTitle(),
                        exam.getSubject().getSubjectId(),
                        exam.getSubject().getSubjectCode(),
                        exam.getSubject().getSubjectName(),
                        exam.getExamDescription(),
                        exam.getDurationMinutes(),
                        exam.getStartAt(),
                        exam.getEndAt(),
                        exam.getExamStatus(),
                        exam.getCreatedBy().getUserId(),
                        exam.getCreatedAt(),
                        exam.getUpdatedAt()
                ))
                .toList();
    }
}