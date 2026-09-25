package com.smsytem.students.service.impl;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smsytem.students.dto.ExamDTO;
import com.smsytem.students.entity.ClassOrSection;
import com.smsytem.students.entity.Exam;
import com.smsytem.students.entity.Exam.ExamStatus;
import com.smsytem.students.entity.Exam.ExamType;
import com.smsytem.students.entity.Subject;
import com.smsytem.students.entity.User;
import com.smsytem.students.exception.AuthException;
import com.smsytem.students.exception.ResourceNotFoundException;
import com.smsytem.students.repository.ClassRepository;
import com.smsytem.students.repository.ExamRepository;
import com.smsytem.students.repository.SubjectRepository;
import com.smsytem.students.repository.UserRepository;
import com.smsytem.students.service.ExamService;

import lombok.AllArgsConstructor;

/**
 * Service implementation for Exam management
 * Handles exam creation, scheduling, and management
 */
@AllArgsConstructor
@Service
@Transactional
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    // CREATE EXAM
    @Override
    public ExamDTO createExam(ExamDTO examDTO) {

        // Check duplicate exam
        if (examRepository.existsByExamClassClassIDAndSubjectSubjectIDAndExamDate(
                examDTO.getClassId(),
                examDTO.getSubjectId(),
                examDTO.getExamDate())) {

            throw new AuthException(
                    "Exam already exists for this class and subject on the specified date"
            );
        }

        // Find Subject
        Subject subject = subjectRepository.findById(
                examDTO.getSubjectId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Subject not found with ID: "
                                + examDTO.getSubjectId()
                )
        );

        // Find Class
        ClassOrSection examClass = classRepository.findById(
                examDTO.getClassId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Class not found with ID: "
                                + examDTO.getClassId()
                )
        );

        // Find current logged-in user
        String currentUsername =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        User creator = userRepository
                .findByUsernameOrEmail(
                        currentUsername,
                        currentUsername
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: "
                                        + currentUsername
                        )
                );
        // Create Exam entity
        Exam exam = new Exam();

        exam.setExamName(examDTO.getExamName());
        exam.setDescription(examDTO.getDescription());

        // Relationship
        exam.setSubject(subject);
        exam.setExamClass(examClass);
        exam.setCreatedBy(creator);

        // Exam information
        exam.setExamDate(examDTO.getExamDate());
        exam.setStartTime(examDTO.getStartTime());
        exam.setEndTime(examDTO.getEndTime());
        exam.setDurationMinutes(examDTO.getDurationMinutes());
        exam.setTotalMarks(examDTO.getTotalMarks());
        exam.setPassingMarks(examDTO.getPassingMarks());
        exam.setExamType(examDTO.getExamType());

        // Default status
        exam.setStatus(
                examDTO.getStatus() != null
                        ? examDTO.getStatus()
                        : ExamStatus.SCHEDULED
        );

        exam.setInstructions(examDTO.getInstructions());

        exam.setCreatedAt(LocalDate.now());
        exam.setUpdatedAt(LocalDate.now());

        // Save
        Exam savedExam = examRepository.save(exam);

        // Map manually to DTO
        return mapToDTO(savedExam);
    }


    // UPDATE EXAM
    @Override
    public ExamDTO updateExam(Long examId, ExamDTO examDTO) {

        Exam existingExam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with ID: "
                                        + examId
                        )
                );

        // -----------------------------------------------------
        // Basic information
        // -----------------------------------------------------

        existingExam.setExamName(examDTO.getExamName());
        existingExam.setDescription(examDTO.getDescription());
        existingExam.setExamDate(examDTO.getExamDate());
        existingExam.setStartTime(examDTO.getStartTime());
        existingExam.setEndTime(examDTO.getEndTime());
        existingExam.setDurationMinutes(examDTO.getDurationMinutes());
        existingExam.setTotalMarks(examDTO.getTotalMarks());
        existingExam.setPassingMarks(examDTO.getPassingMarks());
        existingExam.setExamType(examDTO.getExamType());
        existingExam.setStatus(examDTO.getStatus());
        existingExam.setInstructions(examDTO.getInstructions());
        existingExam.setUpdatedAt(LocalDate.now());

        // -----------------------------------------------------
        // Update Subject
        // -----------------------------------------------------

        if (!existingExam.getSubject()
                .getSubjectID()
                .equals(examDTO.getSubjectId())) {

            Subject subject = subjectRepository.findById(
                    examDTO.getSubjectId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Subject not found with ID: "
                                    + examDTO.getSubjectId()
                    )
            );

            existingExam.setSubject(subject);
        }

        // -----------------------------------------------------
        // Update Class
        // -----------------------------------------------------

        if (!existingExam.getExamClass()
                .getClassID()
                .equals(examDTO.getClassId())) {

            ClassOrSection examClass = classRepository.findById(
                    examDTO.getClassId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Class not found with ID: "
                                    + examDTO.getClassId()
                    )
            );

            existingExam.setExamClass(examClass);
        }

        Exam updatedExam = examRepository.save(existingExam);

        return mapToDTO(updatedExam);
    }

    // =========================================================
    // GET EXAM BY ID
    // =========================================================

    @Override
    public ExamDTO getExamById(Long examId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with ID: "
                                        + examId
                        )
                );

        return mapToDTO(exam);
    }

    // =========================================================
    // GET ALL EXAMS
    // =========================================================

    @Override
    public List<ExamDTO> getAllExams() {

        List<Exam> exams = examRepository.findAll();

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET EXAMS BY CLASS
    // =========================================================

    @Override
    public List<ExamDTO> getExamsByClass(Long classId) {

        List<Exam> exams =
                examRepository
                        .findByExamClassClassIDOrderByExamDateAsc(
                                classId
                        );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET EXAMS BY SUBJECT
    // =========================================================

    @Override
    public List<ExamDTO> getExamsBySubject(Long subjectId) {

        List<Exam> exams =
                examRepository
                        .findBySubjectSubjectIDOrderByExamDateAsc(
                                subjectId
                        );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET EXAMS BY CLASS AND SUBJECT
    // =========================================================

    @Override
    public List<ExamDTO> getExamsByClassAndSubject(
            Long classId,
            Long subjectId) {

        List<Exam> exams =
                examRepository.findByClassAndSubject(
                        classId,
                        subjectId
                );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET EXAMS BY DATE RANGE
    // =========================================================

    @Override
    public List<ExamDTO> getExamsByDateRange(
            LocalDate startDate,
            LocalDate endDate) {

        List<Exam> exams =
                examRepository.findByDateRange(
                        startDate,
                        endDate
                );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET EXAMS BY STATUS
    // =========================================================

    @Override
    public List<ExamDTO> getExamsByStatus(
            ExamStatus status) {

        List<Exam> exams =
                examRepository.findByStatusOrderByExamDateAsc(
                        status
                );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET EXAMS BY TYPE
    // =========================================================

    @Override
    public List<ExamDTO> getExamsByType(
            ExamType examType) {

        List<Exam> exams =
                examRepository.findByExamTypeOrderByExamDateAsc(
                        examType
                );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET UPCOMING EXAMS BY CLASS
    // =========================================================

    @Override
    public List<ExamDTO> getUpcomingExamsByClass(
            Long classId) {

        List<Exam> exams =
                examRepository.findUpcomingExamsByClass(
                        classId,
                        LocalDate.now()
                );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET TODAY'S EXAMS
    // =========================================================

    @Override
    public List<ExamDTO> getTodaysExams() {

        List<Exam> exams =
                examRepository.findTodaysExams(
                        LocalDate.now()
                );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // UPDATE EXAM STATUS
    // =========================================================

    @Override
    public ExamDTO updateExamStatus(
            Long examId,
            ExamStatus status) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with ID: "
                                        + examId
                        )
                );

        exam.setStatus(status);
        exam.setUpdatedAt(LocalDate.now());

        Exam updatedExam = examRepository.save(exam);

        return mapToDTO(updatedExam);
    }

    // =========================================================
    // DELETE EXAM
    // =========================================================

    @Override
    public void deleteExam(Long examId) {

        if (!examRepository.existsById(examId)) {

            throw new ResourceNotFoundException(
                    "Exam not found with ID: "
                            + examId
            );
        }

        examRepository.deleteById(examId);
    }

    // =========================================================
    // EXAM STATISTICS
    // =========================================================

    @Override
    public Map<String, Object> getExamStatistics() {

        Map<String, Object> stats = new HashMap<>();

        Long totalExams =
                examRepository.count();

        Long scheduledExams =
                examRepository.countByStatus(
                        ExamStatus.SCHEDULED
                );

        Long completedExams =
                examRepository.countByStatus(
                        ExamStatus.COMPLETED
                );

        Long inProgressExams =
                examRepository.countByStatus(
                        ExamStatus.IN_PROGRESS
                );

        Long cancelledExams =
                examRepository.countByStatus(
                        ExamStatus.CANCELLED
                );

        stats.put("totalExams", totalExams);
        stats.put("scheduledExams", scheduledExams);
        stats.put("completedExams", completedExams);
        stats.put("inProgressExams", inProgressExams);
        stats.put("cancelledExams", cancelledExams);

        return stats;
    }

    // =========================================================
    // GET EXAMS BY CREATOR
    // =========================================================

    @Override
    public List<ExamDTO> getExamsByCreator(
            Long creatorId) {

        List<Exam> exams =
                examRepository
                        .findByCreatedByIdOrderByExamDateDesc(
                                creatorId
                        );

        return exams.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // MAP ENTITY -> DTO
    // =========================================================

    /**
     * Convert Exam Entity -> ExamDTO
     *
     * Không dùng:
     *
     * modelMapper.map(exam, ExamDTO.class)
     *
     * trực tiếp vì Exam có các relationship:
     *
     * Subject -> Long subjectId
     * ClassOrSection -> Long classId
     * User -> Long createdBy
     *
     * ModelMapper có thể cố convert Entity object -> Long
     * và gây lỗi NumberConverter.
     */
    private ExamDTO mapToDTO(Exam exam) {

        ExamDTO dto = new ExamDTO();

        // -----------------------------------------------------
        // Basic exam information
        // -----------------------------------------------------

        dto.setExamId(exam.getExamId());
        dto.setExamName(exam.getExamName());
        dto.setDescription(exam.getDescription());

        dto.setExamDate(exam.getExamDate());
        dto.setStartTime(exam.getStartTime());
        dto.setEndTime(exam.getEndTime());

        dto.setDurationMinutes(
                exam.getDurationMinutes()
        );

        dto.setTotalMarks(
                exam.getTotalMarks()
        );

        dto.setPassingMarks(
                exam.getPassingMarks()
        );

        dto.setExamType(
                exam.getExamType()
        );

        dto.setStatus(
                exam.getStatus()
        );

        dto.setInstructions(
                exam.getInstructions()
        );

        dto.setCreatedAt(
                exam.getCreatedAt()
        );

        dto.setUpdatedAt(
                exam.getUpdatedAt()
        );

        // -----------------------------------------------------
        // Subject information
        // -----------------------------------------------------

        if (exam.getSubject() != null) {

            dto.setSubjectId(
                    exam.getSubject().getSubjectID()
            );

            dto.setSubjectName(
                    exam.getSubject().getSubjectName()
            );
        }

        // -----------------------------------------------------
        // Class information
        // -----------------------------------------------------

        if (exam.getExamClass() != null) {

            dto.setClassId(
                    exam.getExamClass().getClassID()
            );

            dto.setClassName(
                    exam.getExamClass().getClassName()
            );
        }

        // -----------------------------------------------------
        // Creator information
        // -----------------------------------------------------

        if (exam.getCreatedBy() != null) {

            dto.setCreatedBy(
                    exam.getCreatedBy().getId()
            );

            dto.setCreatedByName(
                    exam.getCreatedBy().getName()
            );
        }

        return dto;
    }
}