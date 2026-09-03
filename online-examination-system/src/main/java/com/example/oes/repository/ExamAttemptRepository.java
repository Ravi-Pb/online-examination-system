package com.example.oes.repository;

import com.example.oes.entity.ExamAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamAttemptRepository
        extends JpaRepository<ExamAttempt, Long> {

    List<ExamAttempt> findByUserUserIdAndExamExamIdOrderByAttemptNumberDesc(
            Long userId,
            Long examId
    );

    Optional<ExamAttempt> findByUserUserIdAndExamExamIdAndAttemptNumber(
            Long userId,
            Long examId,
            Integer attemptNumber
    );

    Optional<ExamAttempt> findByAttemptIdAndUserUserId(
            Long attemptId,
            Long userId
    );

    int countByUserUserIdAndExamExamId(
            Long userId,
            Long examId
    );
    List<ExamAttempt> findByUserUserIdOrderByStartedAtDesc(
            Long userId
    );
    Optional<ExamAttempt> findByUserUserIdAndExamExamIdAndAttemptStatus(
            Long userId,
            Long examId,
            String attemptStatus
    );
    List<ExamAttempt> findByAttemptStatus(
            String attemptStatus
    );
}