package com.ecommerce.project.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String uploadImage(String path, MultipartFile file) throws IOException {

    try {

        System.out.println("========== CLOUDINARY UPLOAD START ==========");
        System.out.println("File Name : " + file.getOriginalFilename());

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
        );

        System.out.println("UPLOAD SUCCESS");
        System.out.println(uploadResult);

        return uploadResult.get("secure_url").toString();

    } catch (Exception e) {

        System.out.println("========== CLOUDINARY ERROR ==========");
        e.printStackTrace();

        throw e;
    }
}
}