package com.example.oes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OnlineExaminationSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(
				OnlineExaminationSystemApplication.class,
				args
		);
	}
}
