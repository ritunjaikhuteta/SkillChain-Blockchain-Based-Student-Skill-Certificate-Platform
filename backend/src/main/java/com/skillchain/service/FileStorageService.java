package com.skillchain.service;

import com.skillchain.exception.BadRequestException;
import com.skillchain.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private static final byte[] PDF_MAGIC_BYTES = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D}; // %PDF-
    private static final byte[] PNG_MAGIC_BYTES = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}; // \x89PNG\r\n\x1a\n
    private static final byte[] JPEG_MAGIC_PREFIX = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF}; // \xFF\xD8\xFF

    private final Path rootStorageLocation;
    private final Path certificateDir;
    private final Path avatarDir;

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadDir) {
        this.rootStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.certificateDir = this.rootStorageLocation.resolve("certificates").normalize();
        this.avatarDir = this.rootStorageLocation.resolve("avatars").normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.certificateDir);
            Files.createDirectories(this.avatarDir);
            log.info("Initialized file storage at: {}", this.rootStorageLocation);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize storage directory", e);
        }
    }

    public static class StoredFileMeta {
        private final String fileKey;
        private final String originalFilename;
        private final String fileHash;
        private final long fileSize;
        private final String contentType;

        public StoredFileMeta(String fileKey, String originalFilename, String fileHash, long fileSize, String contentType) {
            this.fileKey = fileKey;
            this.originalFilename = originalFilename;
            this.fileHash = fileHash;
            this.fileSize = fileSize;
            this.contentType = contentType;
        }

        public String getFileKey() {
            return fileKey;
        }

        public String getOriginalFilename() {
            return originalFilename;
        }

        public String getFileHash() {
            return fileHash;
        }

        public long getFileSize() {
            return fileSize;
        }

        public String getContentType() {
            return contentType;
        }
    }

    public StoredFileMeta storeCertificatePdf(MultipartFile file) {
        validateFileNotEmpty(file);

        // Maximum 10MB
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("Certificate file exceeds maximum limit of 10MB");
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new BadRequestException("Failed to read uploaded certificate bytes");
        }

        // Validate PDF Magic Bytes (%PDF-)
        if (!isPdf(fileBytes)) {
            throw new BadRequestException("Invalid file content. Uploaded file is not a valid PDF document.");
        }

        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);
        if (!".pdf".equalsIgnoreCase(extension)) {
            extension = ".pdf";
        }

        String fileKey = "cert-" + UUID.randomUUID() + extension;
        Path destination = this.certificateDir.resolve(fileKey).normalize();

        preventPathTraversal(destination, this.certificateDir);

        try {
            Files.write(destination, fileBytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to persist certificate file to disk", e);
        }

        String sha256 = calculateSha256(fileBytes);
        return new StoredFileMeta(fileKey, originalFilename, sha256, fileBytes.length, "application/pdf");
    }

    public StoredFileMeta storeAvatarImage(MultipartFile file) {
        validateFileNotEmpty(file);

        // Maximum 5MB
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("Avatar image exceeds maximum limit of 5MB");
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new BadRequestException("Failed to read uploaded avatar bytes");
        }

        String contentType;
        String extension;

        if (isPng(fileBytes)) {
            contentType = "image/png";
            extension = ".png";
        } else if (isJpeg(fileBytes)) {
            contentType = "image/jpeg";
            extension = ".jpg";
        } else {
            throw new BadRequestException("Invalid image content. Only JPEG and PNG formats are allowed.");
        }

        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        String fileKey = "avatar-" + UUID.randomUUID() + extension;
        Path destination = this.avatarDir.resolve(fileKey).normalize();

        preventPathTraversal(destination, this.avatarDir);

        try {
            Files.write(destination, fileBytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to persist avatar image to disk", e);
        }

        String sha256 = calculateSha256(fileBytes);
        return new StoredFileMeta(fileKey, originalFilename, sha256, fileBytes.length, contentType);
    }

    public Resource loadCertificatePdfAsResource(String fileKey) {
        Path filePath = this.certificateDir.resolve(fileKey).normalize();
        preventPathTraversal(filePath, this.certificateDir);

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Certificate document file not found: " + fileKey);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Invalid file URL: " + fileKey);
        }
    }

    public Resource loadAvatarAsResource(String fileKey) {
        Path filePath = this.avatarDir.resolve(fileKey).normalize();
        preventPathTraversal(filePath, this.avatarDir);

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Avatar image not found: " + fileKey);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Invalid file URL: " + fileKey);
        }
    }

    public void deleteCertificateFile(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) return;
        Path filePath = this.certificateDir.resolve(fileKey).normalize();
        preventPathTraversal(filePath, this.certificateDir);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Could not delete certificate file: {}", fileKey, e);
        }
    }

    public void deleteAvatarFile(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) return;
        Path filePath = this.avatarDir.resolve(fileKey).normalize();
        preventPathTraversal(filePath, this.avatarDir);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Could not delete avatar file: {}", fileKey, e);
        }
    }

    // --- Content Magic Byte Validators ---
    public static boolean isPdf(byte[] data) {
        if (data == null || data.length < PDF_MAGIC_BYTES.length) return false;
        for (int i = 0; i < PDF_MAGIC_BYTES.length; i++) {
            if (data[i] != PDF_MAGIC_BYTES[i]) return false;
        }
        return true;
    }

    public static boolean isPng(byte[] data) {
        if (data == null || data.length < PNG_MAGIC_BYTES.length) return false;
        for (int i = 0; i < PNG_MAGIC_BYTES.length; i++) {
            if (data[i] != PNG_MAGIC_BYTES[i]) return false;
        }
        return true;
    }

    public static boolean isJpeg(byte[] data) {
        if (data == null || data.length < JPEG_MAGIC_PREFIX.length) return false;
        return data[0] == (byte) 0xFF && data[1] == (byte) 0xD8 && data[2] == (byte) 0xFF;
    }

    private void validateFileNotEmpty(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be null or empty");
        }
    }

    private void preventPathTraversal(Path resolved, Path baseDir) {
        if (!resolved.startsWith(baseDir)) {
            throw new SecurityException("Path traversal attempt detected. Access denied.");
        }
    }

    private String sanitizeFilename(String filename) {
        if (filename == null) return "file";
        String clean = Paths.get(filename).getFileName().toString();
        return clean.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }

    public static String calculateSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hex = new StringBuilder(64);
            for (byte b : hash) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) hex.append('0');
                hex.append(h);
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
