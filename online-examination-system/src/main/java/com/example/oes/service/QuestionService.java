package com.example.oes.service;

import com.example.oes.dto.OptionRequest;
import com.example.oes.dto.OptionResponse;
import com.example.oes.dto.QuestionRequest;
import com.example.oes.dto.QuestionResponse;
import com.example.oes.entity.Exam;
import com.example.oes.entity.Option;
import com.example.oes.entity.Question;
import com.example.oes.entity.User;
import com.example.oes.exception.ResourceNotFoundException;
import com.example.oes.repository.ExamRepository;
import com.example.oes.repository.OptionRepository;
import com.example.oes.repository.QuestionRepository;
import com.example.oes.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    public QuestionService(
            QuestionRepository questionRepository,
            OptionRepository optionRepository,
            ExamRepository examRepository,
            UserRepository userRepository) {

        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.examRepository = examRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsForCurrentTeacher() {

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

        if (!"TEACHER".equalsIgnoreCase(user.getUserRole())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "Only teachers can access questions"
            );
        }

        List<Question> questions =
                questionRepository
                        .findByExamCreatedByUserIdOrderByExamExamIdAscQuestionOrderAsc(
                                user.getUserId()
                        );

        return questions.stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public QuestionResponse createQuestion(
            Long examId,
            QuestionRequest request) {

        validateQuestionOrder(request.getQuestionOrder());

        validateOptions(request.getOptions());

        // 1. Check whether the exam exists
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id: " + examId
                        ));
        verifyTeacherOwnsExam(exam);

        // 2. Check duplicate question order
        if (questionRepository
                .existsByExamExamIdAndQuestionOrder(
                        examId,
                        request.getQuestionOrder())) {

            throw new IllegalArgumentException(
                    "Question order "
                            + request.getQuestionOrder()
                            + " already exists in this exam"
            );
        }

        // 3. Create Question
        Question question = new Question();

        question.setExam(exam);
        question.setQuestionText(request.getQuestionText());
        question.setMarks(request.getMarks());
        question.setQuestionOrder(request.getQuestionOrder());

        Question savedQuestion =
                questionRepository.save(question);

        // 4. Create Options
        for (OptionRequest optionRequest : request.getOptions()) {

            if (optionRepository
                    .existsByQuestionQuestionIdAndOptionOrder(
                            savedQuestion.getQuestionId(),
                            optionRequest.getOptionOrder())) {

                throw new IllegalArgumentException(
                        "Option order "
                                + optionRequest.getOptionOrder()
                                + " already exists"
                );
            }

            Option option = new Option();

            option.setQuestion(savedQuestion);
            option.setOptionLabel(
                    optionRequest.getOptionLabel()
            );
            option.setOptionText(
                    optionRequest.getOptionText()
            );
            option.setCorrect(
                    optionRequest.getCorrect()
            );
            option.setOptionOrder(
                    optionRequest.getOptionOrder()
            );

            optionRepository.save(option);
        }

        // 5. Return complete question
        return getQuestionById(
                savedQuestion.getQuestionId()
        );
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long questionId) {

        Question question = questionRepository
                .findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id: "
                                        + questionId
                        ));

        verifyTeacherOwnsExam(question.getExam());

        return convertToResponse(question);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByExam(
            Long examId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id: " + examId
                        ));

