package com.example.oes.service;

import com.example.oes.dto.*;
import com.example.oes.entity.*;
import com.example.oes.exception.ResourceNotFoundException;
import com.example.oes.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExamAttemptService {

    private final ExamAttemptRepository examAttemptRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final QuestionService questionService;
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;

    public ExamAttemptService(
            ExamAttemptRepository examAttemptRepository,
            ExamRepository examRepository,
            UserRepository userRepository,
            QuestionService questionService,
            AnswerRepository answerRepository,
            QuestionRepository questionRepository,
            OptionRepository optionRepository) {

        this.examAttemptRepository = examAttemptRepository;
        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.questionService = questionService;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
    }

    @Transactional
    public ExamAttemptResponse startExam(Long examId) {

        // 1. Get currently authenticated user
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        // 2. Find the user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        // 3. Make sure the user is a student
        if (!"STUDENT".equalsIgnoreCase(user.getUserRole())) {

            throw new IllegalArgumentException(
                    "Only students can start an exam"
            );
        }

        // 4. Find exam
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id: " + examId
                        ));

        // 5. Check exam status
        if (!"PUBLISHED".equalsIgnoreCase(
                exam.getExamStatus())) {

            throw new IllegalArgumentException(
                    "This exam is not available"
            );
        }

        // 6. Check exam time
        LocalDateTime now = LocalDateTime.now();

        if (exam.getStartAt() != null
                && now.isBefore(exam.getStartAt())) {

            throw new IllegalArgumentException(
                    "This exam has not started yet"
            );
        }

        if (exam.getEndAt() != null
                && now.isAfter(exam.getEndAt())) {

            throw new IllegalArgumentException(
                    "This exam has already ended"
            );
        }

        // 7. Check for an existing active attempt
        Optional<ExamAttempt> existingAttempt =
                examAttemptRepository
                        .findByUserUserIdAndExamExamIdAndAttemptStatus(
                                user.getUserId(),
                                examId,
                                "IN_PROGRESS"
                        );

        /*
         * If the student already has an active attempt,
         * resume that attempt instead of creating another one.
         */
        if (existingAttempt.isPresent()) {

            ExamAttempt attempt =
                    existingAttempt.get();

            System.out.println(
                    ">>> RESUMING EXISTING ATTEMPT: "
                            + attempt.getAttemptId()
            );

            return new ExamAttemptResponse(
                    attempt.getAttemptId(),
                    exam.getExamId(),
                    attempt.getAttemptNumber(),
                    attempt.getStartedAt(),
                    attempt.getAttemptStatus()
            );
        }

        // 8. Determine next attempt number
        List<ExamAttempt> previousAttempts =
                examAttemptRepository
                        .findByUserUserIdAndExamExamIdOrderByAttemptNumberDesc(
                                user.getUserId(),
                                examId
                        );

        int nextAttemptNumber;

        if (previousAttempts.isEmpty()) {

            nextAttemptNumber = 1;

        } else {

            nextAttemptNumber =
                    previousAttempts.get(0)
                            .getAttemptNumber() + 1;
        }

        // 9. Create new attempt
        ExamAttempt attempt = new ExamAttempt();

        attempt.setUser(user);
        attempt.setExam(exam);
        attempt.setAttemptNumber(nextAttemptNumber);
        attempt.setStartedAt(now);
        attempt.setAttemptStatus("IN_PROGRESS");

        // 10. Save
        ExamAttempt savedAttempt =
                examAttemptRepository.save(attempt);

        System.out.println(
                ">>> NEW ATTEMPT CREATED: "
                        + savedAttempt.getAttemptId()
        );

        // 11. Return response
        return new ExamAttemptResponse(
                savedAttempt.getAttemptId(),
                exam.getExamId(),
                savedAttempt.getAttemptNumber(),
                savedAttempt.getStartedAt(),
                savedAttempt.getAttemptStatus()
        );
    }
    @Transactional(readOnly = true)
    public ExamAttemptDetailsResponse getAttempt(
            Long attemptId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        ExamAttempt attempt =
                examAttemptRepository
                        .findByAttemptIdAndUserUserId(
                                attemptId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exam attempt not found"
                                )
                        );

        List<QuestionResponse> questions =
                questionService
                        .getQuestionsByExam(
                                attempt.getExam().getExamId()
                        );

        return new ExamAttemptDetailsResponse(
                attempt.getAttemptId(),
                attempt.getExam().getExamId(),
                attempt.getAttemptNumber(),
                attempt.getStartedAt(),
                attempt.getAttemptStatus(),
                questions
        );
    }
    @Transactional
    public void saveAnswer(

            Long attemptId,
            SaveAnswerRequest request) {
        System.out.println(">>> SAVE ANSWER SERVICE REACHED");

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        ExamAttempt attempt =
                examAttemptRepository
                        .findByAttemptIdAndUserUserId(
                                attemptId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exam attempt not found"
                                ));

        if (!"IN_PROGRESS".equalsIgnoreCase(
                attempt.getAttemptStatus())) {

            throw new IllegalArgumentException(
                    "This exam attempt is no longer active"
            );
        }

        if (LocalDateTime.now()
                .isAfter(getAttemptDeadline(attempt))) {

            throw new IllegalArgumentException(
                    "Your exam time has expired"
            );
        }

        Question question =
                questionRepository
                        .findById(request.getQuestionId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Question not found"
                                ));

        if (!question.getExam()
                .getExamId()
                .equals(attempt.getExam().getExamId())) {

            throw new IllegalArgumentException(
                    "Question does not belong to this exam"
            );
        }

        Option option =
                optionRepository
                        .findById(request.getSelectedOptionId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Option not found"
                                ));

        if (!option.getQuestion()
                .getQuestionId()
                .equals(question.getQuestionId())) {

            throw new IllegalArgumentException(
                    "Selected option does not belong to this question"
            );
        }

        Optional<Answer> existingAnswer =
                answerRepository
                        .findByAttemptAttemptIdAndQuestionQuestionId(
                                attemptId,
                                question.getQuestionId()
                        );

        Answer answer;

        if (existingAnswer.isPresent()) {

            answer = existingAnswer.get();

        } else {

            answer = new Answer();

            answer.setAttempt(attempt);
            answer.setQuestion(question);
        }

        answer.setSelectedOptionId(
                option.getOptionId()
        );

        answer.setAnsweredAt(
                LocalDateTime.now()
        );

        answerRepository.save(answer);
    }
    @Transactional
    public void submitExam(Long attemptId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        ExamAttempt attempt =
                examAttemptRepository
                        .findByAttemptIdAndUserUserId(
                                attemptId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exam attempt not found"
                                )
                        );

        if (!"IN_PROGRESS".equalsIgnoreCase(
                attempt.getAttemptStatus())) {

            throw new IllegalArgumentException(
                    "This exam attempt has already been submitted"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime deadline =
                getAttemptDeadline(attempt);

        if (now.isAfter(deadline)) {

            /*
             * The student's time has expired.
             * Submit the attempt automatically.
             */
            evaluateAndSubmit(attempt);

            return;
        }

        evaluateAndSubmit(attempt);
    }

    @Transactional(readOnly = true)
    public ResultResponse getResult(Long attemptId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        /*
         * This also makes sure that the attempt
         * belongs to the logged-in student.
         */
        ExamAttempt attempt =
                examAttemptRepository
                        .findByAttemptIdAndUserUserId(
                                attemptId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exam attempt not found"
                                )
                        );

        // Result is available only after submission
        if (!"SUBMITTED".equalsIgnoreCase(
                attempt.getAttemptStatus())) {

            throw new IllegalArgumentException(
                    "Exam has not been submitted yet"
            );
        }

        Exam exam = attempt.getExam();

        // Get all questions
        List<Question> questions =
                questionRepository
                        .findByExamExamIdOrderByQuestionOrderAsc(
                                exam.getExamId()
                        );

        // Get student's answers
        List<Answer> answers =
                answerRepository
                        .findByAttemptAttemptId(
                                attemptId
                        );

        /*
         * Total marks are calculated from the
         * questions, not from the student's answers.
         */
        BigDecimal totalMarks =
                questions.stream()
                        .map(Question::getMarks)
                        .filter(marks -> marks != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        /*
         * Obtained marks are calculated from
         * evaluated answers.
         */
        BigDecimal obtainedMarks =
                answers.stream()
                        .map(Answer::getMarksObtained)
                        .filter(marks -> marks != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        int totalQuestions = questions.size();

        int answeredQuestions =
                (int) answers.stream()
                        .filter(answer ->
                                answer.getSelectedOptionId() != null)
                        .count();

        int correctAnswers =
                (int) answers.stream()
                        .filter(answer ->
                                Boolean.TRUE.equals(
                                        answer.getCorrect()))
                        .count();

        int wrongAnswers =
                (int) answers.stream()
                        .filter(answer ->
                                answer.getSelectedOptionId() != null
                                        && Boolean.FALSE.equals(
                                        answer.getCorrect()))
                        .count();

        BigDecimal percentage = BigDecimal.ZERO;

        if (totalMarks.compareTo(BigDecimal.ZERO) > 0) {

            percentage = obtainedMarks
                    .multiply(BigDecimal.valueOf(100))
                    .divide(
                            totalMarks,
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        return new ResultResponse(
                attempt.getAttemptId(),
                exam.getExamId(),
                attempt.getAttemptNumber(),
                totalMarks,
                obtainedMarks,
                percentage,
                totalQuestions,
                answeredQuestions,
                correctAnswers,
                wrongAnswers
        );
    }
    @Transactional(readOnly = true)
    public List<AttemptHistoryResponse> getMyAttempts() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        List<ExamAttempt> attempts =
                examAttemptRepository
                        .findByUserUserIdOrderByStartedAtDesc(
                                user.getUserId()
                        );

        return attempts.stream()
                .map(attempt ->
                        new AttemptHistoryResponse(
                                attempt.getAttemptId(),
                                attempt.getExam().getExamId(),
                                attempt.getExam().getTitle(),
                                attempt.getAttemptNumber(),
                                attempt.getStartedAt(),
                                attempt.getSubmittedAt(),
                                attempt.getAttemptStatus()
                        )
                )
                .toList();
    }
    private LocalDateTime getAttemptDeadline(ExamAttempt attempt) {

        LocalDateTime deadline =
                attempt.getStartedAt()
                        .plusMinutes(
                                attempt.getExam()
                                        .getDurationMinutes()
                                        .longValue()
                        );

        LocalDateTime examEnd =
                attempt.getExam().getEndAt();

        if (examEnd != null
                && examEnd.isBefore(deadline)) {

            deadline = examEnd;
        }

        return deadline;
    }
    private void evaluateAndSubmit(ExamAttempt attempt) {

        LocalDateTime now = LocalDateTime.now();

        List<Answer> answers =
                answerRepository.findByAttemptAttemptId(
                        attempt.getAttemptId()
                );

        for (Answer answer : answers) {

            Question question = answer.getQuestion();

            Long selectedOptionId =
                    answer.getSelectedOptionId();

            if (selectedOptionId == null) {
                answer.setCorrect(false);
                answer.setMarksObtained(BigDecimal.ZERO);
                continue;
            }

            Option selectedOption =
                    optionRepository.findById(selectedOptionId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Selected option not found"
                                    ));

            if (!selectedOption.getQuestion()
                    .getQuestionId()
                    .equals(question.getQuestionId())) {

                throw new IllegalArgumentException(
                        "Selected option does not belong to the question"
                );
            }

            boolean correct =
                    Boolean.TRUE.equals(
                            selectedOption.getCorrect()
                    );

            answer.setCorrect(correct);

            if (correct) {
                answer.setMarksObtained(
                        question.getMarks()
                );
            } else {
                answer.setMarksObtained(
                        BigDecimal.ZERO
                );
            }
        }

        answerRepository.saveAll(answers);

        attempt.setAttemptStatus("SUBMITTED");
        attempt.setSubmittedAt(now);

        examAttemptRepository.save(attempt);
    }
    @Transactional
    public void autoSubmitExpiredAttempt(Long attemptId) {

        ExamAttempt attempt =
                examAttemptRepository.findById(attemptId)
                        .orElse(null);

        if (attempt == null) {
            return;
        }

        // Already submitted by the student
        if (!"IN_PROGRESS".equalsIgnoreCase(
                attempt.getAttemptStatus())) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime deadline =
                getAttemptDeadline(attempt);

        // Safety check
        if (now.isBefore(deadline)) {
            return;
        }

        evaluateAndSubmit(attempt);
    }
    @Transactional(readOnly = true)
    public ActiveAttemptResponse getActiveAttempt(Long examId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found"
                        ));

        Optional<ExamAttempt> activeAttempt =
                examAttemptRepository
                        .findByUserUserIdAndExamExamIdAndAttemptStatus(
                                user.getUserId(),
                                examId,
                                "IN_PROGRESS"
                        );

        if (activeAttempt.isEmpty()) {
            return null;
        }

        ExamAttempt attempt = activeAttempt.get();

        LocalDateTime deadline =
                getAttemptDeadline(attempt);

        return new ActiveAttemptResponse(
                attempt.getAttemptId(),
                exam.getExamId(),
                exam.getTitle(),
                attempt.getAttemptNumber(),
                attempt.getStartedAt(),
                deadline,
                attempt.getAttemptStatus()
        );
    }
    @Transactional(readOnly = true)
    public List<ExamQuestionResponse> getExamQuestions(
            Long attemptId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        ExamAttempt attempt =
                examAttemptRepository
                        .findByAttemptIdAndUserUserId(
                                attemptId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exam attempt not found"
                                )
                        );

        if (!"IN_PROGRESS".equalsIgnoreCase(
                attempt.getAttemptStatus())) {

            throw new IllegalArgumentException(
                    "This exam attempt is no longer active"
            );
        }

        // Check whether time has expired
        if (LocalDateTime.now()
                .isAfter(getAttemptDeadline(attempt))) {

            throw new IllegalArgumentException(
                    "Your exam time has expired"
            );
        }

        List<Question> questions =
                questionRepository
                        .findByExamExamIdOrderByQuestionOrderAsc(
                                attempt.getExam().getExamId()
                        );

        return questions.stream()
                .map(question -> {

                    List<Option> options =
                            optionRepository
                                    .findByQuestionQuestionIdOrderByOptionOrderAsc(
                                            question.getQuestionId()
                                    );

                    List<ExamOptionResponse> optionResponses =
                            options.stream()
                                    .map(option ->
                                            new ExamOptionResponse(
                                                    option.getOptionId(),
                                                    option.getOptionLabel(),
                                                    option.getOptionText(),
                                                    option.getOptionOrder()
                                            )
                                    )
                                    .toList();

                    Optional<Answer> existingAnswer =
                            answerRepository
                                    .findByAttemptAttemptIdAndQuestionQuestionId(
                                            attemptId,
                                            question.getQuestionId()
                                    );

                    Long selectedOptionId =
                            existingAnswer
                                    .map(Answer::getSelectedOptionId)
                                    .orElse(null);

                    return new ExamQuestionResponse(
                            question.getQuestionId(),
                            question.getQuestionText(),
                            question.getMarks(),
                            question.getQuestionOrder(),
                            optionResponses,
                            selectedOptionId
                    );
                })
                .toList();
    }
    @Transactional(readOnly = true)
    public ExamResultResponse getExamResult(Long attemptId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        ExamAttempt attempt =
                examAttemptRepository
                        .findByAttemptIdAndUserUserId(
                                attemptId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exam attempt not found"
                                ));

        if (!"SUBMITTED".equalsIgnoreCase(
                attempt.getAttemptStatus())) {

            throw new IllegalArgumentException(
                    "Exam has not been submitted yet"
            );
        }

        List<Question> questions =
                questionRepository
                        .findByExamExamIdOrderByQuestionOrderAsc(
                                attempt.getExam().getExamId()
                        );

        List<Answer> answers =
                answerRepository.findByAttemptAttemptId(
                        attemptId
                );

        BigDecimal totalMarks =
                questions.stream()
                        .map(Question::getMarks)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        BigDecimal obtainedMarks =
                answers.stream()
                        .map(answer ->
                                answer.getMarksObtained() != null
                                        ? answer.getMarksObtained()
                                        : BigDecimal.ZERO
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        int correctAnswers =
                (int) answers.stream()
                        .filter(answer ->
                                Boolean.TRUE.equals(
                                        answer.getCorrect()
                                )
                        )
                        .count();

        int answered =
                answers.stream()
                        .filter(answer ->
                                answer.getSelectedOptionId() != null
                        )
                        .mapToInt(answer -> 1)
                        .sum();

        int wrongAnswers =
                answered - correctAnswers;

        int unanswered =
                questions.size() - answered;

        BigDecimal percentage =
                BigDecimal.ZERO;

        if (totalMarks.compareTo(BigDecimal.ZERO) > 0) {

            percentage =
                    obtainedMarks
                            .multiply(BigDecimal.valueOf(100))
                            .divide(
                                    totalMarks,
                                    2,
                                    java.math.RoundingMode.HALF_UP
                            );
        }

        String resultStatus =
                percentage.compareTo(
                        BigDecimal.valueOf(40)
                ) >= 0
                        ? "PASS"
                        : "FAIL";

        return new ExamResultResponse(
                attempt.getAttemptId(),
                attempt.getExam().getExamId(),
                attempt.getExam().getTitle(),
                totalMarks,
                obtainedMarks,
                percentage,
                questions.size(),
                correctAnswers,
                wrongAnswers,
                unanswered,
                resultStatus
        );
    }
    @Transactional(readOnly = true)
    public List<AnswerReviewResponse> getAnswerReview(
            Long attemptId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        ExamAttempt attempt =
                examAttemptRepository
                        .findByAttemptIdAndUserUserId(
                                attemptId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Exam attempt not found"
                                )
                        );

        if (!"SUBMITTED".equalsIgnoreCase(
                attempt.getAttemptStatus())) {

            throw new IllegalArgumentException(
                    "Answer review is available only after submission"
            );
        }

        List<Question> questions =
                questionRepository
                        .findByExamExamIdOrderByQuestionOrderAsc(
                                attempt.getExam().getExamId()
                        );

        return questions.stream()
                .map(question -> {

                    Optional<Answer> answerOptional =
                            answerRepository
                                    .findByAttemptAttemptIdAndQuestionQuestionId(
                                            attemptId,
                                            question.getQuestionId()
                                    );

                    String selectedOptionLabel = null;
                    String selectedOptionText = null;

                    Boolean correct = false;

                    BigDecimal marksObtained =
                            BigDecimal.ZERO;

                    if (answerOptional.isPresent()) {

                        Answer answer =
                                answerOptional.get();

                        if (answer.getSelectedOptionId() != null) {

                            Option selectedOption =
                                    optionRepository
                                            .findById(
                                                    answer.getSelectedOptionId()
                                            )
                                            .orElse(null);

                            if (selectedOption != null) {

                                selectedOptionLabel =
                                        selectedOption.getOptionLabel();

                                selectedOptionText =
                                        selectedOption.getOptionText();
                            }
                        }

                        correct =
                                Boolean.TRUE.equals(
                                        answer.getCorrect()
                                );

                        if (answer.getMarksObtained() != null) {

                            marksObtained =
                                    answer.getMarksObtained();
                        }
                    }

                    List<Option> options =
                            optionRepository
                                    .findByQuestionQuestionIdOrderByOptionOrderAsc(
                                            question.getQuestionId()
                                    );

                    Option correctOption =
                            options.stream()
                                    .filter(option ->
                                            Boolean.TRUE.equals(
                                                    option.getCorrect()
                                            )
                                    )
                                    .findFirst()
                                    .orElse(null);

                    String correctOptionLabel = null;
                    String correctOptionText = null;

                    if (correctOption != null) {

                        correctOptionLabel =
                                correctOption.getOptionLabel();

                        correctOptionText =
                                correctOption.getOptionText();
                    }

                    return new AnswerReviewResponse(
                            question.getQuestionId(),
                            question.getQuestionText(),
                            question.getQuestionOrder(),
                            selectedOptionLabel,
                            selectedOptionText,
                            correctOptionLabel,
                            correctOptionText,
                            correct,
                            marksObtained,
                            question.getMarks()
                    );
                })
                .toList();
    }


}