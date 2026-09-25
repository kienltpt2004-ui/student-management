package com.smsytem.students.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.smsytem.students.dto.StudentDTO;
import com.smsytem.students.dto.StudentDetailedDTO;
import com.smsytem.students.entity.ClassOrSection;
import com.smsytem.students.entity.Student;
import com.smsytem.students.entity.Subject;
import com.smsytem.students.exception.ResourceNotFoundException;
import com.smsytem.students.repository.ClassRepository;
import com.smsytem.students.repository.StudentRepository;
import com.smsytem.students.service.StudentService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class StudentServiceImpl implements StudentService {
    private StudentRepository studentRepository;
    private ClassRepository classRepository;
    private ModelMapper modelMapper;

    @Override
    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = modelMapper.map(studentDTO, Student.class);
        ClassOrSection classOrSection = classRepository.findById(studentDTO.getClassID())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "class doesn't exist with the id " + studentDTO.getClassID()));
        student.setStudentClass(classOrSection);
        Student savedStudent = studentRepository.save(student);
        StudentDTO savedStudentDTO = modelMapper.map(savedStudent, StudentDTO.class);
        return savedStudentDTO;
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            throw new ResourceNotFoundException("No student found! Please add student");
        }
        // Update all students feesDue column
        students.forEach(Student::calculateFeesDue);
        return students.stream()
                .map(student -> {
                    StudentDTO studentDTO = modelMapper.map(student, StudentDTO.class);

                    // Add class name if student has a class assigned
                    if (student.getStudentClass() != null) {
                        studentDTO.setClassName(student.getStudentClass().getClassName());
                    }

                    return studentDTO;
                })
                .collect(Collectors.toList());
    }


    @Override
    public StudentDTO getStudentById(Long id) {
        Student theStudent = studentRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Student is not exist with the given id: " + id));
        theStudent.calculateFeesDue();

        StudentDTO studentDTO = modelMapper.map(theStudent, StudentDTO.class);

        // Add class name if student has a class assigned
        if (theStudent.getStudentClass() != null) {
            studentDTO.setClassName(theStudent.getStudentClass().getClassName());
        }

        return studentDTO;
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Student is not exist with the given id: " + id));

        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setStudentID(studentDTO.getStudentID());
        student.setRoll(studentDTO.getRoll());
        student.setFeesPaid(studentDTO.getFeesPaid());
        student.setPhoneNumber(studentDTO.getPhoneNumber());
        student.calculateFeesDue();
        Student updatedStudent = studentRepository.save(student);
        return modelMapper.map(updatedStudent, StudentDTO.class);
    }

    @Override
    public StudentDetailedDTO getStudentDetailedById(Long id) {
        Student student = studentRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Student is not exist with the given id: " + id));
        student.calculateFeesDue();

        // Build thủ công (không dùng modelMapper.map) để đồng bộ với
        // ClassServiceImpl - tránh ConfigurationException: ambiguous mapping
        // cho classTeacherName (Teacher có firstName/lastName tách rời).
        StudentDetailedDTO detailedDTO = new StudentDetailedDTO();
        detailedDTO.setStudentID(student.getStudentID());
        detailedDTO.setFirstName(student.getFirstName());
        detailedDTO.setLastName(student.getLastName());
        detailedDTO.setEmail(student.getEmail());
        detailedDTO.setRoll(student.getRoll());
        detailedDTO.setHeight(student.getHeight());
        detailedDTO.setDateOfBirth(student.getDateOfBirth());
        detailedDTO.setTotalFees(student.getTotalFees());
        detailedDTO.setFeesPaid(student.getFeesPaid());
        detailedDTO.setFeesDue(student.getFeesDue());
        detailedDTO.setPhoneNumber(student.getPhoneNumber());
        detailedDTO.setImageLink(student.getImageLink());
        detailedDTO.setAddress(student.getAddress());
        detailedDTO.setCity(student.getCity());
        detailedDTO.setGuardianFirstName(student.getGuardianFirstName());
        detailedDTO.setGuardianLastName(student.getGuardianLastName());
        detailedDTO.setGuardianPhoneNumber(student.getGuardianPhoneNumber());
        detailedDTO.setGuardianEmail(student.getGuardianEmail());
        detailedDTO.setRelationship(student.getRelationship());

        // Add detailed class information if student has a class assigned
        if (student.getStudentClass() != null) {
            ClassOrSection classInfo = student.getStudentClass();
            detailedDTO.setClassID(classInfo.getClassID());
            detailedDTO.setClassName(classInfo.getClassName());
            detailedDTO.setClassDescription(classInfo.getDescriptions());

            if (classInfo.getClassTeacher() != null) {
                detailedDTO.setClassTeacherID(classInfo.getClassTeacher().getTeacherID());
                detailedDTO.setClassTeacherName(
                        classInfo.getClassTeacher().getFirstName() + " " +
                                classInfo.getClassTeacher().getLastName()
                );
            }

            if (classInfo.getSubjects() != null) {
                Set<Long> subjectIDs = classInfo.getSubjects().stream()
                        .map(Subject::getSubjectID)
                        .collect(Collectors.toSet());
                detailedDTO.setSubjectIDs(subjectIDs);
            }
        }

        return detailedDTO;
    }

    @Override
    public List<StudentDTO> getStudentsByClassId(Long classId) {
        List<Student> students = studentRepository.findAll().stream()
                .filter(student -> student.getStudentClass() != null &&
                        student.getStudentClass().getClassID().equals(classId))
                .collect(Collectors.toList());

        return students.stream()
                .map(student -> {
                    student.calculateFeesDue();
                    StudentDTO studentDTO = modelMapper.map(student, StudentDTO.class);
                    if (student.getStudentClass() != null) {
                        studentDTO.setClassName(student.getStudentClass().getClassName());
                    }
                    return studentDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteStudent(Long id) {
        Student studentToDelete = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        studentRepository.deleteById(id);
    }
}