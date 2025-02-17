package com.example.biceedesktop.service.impl;

import com.example.biceedesktop.dto.ContryDto;
import com.example.biceedesktop.entity.Contry;
import com.example.biceedesktop.entity.Member;
import com.example.biceedesktop.entity.Todo;
import com.example.biceedesktop.exception.ResourceNotFoundException;
import com.example.biceedesktop.repository.ContryRepository;
import com.example.biceedesktop.repository.MemberRepository;
import com.example.biceedesktop.repository.TodoRepository;
import com.example.biceedesktop.service.ContryService;
import com.example.biceedesktop.service.MemberService;
import com.example.biceedesktop.service.TodoService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContryServiceImpl implements ContryService {

    @Autowired
    private  ContryRepository contryRepository;

    @Autowired
    private  MemberRepository memberRepository;

    @Autowired
    private TodoRepository todoRepository;

    @Override
    public ContryDto addContry(ContryDto contryDto) {
        Contry contry = mapToEntity(contryDto);
        Member member = memberRepository.getById(contryDto.getMemberId());
        List<ContryDto> countries = contryRepository.findByMemberId(contryDto.getMemberId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        contry.setNumberOfInst((short) (countries.size() + 1));

        Todo todo = todoRepository.getById(member.getTodo().getId());
        BigDecimal installment = todo.getBcAmount();
        installment = installment.subtract(new BigDecimal(contryDto.getAmount()));
        contry.setDiscount(installment);
        contry.setMember(member);
        Contry savedContry = contryRepository.save(contry);
        return mapToDto(savedContry);
    }

    @Override
    public ContryDto getContry(Long id) {
        Contry contry = contryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contry not found with id: " + id));
        return mapToDto(contry);
    }

    @Override
    public List<ContryDto> getContryByMemberId(Long id) {
        return contryRepository.findByMemberId(id)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ContryDto> getAllContrys() {
        return contryRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ContryDto updateContry(ContryDto contryDto, Long id) {
        Contry contry = contryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contry not found with id: " + id));
        contry.setAmount(contryDto.getAmount());
        contry.setNumberOfInst(contryDto.getNumberOfInst());
        contry.setCountryDate(contryDto.getCountryDate());
        Contry updatedContry = contryRepository.save(contry);
        return mapToDto(updatedContry);
    }

    @Override
    @Transactional
    public void deleteContry(Long id) {
        Contry contry = contryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contry not found with id: " + id));

        // Detach the Member before deleting Contry
        contry.setMember(null);

        contryRepository.delete(contry);
    }

    @Transactional
    @Override
    public void addBulkContributions(Long todoId, List<Long> memberIds, double amount) {
        for (Long memberId : memberIds) {
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));
            List<ContryDto> countries = contryRepository.findByMemberId(member.getId())
                    .stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());

            Contry contry = new Contry();
            contry.setMember(member);
            contry.setAmount(BigInteger.valueOf((long) amount));
            contry.setCountryDate(new Date());
            contry.setNumberOfInst((short) (countries.size() + 1));
            contryRepository.save(contry);
        }
    }

    private ContryDto mapToDto(Contry contry) {
        return new ContryDto(
                contry.getId(),
                contry.getAmount(),
                contry.getCountryDate(),
                contry.getNumberOfInst(),
                contry.getMember().getId(),
                contry.getDiscount()
        );
    }

    private Contry mapToEntity(ContryDto contryDto) {
        Contry contry = new Contry();
        contry.setAmount(contryDto.getAmount());
        contry.setCountryDate(contryDto.getCountryDate());
        contry.setNumberOfInst((short) 0);
        return contry;
    }
}
