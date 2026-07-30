package com.ecommerce.project.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

  @Bean
public Cloudinary cloudinary() {

    System.out.println("==================================");
    System.out.println("Cloud Name  : " + cloudName);
    System.out.println("API Key     : " + apiKey);
    System.out.println("API Secret? : " + (apiSecret != null));
    System.out.println("==================================");

    String cloudinaryUrl =
            "cloudinary://" +
            apiKey + ":" +
            apiSecret + "@" +
            cloudName;

    return new Cloudinary(cloudinaryUrl);
}
}