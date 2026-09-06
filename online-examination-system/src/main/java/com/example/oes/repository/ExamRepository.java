package com.example.oes.repository;

import com.example.oes.entity.Exam;
import com.example.oes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findByCreatedBy(User user);

}