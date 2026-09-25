package com.smsytem.students;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SmsystemApplication {
	@Bean
	ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        // Nhiều DTO có field gộp kiểu "xxxName" (vd: teacherName, studentName,
        // classTeacherName) trong khi entity nguồn chỉ có firstName/lastName
        // tách rời. ModelMapper không tự đoán được nên ghép cái nào và ném
        // ConfigurationException (ambiguous mapping) ngay tại bước map().
        // Bật setAmbiguityIgnored để nó bỏ qua field mơ hồ đó (để null) thay
        // vì crash - các field này đều đã được set thủ công ngay sau khi map().
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        return modelMapper;
	}

	public static void main(String[] args) {
		SpringApplication.run(SmsystemApplication.class, args);
	}

}
