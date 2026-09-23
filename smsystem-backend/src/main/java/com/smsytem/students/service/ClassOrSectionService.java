package com.smsytem.students.service;

import com.smsytem.students.dto.ClassDTO;

import java.util.List;


public interface ClassOrSectionService {
    List<ClassDTO> getAllClasses();

    ClassDTO addClass(ClassDTO classDTO);

    ClassDTO getClassById(Long id);

    void deleteClass(Long id);

}
