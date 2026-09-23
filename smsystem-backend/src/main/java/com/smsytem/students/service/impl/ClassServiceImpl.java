package com.smsytem.students.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.smsytem.students.dto.ClassDTO;
import com.smsytem.students.entity.ClassOrSection;
import com.smsytem.students.entity.Subject;
import com.smsytem.students.entity.Teacher;
import com.smsytem.students.exception.ResourceNotFoundException;
import com.smsytem.students.repository.ClassRepository;
import com.smsytem.students.repository.SubjectRepository;
import com.smsytem.students.repository.TeacherRepository;
import com.smsytem.students.service.ClassOrSectionService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class ClassServiceImpl implements ClassOrSectionService {

    private ClassRepository classRepository;
    private TeacherRepository teacherRepository;
    private SubjectRepository subjectRepository;
    private ModelMapper modelMapper;

    @Override
    public List<ClassDTO> getAllClasses() {
        List<ClassOrSection> classes = classRepository.findAll();

        return classes.stream().map(theClass -> {
            ClassDTO dto = new ClassDTO();

            dto.setClassID(theClass.getClassID());
            dto.setClassName(theClass.getClassName());
            dto.setDescriptions(theClass.getDescriptions());

            if (theClass.getClassTeacher() != null) {
                dto.setTeacherID(
                        theClass.getClassTeacher().getTeacherID()
                );

                dto.setTeacherName(
                        theClass.getClassTeacher().getFirstName()
                                + " "
                                + theClass.getClassTeacher().getLastName()
                );
            }

            Set<Long> subjectIDs = theClass.getSubjects()
                    .stream()
                    .map(Subject::getSubjectID)
                    .collect(Collectors.toSet());

            dto.setSubjectIDs(subjectIDs);

            dto.setTotalStudents(0);

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ClassDTO addClass(ClassDTO classDTO) {
        ClassOrSection theClass = modelMapper.map(classDTO, ClassOrSection.class);
        // Convert subject IDs to Subject entities
        Set<Subject> subjects = classDTO.getSubjectIDs().stream()
                .map(subjectID -> subjectRepository.findById(subjectID)
                        .orElseThrow(() -> new ResourceNotFoundException("Subject doesn't exist!")))
                .collect(Collectors.toSet());
        theClass.setSubjects(subjects);
        Teacher teacher = teacherRepository.findById(classDTO.getTeacherID())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher doesn't exist!"));
        theClass.setClassTeacher(teacher);
        ClassOrSection savedClass = classRepository.save(theClass);
        ClassDTO savedClassDTO = modelMapper.map(savedClass, ClassDTO.class);
        savedClassDTO.setSubjectIDs(classDTO.getSubjectIDs());
        return savedClassDTO;
    }

    @Override
    public ClassDTO getClassById(Long classID) {
        ClassOrSection theClass = classRepository.findById(classID)
                .orElseThrow(() -> new ResourceNotFoundException("Class doesn't exist!"));
        ClassDTO classDTO = modelMapper.map(theClass, ClassDTO.class);

        // Fetch subject IDs from the junction table
        Set<Long> subjectIDs = classRepository.findSubjectIDsByClassID(classID);
        classDTO.setSubjectIDs(subjectIDs);
        return classDTO;
    }

    @Override
    public void deleteClass(Long id) {
        ClassOrSection theClass = classRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Class is not exist with the given id: " + id));
        classRepository.deleteById(id);
        modelMapper.map(theClass, ClassDTO.class);
    }

}
