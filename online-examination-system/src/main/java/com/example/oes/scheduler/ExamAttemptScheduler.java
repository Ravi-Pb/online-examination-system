package com.example.oes.scheduler;

import com.example.oes.entity.ExamAttempt;
import com.example.oes.repository.ExamAttemptRepository;
import com.example.oes.service.ExamAttemptService;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ExamAttemptScheduler {

    private final ExamAttemptRepository examAttemptRepository;
    private final ExamAttemptService examAttemptService;

    public ExamAttemptScheduler(
            ExamAttemptRepository examAttemptRepository,
            ExamAttemptService examAttemptService) {

        this.examAttemptRepository = examAttemptRepository;
        this.examAttemptService = examAttemptService;
    }

    @Scheduled(fixedRate = 30000)
    @Transactional
    public void autoSubmitExpiredAttempts() {

        List<ExamAttempt> attempts =
                examAttemptRepository
                        .findByAttemptStatus("IN_PROGRESS");

        LocalDateTime now = LocalDateTime.now();

        for (ExamAttempt attempt : attempts) {

            LocalDateTime deadline =
                    attempt.getStartedAt()
                            .plusMinutes(
                                    attempt.getExam()
                                            .getDurationMinutes()
                                            .longValue()
                            );

            if (attempt.getExam().getEndAt() != null
                    && attempt.getExam()
                    .getEndAt()
                    .isBefore(deadline)) {

                deadline =
                        attempt.getExam().getEndAt();
            }

            if (now.isAfter(deadline)) {

                examAttemptService
                        .autoSubmitExpiredAttempt(
                                attempt.getAttemptId()
                        );
            }
        }
    }
}