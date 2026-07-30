package com.ecommerce.project;

import java.io.File;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SbEcomApplication {

    public static void main(String[] args) {

        File folder = new File("images");

        System.out.println("=================================");
        System.out.println("IMAGE PATH = " + folder.getAbsolutePath());
        System.out.println("IMAGE FOLDER EXISTS = " + folder.exists());
        System.out.println("=================================");

        SpringApplication.run(SbEcomApplication.class, args);
    }
}