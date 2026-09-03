package com.example.oes.repository;

import com.example.oes.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByExamExamIdOrderByQuestionOrderAsc(Long examId);

    boolean existsByExamExamIdAndQuestionOrder(
            Long examId,
            Integer questionOrder
    );
    List<Question> findByExamCreatedByUserIdOrderByExamExamIdAscQuestionOrderAsc(
            Long userId
    );



}