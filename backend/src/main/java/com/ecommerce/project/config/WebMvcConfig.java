package com.ecommerce.project.config;

import java.io.File;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        File folder = new File("images");

        System.out.println("IMAGE PATH = " + folder.getAbsolutePath());
        System.out.println("EXISTS = " + folder.exists());

        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:images/");
    }
}