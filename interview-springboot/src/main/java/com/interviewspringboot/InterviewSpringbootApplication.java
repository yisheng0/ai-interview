package com.interviewspringboot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.interviewspringboot.mapper")
public class InterviewSpringbootApplication {

	public static void main(String[] args) {
		SpringApplication.run(InterviewSpringbootApplication.class, args);
	}

}
