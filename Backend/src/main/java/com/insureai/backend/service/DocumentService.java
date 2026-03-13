package com.insureai.backend.service;

import com.insureai.backend.entity.ApplicationDocument;
import com.insureai.backend.entity.ApplicationDocument.DocumentCategory;
import com.insureai.backend.entity.ApplicationDocument.DocumentStatus;
import com.insureai.backend.repository.ApplicationDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private ApplicationDocumentRepository documentRepository;

    @Value("${insureai.upload.dir:uploads/documents}")
    private String uploadDir;

    private static final long MAX_SIZE = 300L * 1024; // 300 KB
    private static final List<String> ALLOWED = List.of(
            "image/jpeg", "image/jpg", "image/png", "application/pdf"
    );

    // ── Upload ─────────────────────────────────────────
    public ApplicationDocument upload(Long applicationId, Long userId,
                                      String documentType, String category,
                                      MultipartFile file) throws IOException {
        if (file.getSize() > MAX_SIZE)
            throw new RuntimeException(
                    "File too large. Max 300 KB. Your file: "
                            + (file.getSize() / 1024) + " KB");

        String ct = file.getContentType();
        if (ct == null || !ALLOWED.contains(ct))
            throw new RuntimeException("Only JPG, PNG or PDF allowed.");

        Path dir  = Paths.get(uploadDir, String.valueOf(applicationId));
        Files.createDirectories(dir);

        String ext        = getExt(file.getOriginalFilename());
        String stored     = UUID.randomUUID() + "." + ext;
        Path   target     = dir.resolve(stored);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        ApplicationDocument doc = new ApplicationDocument();
        doc.setApplicationId(applicationId);
        doc.setUserId(userId);
        doc.setDocumentType(documentType.toUpperCase());
        doc.setCategory(DocumentCategory.valueOf(category.toUpperCase()));
        doc.setOriginalFileName(file.getOriginalFilename());
        doc.setStoredFileName(stored);
        doc.setFilePath(target.toString());
        doc.setFileType(ct);
        doc.setFileSize(file.getSize());
        return documentRepository.save(doc);
    }

    // ── Getters ────────────────────────────────────────
    public List<ApplicationDocument> getByApplication(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId);
    }

    public ApplicationDocument getById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found: " + id));
    }

    public byte[] getFileBytes(Long id) throws IOException {
        return Files.readAllBytes(Paths.get(getById(id).getFilePath()));
    }

    // ── Admin: verify / reject ─────────────────────────
    public ApplicationDocument updateStatus(Long id, String status, String remarks) {
        ApplicationDocument doc = getById(id);
        doc.setStatus(DocumentStatus.valueOf(status.toUpperCase()));
        doc.setAdminRemarks(remarks);
        if ("VERIFIED".equalsIgnoreCase(status)) doc.setVerifiedAt(LocalDateTime.now());
        return documentRepository.save(doc);
    }

    // ── Delete ─────────────────────────────────────────
    public void delete(Long id) throws IOException {
        ApplicationDocument doc = getById(id);
        Files.deleteIfExists(Paths.get(doc.getFilePath()));
        documentRepository.deleteById(id);
    }

    private String getExt(String name) {
        if (name == null || !name.contains(".")) return "bin";
        return name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    }
}