package com.insureai.backend.controller;

import com.insureai.backend.entity.ApplicationDocument;
import com.insureai.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // POST /api/documents/upload  (multipart)
    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("applicationId") Long applicationId,
            @RequestParam("userId")        Long userId,
            @RequestParam("documentType")  String documentType,
            @RequestParam("category")      String category,
            @RequestParam("file")          MultipartFile file) {
        try {
            return ResponseEntity.ok(
                    documentService.upload(applicationId, userId, documentType, category, file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/documents/application/{applicationId}
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<ApplicationDocument>> getByApplication(
            @PathVariable Long applicationId) {
        return ResponseEntity.ok(documentService.getByApplication(applicationId));
    }

    // GET /api/documents/{id}/view  — stream file inline
    @GetMapping("/{id}/view")
    public ResponseEntity<byte[]> view(@PathVariable Long id) {
        try {
            ApplicationDocument doc = documentService.getById(id);
            byte[] bytes = documentService.getFileBytes(id);
            HttpHeaders h = new HttpHeaders();
            h.setContentType(MediaType.parseMediaType(doc.getFileType()));
            h.setContentDisposition(
                    ContentDisposition.inline().filename(doc.getOriginalFileName()).build());
            return new ResponseEntity<>(bytes, h, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/documents/{id}/status  — admin verify/reject
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody  Map<String, String> body) {
        try {
            return ResponseEntity.ok(documentService.updateStatus(
                    id, body.get("status"), body.getOrDefault("adminRemarks", "")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/documents/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            documentService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}