package com.smsytem.students.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smsytem.students.dto.SubjectDTO;
import com.smsytem.students.entity.Subject;
import com.smsytem.students.entity.Teacher;
import com.smsytem.students.exception.ResourceNotFoundException;
import com.smsytem.students.repository.SubjectRepository;
import com.smsytem.students.repository.TeacherRepository;
import com.smsytem.students.service.SubjectService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    private TeacherRepository teacherRepository;

    private ModelMapper modelMapper;

    // =========================================================
    // ADD SUBJECT
    // =========================================================

    @Override
    public SubjectDTO addSubject(SubjectDTO subjectDTO) {

        // Map thông tin cơ bản từ DTO -> Entity
        Subject sub = modelMapper.map(subjectDTO, Subject.class);

        // Tìm Teacher theo teacherID
        Teacher teacher = teacherRepository.findById(
                subjectDTO.getTeacherID()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Teacher doesn't exist!"
                )
        );

        // Gán Teacher cho Subject
        sub.setThoughtBy(teacher);

        // Lưu Subject vào database
        Subject savedSubject = subjectRepository.save(sub);

        // =====================================================
        // BUILD DTO THỦ CÔNG
        // =====================================================

        SubjectDTO savedSubjectDTO = new SubjectDTO();

        savedSubjectDTO.setSubjectID(
                savedSubject.getSubjectID()
        );

        savedSubjectDTO.setSubjectName(
                savedSubject.getSubjectName()
        );

        savedSubjectDTO.setDescriptions(
                savedSubject.getDescriptions()
        );

        // Teacher information
        savedSubjectDTO.setTeacherID(
                teacher.getTeacherID()
        );



        return savedSubjectDTO;
    }

    // =========================================================
    // GET ALL SUBJECTS
    // =========================================================

    @Override
    public List<SubjectDTO> getAllSubjects() {

        List<Subject> subjects = subjectRepository.findAll();

        // Danh sách rỗng KHÔNG phải lỗi - trả về 200 kèm mảng rỗng thay vì 404
        return subjects.stream()
                .map(sub -> modelMapper.map(
                        sub,
                        SubjectDTO.class
                ))
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET SUBJECT BY ID
    // =========================================================

    @Override
    public SubjectDTO getSubjectById(Long id) {

        Subject theSub = subjectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subject is not exist with the given id: "
                                        + id
                        )
                );

        return modelMapper.map(
                theSub,
                SubjectDTO.class
        );
    }

    // =========================================================
    // DELETE SUBJECT
    // =========================================================

    @Override
    @Transactional
    public void deleteSubject(Long id) {

        Subject subjectDelete = subjectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subject not found with ID: " + id
                        )
                );

        subjectRepository.deleteById(id);
    }
}