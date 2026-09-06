package com.example.oes.repository;

import com.example.oes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    List<User> findByUserRole(String userRole);
    List<User> findByUserRoleIgnoreCase(String userRole);
}