//        validateExamAvailability(exam);

        List<Question> questions =
                questionRepository
                        .findByExamExamIdOrderByQuestionOrderAsc(
                                examId
                        );

        return questions.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public QuestionResponse convertToResponse(
            Question question) {

        List<Option> options =
                optionRepository
                        .findByQuestionQuestionIdOrderByOptionOrderAsc(
                                question.getQuestionId()
                        );

        List<OptionResponse> optionResponses =
                options.stream()
                        .map(option -> new OptionResponse(
                                option.getOptionId(),
                                option.getOptionLabel(),
                                option.getOptionText(),
                                option.getOptionOrder()
                        ))
                        .toList();

        return new QuestionResponse(
                question.getQuestionId(),
                question.getExam().getExamId(),
                question.getQuestionText(),
                question.getMarks(),
                question.getQuestionOrder(),
                optionResponses
        );
    }
    @Transactional
    public QuestionResponse updateQuestion(
            Long questionId,
            QuestionRequest request) {

        // 1. Find the question
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id: " + questionId
                        ));

        // 2. Verify that the logged-in teacher owns the exam
        verifyTeacherOwnsExam(question.getExam());

        // 3. Validate question order and options
        validateQuestionOrder(request.getQuestionOrder());
        validateOptions(request.getOptions());

        Long examId = question.getExam().getExamId();

        // 4. Check whether the new question order
        // conflicts with another question in the same exam
        if (!question.getQuestionOrder().equals(request.getQuestionOrder())
                && questionRepository.existsByExamExamIdAndQuestionOrder(
                examId,
                request.getQuestionOrder())) {

            throw new IllegalArgumentException(
                    "Question order "
                            + request.getQuestionOrder()
                            + " already exists in this exam"
            );
        }

        // 5. Update question details
        question.setQuestionText(request.getQuestionText());
        question.setMarks(request.getMarks());
        question.setQuestionOrder(request.getQuestionOrder());

        questionRepository.save(question);

        // 6. Find existing options
        List<Option> existingOptions =
                optionRepository
                        .findByQuestionQuestionIdOrderByOptionOrderAsc(
                                questionId
                        );

        // 7. Delete existing options
        optionRepository.deleteAll(existingOptions);

        // IMPORTANT:
        // Force Hibernate to execute DELETE statements
        // before inserting the new options.
        optionRepository.flush();

        // 8. Create the updated options
        for (OptionRequest optionRequest : request.getOptions()) {

            Option option = new Option();

            option.setQuestion(question);
            option.setOptionLabel(
                    optionRequest.getOptionLabel()
            );
            option.setOptionText(
                    optionRequest.getOptionText()
            );
            option.setCorrect(
                    optionRequest.getCorrect()
            );
            option.setOptionOrder(
                    optionRequest.getOptionOrder()
            );

            optionRepository.save(option);
        }

        // 9. Return the updated question with its options
        return getQuestionById(questionId);
    }
    @Transactional
    public void deleteQuestion(Long questionId) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id: " + questionId
                        ));
        verifyTeacherOwnsExam(question.getExam());

        List<Option> options =
                optionRepository
                        .findByQuestionQuestionIdOrderByOptionOrderAsc(
                                questionId
                        );

        optionRepository.deleteAll(options);

        questionRepository.delete(question);
    }
    private void validateOptions(List<OptionRequest> options) {

        if (options == null || options.size() < 2) {
            throw new IllegalArgumentException(
                    "A question must have at least 2 options"
            );
        }

        Set<Integer> optionOrders = new HashSet<>();

        int correctCount = 0;

        for (OptionRequest option : options) {

            if (option.getOptionOrder() == null
                    || option.getOptionOrder() <= 0) {

                throw new IllegalArgumentException(
                        "Option order must be greater than 0"
                );
            }

            if (!optionOrders.add(option.getOptionOrder())) {

                throw new IllegalArgumentException(
                        "Duplicate option order: "
                                + option.getOptionOrder()
                );
            }

            if (Boolean.TRUE.equals(option.getCorrect())) {
                correctCount++;
            }
        }

        if (correctCount != 1) {
            throw new IllegalArgumentException(
                    "A question must have exactly one correct option"
            );
        }
    }
    private void validateQuestionOrder(Integer questionOrder) {

        if (questionOrder == null || questionOrder <= 0) {
            throw new IllegalArgumentException(
                    "Question order must be greater than 0"
            );
        }
    }
    private void verifyTeacherOwnsExam(Exam exam) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User teacher = exam.getCreatedBy();

        if (teacher == null
                || !teacher.getEmail().equals(email)) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not authorized to modify this exam"
            );
        }
    }
    private void validateExamAvailability(Exam exam) {

        if (!"PUBLISHED".equalsIgnoreCase(exam.getExamStatus())) {
            throw new IllegalArgumentException(
                    "This exam is not currently available"
            );
        }

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
    }

}