package com.example.oes.repository;

import com.example.oes.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OptionRepository extends JpaRepository<Option, Long> {

    List<Option> findByQuestionQuestionIdOrderByOptionOrderAsc(
            Long questionId
    );

    boolean existsByQuestionQuestionIdAndOptionOrder(
            Long questionId,
            Integer optionOrder
    );

}