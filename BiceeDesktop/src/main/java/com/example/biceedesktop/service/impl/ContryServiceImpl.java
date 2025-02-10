package com.example.biceedesktop.service.impl;

import com.example.biceedesktop.dto.ContryDto;
import com.example.biceedesktop.entity.Contry;
import com.example.biceedesktop.entity.Member;
import com.example.biceedesktop.exception.ResourceNotFoundException;
import com.example.biceedesktop.repository.ContryRepository;
import com.example.biceedesktop.repository.MemberRepository;
import com.example.biceedesktop.service.ContryService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContryServiceImpl implements ContryService {

    @Autowired
    private  ContryRepository contryRepository;

    @Autowired
    private  MemberRepository memberRepository;

    @Autowired
    private EntityManager entityManager;

    @Override
    public ContryDto addContry(ContryDto contryDto) {
        Contry contry = mapToEntity(contryDto);
        Member member = memberRepository.getById(contryDto.getMemberId());
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


    private ContryDto mapToDto(Contry contry) {
        return new ContryDto(
                contry.getId(),
                contry.getAmount(),
                contry.getCountryDate(),
                contry.getNumberOfInst(),
                contry.getMember().getId()
        );
    }

    private Contry mapToEntity(ContryDto contryDto) {
        Contry contry = new Contry();
        contry.setAmount(contryDto.getAmount());
        contry.setCountryDate(contryDto.getCountryDate());
        contry.setNumberOfInst(contryDto.getNumberOfInst());
        return contry;
    }
}
