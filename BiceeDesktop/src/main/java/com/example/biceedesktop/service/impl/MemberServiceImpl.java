package com.example.biceedesktop.service.impl;

import com.example.biceedesktop.dto.BidDto;
import com.example.biceedesktop.dto.ContryDto;
import com.example.biceedesktop.dto.MemberDto;
import com.example.biceedesktop.entity.Contry;
import com.example.biceedesktop.entity.Member;
import com.example.biceedesktop.entity.Todo;
import com.example.biceedesktop.exception.ResourceNotFoundException;
import com.example.biceedesktop.repository.MemberRepository;
import com.example.biceedesktop.repository.TodoRepository;
import com.example.biceedesktop.service.MemberService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private TodoRepository todoRepository;

    @Override
    public MemberDto addMember(MemberDto memberDto) {
        // Check if a member with the same email already exists
//                Optional<Member> existingMember = memberRepository.findByEmail(memberDto.getEmail());
//        if (existingMember.isPresent()) {
//            throw new RuntimeException("A member with the email " + memberDto.getEmail() + " already exists.");
//        }

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
            Long id = memberDto.getTodoId();
            Todo todo = todoRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Todo not found with ID: " + id));
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
    public void deleteMember(java.lang.Long id) {
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

    @Transactional
    @Override
    public void saveAll(List<MemberDto> memberDtos, Long todoId) {
        // Fetch the Todo entity
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + todoId));

        // Convert DTOs to entities
        List<Member> members = memberDtos.stream().map(memberDto -> {
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
            member.setTodo(todo); // Associate with the given Todo
            return member;
        }).collect(Collectors.toList());

        // Save all members
        memberRepository.saveAll(members);
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
                null ,// Contributions are not mapped here
                null
        );
    }

    private MemberDto mapToMemberDtoWithContributions(Member member) {
        MemberDto memberDto = new MemberDto();
        memberDto.setId(member.getId());
        memberDto.setName(member.getName());
        memberDto.setEmail(member.getEmail());
        memberDto.setPhoneNumber(member.getPhoneNumber());
        memberDto.setAddress(member.getAddress());
        memberDto.setAmountReceived(member.getAmountReceived());
        memberDto.setMaturityAmount(member.getMaturityAmount());
        memberDto.setStatus(member.getStatus());
        memberDto.setDateJoined(member.getDateJoined());
        memberDto.setMaturityDate(member.getMaturityDate());
        memberDto.setTodoId(member.getTodo() != null ? member.getTodo().getId() : null);

        List<ContryDto> contributions = null;
        // Map contributions
        if (member.getCountrys() != null) {
            contributions = member.getCountrys().stream()
                    .map(this::mapToContryDto) // Use the mapToContryDto method
                    .collect(Collectors.toList());
            memberDto.setContributions(contributions);
        }
        // Calculate total discount
        BigDecimal totalDiscount = contributions.stream()
                .map(ContryDto::getDiscount) // Extract discount values
                .filter(Objects::nonNull) // Handle null values
                .reduce(BigDecimal.ZERO, BigDecimal::add); // Sum all discounts
        memberDto.setTotalDiscount(totalDiscount);
        // Map bid
        if (member.getBid() != null) {
            BidDto bidDto = new BidDto();
            bidDto.setId(member.getBid().getId());
            bidDto.setBidDate(member.getBid().getBidDate());
            bidDto.setBidAmount(member.getBid().getAmount());
            bidDto.setBidWinner(member.getBid().getMember().getId());
            memberDto.setBid(bidDto);
        }

        return memberDto;
    }

    private ContryDto mapToContryDto(Contry contry) {
        ContryDto contryDto = new ContryDto();
        contryDto.setId(contry.getId());
        contryDto.setAmount(contry.getAmount());
        contryDto.setCountryDate(contry.getCountryDate());
        contryDto.setNumberOfInst(contry.getNumberOfInst());
        contryDto.setDiscount(contry.getDiscount());
        return contryDto;

    }
}