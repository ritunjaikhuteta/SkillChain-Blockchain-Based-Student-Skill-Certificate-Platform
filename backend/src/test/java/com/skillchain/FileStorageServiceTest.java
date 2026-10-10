package com.skillchain;

import com.skillchain.exception.BadRequestException;
import com.skillchain.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceTest {

    @TempDir
    Path tempUploadDir;

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService(tempUploadDir.toString());
        fileStorageService.init();
    }

    @Test
    @DisplayName("Valid PDF with %PDF- magic bytes is stored and hashed with SHA-256")
    void testStoreValidPdf() {
        byte[] pdfContent = "%PDF-1.7\nSample educational certificate content for testing SkillChain ledger.".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file", "cert-aws.pdf", "application/pdf", pdfContent
        );

        FileStorageService.StoredFileMeta meta = fileStorageService.storeCertificatePdf(file);

        assertNotNull(meta);
        assertNotNull(meta.getFileKey());
        assertTrue(meta.getFileKey().startsWith("cert-"));
        assertTrue(meta.getFileKey().endsWith(".pdf"));
        assertEquals("cert-aws.pdf", meta.getOriginalFilename());
        assertEquals("application/pdf", meta.getContentType());
        assertEquals(pdfContent.length, meta.getFileSize());
        assertNotNull(meta.getFileHash());
        assertEquals(64, meta.getFileHash().length());
    }

    @Test
    @DisplayName("Invalid file masquerading as PDF with bad header is rejected")
    void testRejectInvalidPdfHeader() {
        byte[] maliciousContent = new byte[]{'M', 'Z', (byte) 0x90, 0x00, 0x03, 'f', 'a', 'k', 'e'};
        MockMultipartFile file = new MockMultipartFile(
                "file", "fake.pdf", "application/pdf", maliciousContent
        );

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                fileStorageService.storeCertificatePdf(file)
        );
        assertTrue(ex.getMessage().contains("not a valid PDF document"));
    }

    @Test
    @DisplayName("Valid PNG image with PNG magic bytes is stored successfully")
    void testStoreValidPngAvatar() {
        byte[] pngContent = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D};
        MockMultipartFile file = new MockMultipartFile(
                "file", "avatar.png", "image/png", pngContent
        );

        FileStorageService.StoredFileMeta meta = fileStorageService.storeAvatarImage(file);

        assertNotNull(meta);
        assertTrue(meta.getFileKey().endsWith(".png"));
        assertEquals("image/png", meta.getContentType());
        assertNotNull(meta.getFileHash());
    }

    @Test
    @DisplayName("Valid JPEG image with JPEG magic bytes is stored successfully")
    void testStoreValidJpegAvatar() {
        byte[] jpegContent = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0x00, 0x10, 0x4A, 0x46};
        MockMultipartFile file = new MockMultipartFile(
                "file", "avatar.jpg", "image/jpeg", jpegContent
        );

        FileStorageService.StoredFileMeta meta = fileStorageService.storeAvatarImage(file);

        assertNotNull(meta);
        assertTrue(meta.getFileKey().endsWith(".jpg"));
        assertEquals("image/jpeg", meta.getContentType());
        assertNotNull(meta.getFileHash());
    }

    @Test
    @DisplayName("Empty upload file throws BadRequestException")
    void testEmptyFileRejected() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "empty.pdf", "application/pdf", new byte[0]
        );

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                fileStorageService.storeCertificatePdf(file)
        );
        assertTrue(ex.getMessage().contains("cannot be null or empty"));
    }

    @Test
    @DisplayName("Oversized certificate file (>10MB) is rejected")
    void testOversizedFileRejected() {
        byte[] header = "%PDF-".getBytes();
        byte[] oversized = new byte[11 * 1024 * 1024];
        System.arraycopy(header, 0, oversized, 0, header.length);

        MockMultipartFile file = new MockMultipartFile(
                "file", "huge.pdf", "application/pdf", oversized
        );

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                fileStorageService.storeCertificatePdf(file)
        );
        assertTrue(ex.getMessage().contains("exceeds maximum limit of 10MB"));
    }
}
