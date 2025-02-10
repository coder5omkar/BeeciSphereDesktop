package com.example.biceedesktop.service.impl;

import com.example.biceedesktop.dto.ContryDto;
import com.example.biceedesktop.dto.MemberDto;
import com.example.biceedesktop.entity.Member;
import com.example.biceedesktop.entity.Todo;
import com.example.biceedesktop.exception.ResourceNotFoundException;
import com.example.biceedesktop.repository.MemberRepository;
import com.example.biceedesktop.repository.TodoRepository;
import com.example.biceedesktop.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private TodoRepository todoRepository;

    @Override
    public MemberDto addMember(MemberDto memberDto) {
        // Convert MemberDto to Member entity
        Member member = new Member();
        member.setName(memberDto.getName());
        member.setEmail(memberDto.getEmail());
        member.setPhoneNumber(memberDto.getPhoneNumber());
        member.setAddress(memberDto.getAddress());
        member.setAmountReceived(memberDto.getAmountReceived());
        member.setMaturityAmount(memberDto.getMaturityAmount());
        member.setStatus(memberDto.getStatus());
        member.setDateJoined(memberDto.getDateJoined());
        member.setMaturityDate(memberDto.getMaturityDate());

        // If a todoId is provided, associate the Todo entity
        if (memberDto.getTodoId() != null) {
            Todo todo = todoRepository.findById(memberDto.getTodoId())
                    .orElseThrow(() -> new RuntimeException("Todo not found"));
            member.setTodo(todo);
        }

        // Save the Member entity
        Member savedMember = memberRepository.save(member);

        // Convert saved Member entity back to MemberDto
        return mapToMemberDto(savedMember);
    }

    @Override
    public MemberDto getMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        return mapToMemberDto(member);
    }

    @Override
    public List<MemberDto> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return members.stream()
                .map(this::mapToMemberDto)
                .collect(Collectors.toList());
    }

    @Override
    public MemberDto updateMember(MemberDto memberDto, Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        // Update member fields
        member.setName(memberDto.getName());
        member.setEmail(memberDto.getEmail());
        member.setPhoneNumber(memberDto.getPhoneNumber());
        member.setAddress(memberDto.getAddress());
        member.setAmountReceived(memberDto.getAmountReceived());
        member.setMaturityAmount(memberDto.getMaturityAmount());
        member.setStatus(memberDto.getStatus());
        member.setDateJoined(memberDto.getDateJoined());
        member.setMaturityDate(memberDto.getMaturityDate());

        // Update Todo association
        if (memberDto.getTodoId() != null) {
            Todo todo = todoRepository.findById(memberDto.getTodoId())
                    .orElseThrow(() -> new RuntimeException("Todo not found"));
            member.setTodo(todo);
        }

        // Save the updated member
        Member updatedMember = memberRepository.save(member);

        // Convert updated member to DTO
        return mapToMemberDto(updatedMember);
    }

    @Override
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        memberRepository.delete(member);
    }

    @Override
    public List<MemberDto> getMembersByBCID(Long todoId) {
        List<Member> members = memberRepository.findBytodoId(todoId);
        return members.stream()
                .map(this::mapToMemberDtoWithContributions)
                .collect(Collectors.toList());
    }

    // Helper method to map Member entity to MemberDto
    private MemberDto mapToMemberDto(Member member) {
        return new MemberDto(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getPhoneNumber(),
                member.getAddress(),
                member.getAmountReceived(),
                member.getMaturityAmount(),
                member.getStatus(),
                member.getDateJoined(),
                member.getMaturityDate(),
                member.getTodo() != null ? member.getTodo().getId() : null,
                null // Contributions are not mapped here
        );
    }

    // Helper method to map Member entity to MemberDto with contributions
    private MemberDto mapToMemberDtoWithContributions(Member member) {
        List<ContryDto> contributions = member.getCountrys().stream()
                .map(contry -> new ContryDto(
                        contry.getId(),
                        contry.getAmount(),
                        contry.getCountryDate(),
                        contry.getNumberOfInst(),
                        member.getId()
                ))
                .collect(Collectors.toList());

        return new MemberDto(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getPhoneNumber(),
                member.getAddress(),
                member.getAmountReceived(),
                member.getMaturityAmount(),
                member.getStatus(),
                member.getDateJoined(),
                member.getMaturityDate(),
                member.getTodo() != null ? member.getTodo().getId() : null,
                contributions
        );
    }
}