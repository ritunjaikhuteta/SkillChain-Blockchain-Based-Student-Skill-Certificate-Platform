package com.skillchain.service;

import com.skillchain.exception.BadRequestException;
import com.skillchain.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
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

    private final String s3Bucket;
    private final String s3Region;
    private final String s3AccessKey;
    private final String s3SecretKey;
    private final String s3Endpoint;
    private final String storageProviderPreference;

    private S3Client s3Client;
    private boolean s3Active = false;

    @Autowired
    public FileStorageService(
            @Value("${app.upload.dir:./uploads}") String uploadDir,
            @Value("${app.storage.s3.bucket:}") String s3Bucket,
            @Value("${app.storage.s3.region:us-east-1}") String s3Region,
            @Value("${app.storage.s3.access-key:}") String s3AccessKey,
            @Value("${app.storage.s3.secret-key:}") String s3SecretKey,
            @Value("${app.storage.s3.endpoint:}") String s3Endpoint,
            @Value("${app.storage.provider:auto}") String storageProviderPreference
    ) {
        this.rootStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.certificateDir = this.rootStorageLocation.resolve("certificates").normalize();
        this.avatarDir = this.rootStorageLocation.resolve("avatars").normalize();

        this.s3Bucket = s3Bucket != null ? s3Bucket.trim() : "";
        this.s3Region = (s3Region != null && !s3Region.isBlank()) ? s3Region.trim() : "us-east-1";
        this.s3AccessKey = s3AccessKey != null ? s3AccessKey.trim() : "";
        this.s3SecretKey = s3SecretKey != null ? s3SecretKey.trim() : "";
        this.s3Endpoint = s3Endpoint != null ? s3Endpoint.trim() : "";
        this.storageProviderPreference = storageProviderPreference != null ? storageProviderPreference.trim() : "auto";
    }

    public FileStorageService(String uploadDir) {
        this(uploadDir, null, "us-east-1", null, null, null, "auto");
    }

    @PostConstruct
    public void init() {
        // 1. Initialize local directories (fallback and temp scratch space)
        try {
            Files.createDirectories(this.certificateDir);
            Files.createDirectories(this.avatarDir);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize local storage directory", e);
        }

        // 2. Initialize S3 client if credentials and bucket are provided
        boolean hasS3Credentials = !s3Bucket.isBlank() && !s3AccessKey.isBlank() && !s3SecretKey.isBlank();
        boolean forceLocal = "local".equalsIgnoreCase(storageProviderPreference);

        if (hasS3Credentials && !forceLocal) {
            try {
                S3ClientBuilder builder = S3Client.builder()
                        .region(Region.of(s3Region))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(s3AccessKey, s3SecretKey)
                        ));

                if (!s3Endpoint.isBlank()) {
                    builder.endpointOverride(URI.create(s3Endpoint));
                    builder.forcePathStyle(true); // Needed for MinIO, Cloudflare R2, Supabase
                }

                this.s3Client = builder.build();
                this.s3Active = true;
                log.info("Initialized persistent S3-compatible cloud storage with bucket: '{}' in region: '{}'", s3Bucket, s3Region);
            } catch (Exception e) {
                this.s3Active = false;
                log.error("Failed to initialize S3 storage client. Falling back to local storage: {}", e.getMessage(), e);
            }
        } else {
            this.s3Active = false;
            log.info("S3 cloud storage credentials not fully configured (bucket='{}', accessKeySet={}). " +
                    "Using local filesystem storage at: {}. " +
                    "(NOTE FOR RENDER DEPLOYMENTS: Render local disk is ephemeral across redeploys. " +
                    "Set S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY, and S3_REGION in Render environment variables for persistent object storage.)",
                    s3Bucket, !s3AccessKey.isBlank(), this.rootStorageLocation);
        }
    }

    @PreDestroy
    public void cleanup() {
        if (s3Client != null) {
            try {
                s3Client.close();
            } catch (Exception e) {
                log.warn("Error closing S3 client: {}", e.getMessage());
            }
        }
    }

    public boolean isS3Active() {
        return s3Active && s3Client != null;
    }

    public String getActiveStorageProvider() {
        return isS3Active() ? "S3" : "LOCAL";
    }

    public static class StoredFileMeta {
        private final String fileKey;
        private final String originalFilename;
        private final String fileHash;
        private final long fileSize;
        private final String contentType;
        private final String storageProvider;

        public StoredFileMeta(String fileKey, String originalFilename, String fileHash, long fileSize, String contentType, String storageProvider) {
            this.fileKey = fileKey;
            this.originalFilename = originalFilename;
            this.fileHash = fileHash;
            this.fileSize = fileSize;
            this.contentType = contentType;
            this.storageProvider = storageProvider;
        }

        public StoredFileMeta(String fileKey, String originalFilename, String fileHash, long fileSize, String contentType) {
            this(fileKey, originalFilename, fileHash, fileSize, contentType, "LOCAL");
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

        public String getStorageProvider() {
            return storageProvider;
        }
    }

    /**
     * Stores a certificate file (PDF, PNG, JPG, or JPEG) up to 5MB.
     * Content sniffing inspects magic bytes regardless of file extension.
     */
    public StoredFileMeta storeCertificateFile(MultipartFile file) {
        validateFileNotEmpty(file);

        // Maximum 5MB limit
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("Certificate file exceeds maximum limit of 5MB");
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new BadRequestException("Failed to read uploaded certificate bytes");
        }

        String contentType;
        String extension;

        if (isPdf(fileBytes)) {
            contentType = "application/pdf";
            extension = ".pdf";
        } else if (isPng(fileBytes)) {
            contentType = "image/png";
            extension = ".png";
        } else if (isJpeg(fileBytes)) {
            contentType = "image/jpeg";
            extension = ".jpg";
        } else {
            String origExt = getFileExtension(file.getOriginalFilename()).toLowerCase();
            if (".pdf".equals(origExt)) {
                throw new BadRequestException("Invalid file content. Uploaded file is not a valid PDF document.");
            }
            throw new BadRequestException("Unsupported file format. Only PDF, PNG, JPG, and JPEG documents are allowed.");
        }

        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        String origExt = getFileExtension(originalFilename).toLowerCase();

        // Security check: ensure extension doesn't contradict verified format
        if (!origExt.isEmpty()) {
            boolean matches = switch (contentType) {
                case "application/pdf" -> origExt.equals(".pdf");
                case "image/png" -> origExt.equals(".png");
                case "image/jpeg" -> origExt.equals(".jpg") || origExt.equals(".jpeg");
                default -> false;
            };
            if (!matches) {
                throw new BadRequestException("File extension does not match verified " + contentType + " content.");
            }
        }

        String fileKey = "cert-" + UUID.randomUUID() + extension;
        String sha256 = calculateSha256(fileBytes);

        String providerUsed = saveCertificateBytes(fileKey, fileBytes, contentType);

        return new StoredFileMeta(fileKey, originalFilename, sha256, fileBytes.length, contentType, providerUsed);
    }

    /**
     * Backward-compatible helper that requires PDF content.
     */
    public StoredFileMeta storeCertificatePdf(MultipartFile file) {
        StoredFileMeta meta = storeCertificateFile(file);
        if (!"application/pdf".equals(meta.getContentType())) {
            throw new BadRequestException("Invalid file content. Uploaded file is not a valid PDF document.");
        }
        return meta;
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
        return new StoredFileMeta(fileKey, originalFilename, sha256, fileBytes.length, contentType, "LOCAL");
    }

    private String saveCertificateBytes(String fileKey, byte[] fileBytes, String contentType) {
        if (isS3Active()) {
            try {
                PutObjectRequest putReq = PutObjectRequest.builder()
                        .bucket(s3Bucket)
                        .key("certificates/" + fileKey)
                        .contentType(contentType)
                        .build();
                s3Client.putObject(putReq, RequestBody.fromBytes(fileBytes));
                return "S3";
            } catch (Exception e) {
                log.error("Failed to upload to S3, falling back to local file storage: {}", e.getMessage(), e);
            }
        }

        // Local storage fallback
        Path destination = this.certificateDir.resolve(fileKey).normalize();
        preventPathTraversal(destination, this.certificateDir);

        try {
            Files.write(destination, fileBytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to persist certificate file to disk", e);
        }
        return "LOCAL";
    }

    public Resource loadCertificateDocumentAsResource(String fileKey) {
        byte[] bytes = loadCertificateDocumentBytes(fileKey);
        return new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return fileKey;
            }
        };
    }

    public Resource loadCertificatePdfAsResource(String fileKey) {
        return loadCertificateDocumentAsResource(fileKey);
    }

    public byte[] loadCertificateDocumentBytes(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            throw new BadRequestException("File key cannot be blank");
        }

        if (isS3Active()) {
            try {
                GetObjectRequest getReq = GetObjectRequest.builder()
                        .bucket(s3Bucket)
                        .key("certificates/" + fileKey)
                        .build();
                return s3Client.getObjectAsBytes(getReq).asByteArray();
            } catch (NoSuchKeyException e) {
                log.warn("File not found on S3: {}, checking local storage fallback", fileKey);
            } catch (Exception e) {
                log.warn("S3 retrieval error for {}: {}, checking local fallback", fileKey, e.getMessage());
            }
        }

        Path filePath = this.certificateDir.resolve(fileKey).normalize();
        preventPathTraversal(filePath, this.certificateDir);

        try {
            if (Files.exists(filePath) && Files.isReadable(filePath)) {
                return Files.readAllBytes(filePath);
            } else {
                throw new ResourceNotFoundException("Certificate document file not found: " + fileKey);
            }
        } catch (IOException e) {
            throw new ResourceNotFoundException("Error reading certificate file: " + fileKey);
        }
    }

    public boolean verifyFileIntegrity(String fileKey, String expectedHash) {
        if (fileKey == null || fileKey.isBlank() || expectedHash == null || expectedHash.isBlank()) {
            return false;
        }
        try {
            byte[] bytes = loadCertificateDocumentBytes(fileKey);
            String recalculated = calculateSha256(bytes);
            return recalculated.equalsIgnoreCase(expectedHash.trim());
        } catch (Exception e) {
            log.warn("Could not verify file integrity for key {}: {}", fileKey, e.getMessage());
            return false;
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

        if (isS3Active()) {
            try {
                DeleteObjectRequest delReq = DeleteObjectRequest.builder()
                        .bucket(s3Bucket)
                        .key("certificates/" + fileKey)
                        .build();
                s3Client.deleteObject(delReq);
            } catch (Exception e) {
                log.warn("Could not delete S3 object: {}", fileKey, e);
            }
        }

        Path filePath = this.certificateDir.resolve(fileKey).normalize();
        try {
            preventPathTraversal(filePath, this.certificateDir);
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            log.warn("Could not delete local certificate file: {}", fileKey, e);
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
