package com.example.biceedesktop.controller;

import com.example.biceedesktop.dto.MemberDto;
import com.example.biceedesktop.helper.ExcelHelper;
import com.example.biceedesktop.service.ContryService;
import com.example.biceedesktop.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private ContryService contryService;

    @PostMapping
    public ResponseEntity<?> addMember(@RequestBody MemberDto memberDto) {
        try {
            MemberDto savedMember = memberService.addMember(memberDto);
            return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<MemberDto> getMember(@PathVariable("id") Long memberId){
        MemberDto todoDto = memberService.getMember(memberId);
        return new ResponseEntity<>(todoDto, HttpStatus.OK);
    }

    @GetMapping("/todo/{todoId}")
    public ResponseEntity<List<MemberDto>> getMembersByBCID(@PathVariable("todoId") Long todoId) {
        List<MemberDto> members = memberService.getMembersByBCID(todoId);
        return ResponseEntity.ok(members);
    }

    // Build Get All Todos REST API
    @GetMapping
    public ResponseEntity<List<MemberDto>> getAllMembers(){
        List<MemberDto> todos = memberService.getAllMembers();
        //return new ResponseEntity<>(todos, HttpStatus.OK);
        return ResponseEntity.ok(todos);
    }

    // Build Update Todo REST API
    @PutMapping("{id}")
    public ResponseEntity<MemberDto> updateMember(@RequestBody MemberDto memberDto, @PathVariable("id") Long memberId){
        MemberDto updatedMember = memberService.updateMember(memberDto, memberId);
        return ResponseEntity.ok(updatedMember);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteMember(@PathVariable("id") Long memberId){
        memberService.deleteMember(memberId);
        return ResponseEntity.ok("Todo deleted successfully!.");
    }

    @PostMapping("/{todoId}/bulk-upload")
    public ResponseEntity<String> bulkUploadMembers(
            @PathVariable Long todoId,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty!");
            }

            System.out.println("File Name: " + file.getOriginalFilename());
            System.out.println("File Size: " + file.getSize());

            List<MemberDto> members = ExcelHelper.excelToMembers(file.getInputStream());
            memberService.saveAll(members, todoId);
            return ResponseEntity.ok("Members uploaded successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload members: " + e.getMessage());
        }
    }
}
