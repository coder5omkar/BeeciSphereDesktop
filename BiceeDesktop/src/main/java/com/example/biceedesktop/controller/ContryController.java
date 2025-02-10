package com.example.biceedesktop.controller;

import com.example.biceedesktop.dto.ContryDto;
import com.example.biceedesktop.service.ContryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/contries")
public class ContryController {

    @Autowired
    private ContryService contryService;

    // Add Contry REST API
    @PostMapping
    public ResponseEntity<ContryDto> addContry(@RequestBody ContryDto contryDto) {
        ContryDto savedContry = contryService.addContry(contryDto);
        return new ResponseEntity<>(savedContry, HttpStatus.CREATED);
    }

    // Get Contry by ID REST API
    @GetMapping("{id}")
    public ResponseEntity<ContryDto> getContry(@PathVariable("id") Long contryId) {
        ContryDto contryDto = contryService.getContry(contryId);
        return new ResponseEntity<>(contryDto, HttpStatus.OK);
    }

    // Get All Contries REST API
    @GetMapping
    public ResponseEntity<List<ContryDto>> getAllContries() {
        List<ContryDto> contries = contryService.getAllContrys();
        return ResponseEntity.ok(contries);
    }

    // Get Contries by Member ID REST API
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<ContryDto>> getContryByMemberId(@PathVariable("memberId") Long memberId) {
        List<ContryDto> contries = contryService.getContryByMemberId(memberId);
        return ResponseEntity.ok(contries);
    }

    // Update Contry REST API
    @PutMapping("{id}")
    public ResponseEntity<ContryDto> updateContry(@RequestBody ContryDto contryDto, @PathVariable("id") Long contryId) {
        ContryDto updatedContry = contryService.updateContry(contryDto, contryId);
        return ResponseEntity.ok(updatedContry);
    }

    // Delete Contry REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteContry(@PathVariable("id") Long contryId) {
        contryService.deleteContry(contryId);
        return ResponseEntity.ok("Contry deleted successfully.");
    }
}
