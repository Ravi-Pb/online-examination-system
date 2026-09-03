package com.example.oes.repository;

import com.example.oes.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnswerRepository
        extends JpaRepository<Answer, Long> {

    List<Answer> findByAttemptAttemptId(
            Long attemptId
    );

    Optional<Answer> findByAttemptAttemptIdAndQuestionQuestionId(
            Long attemptId,
            Long questionId
    );

    boolean existsByAttemptAttemptIdAndQuestionQuestionId(
            Long attemptId,
            Long questionId
    );

    void deleteByAttemptAttemptId(
            Long attemptId
    );

}