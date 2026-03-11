package com.example.smartvendorapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
	@Bean
	WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry 
				.addMapping("/**")
				.allowedOrigins("http://localhost:8081", "http://localhost:5173", "http://192.168.0.102:8081") // Added local dev URLs
				.allowedHeaders("*")
				.allowedMethods("GET","PUT","POST","DELETE","OPTIONS", "PATCH")
				.exposedHeaders("Authorization")
				.allowCredentials(true);
			}
		};
	}
}
