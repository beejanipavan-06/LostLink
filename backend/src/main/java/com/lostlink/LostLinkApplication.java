package com.lostlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.lostlink.repository")
public class LostLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(LostLinkApplication.class, args);
    }
}

