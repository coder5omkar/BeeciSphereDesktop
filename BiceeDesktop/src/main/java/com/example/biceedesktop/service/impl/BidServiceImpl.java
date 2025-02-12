package com.example.biceedesktop.service.impl;

import com.example.biceedesktop.dto.BidDto;
import com.example.biceedesktop.entity.Bid;
import com.example.biceedesktop.entity.Frequency;
import com.example.biceedesktop.entity.Member;
import com.example.biceedesktop.entity.Todo;
import com.example.biceedesktop.exception.ResourceNotFoundException;
import com.example.biceedesktop.repository.BidRepository;
import com.example.biceedesktop.repository.MemberRepository;
import com.example.biceedesktop.repository.TodoRepository;
import com.example.biceedesktop.service.BidService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

import static com.example.biceedesktop.entity.Frequency.*;

@Service
public class BidServiceImpl implements BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private EntityManager entityManager;

    @Override
    public BidDto addBid(BidDto bidDto) {
        Bid bid = mapToEntity(bidDto);

        Member member = memberRepository.findById(bidDto.getBidWinner())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + bidDto.getBidWinner()));

        Todo todo = todoRepository.findById(bidDto.getTodoId())
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + bidDto.getTodoId()));

        // Determine next installment date based on frequency
        LocalDate nextInstDate = calculateNextInstDate(todo.getCurrentInstDate(), todo.getFrequency());
        BigDecimal nextInstAmount = BigDecimal.valueOf(bidDto.getBidAmount())
                .divide(BigDecimal.valueOf(todo.getNumberOfInstallments()), RoundingMode.HALF_UP)
                .setScale(0, RoundingMode.HALF_UP); // Ensures a whole number

        // Update Todo entity
        todo.setNextInstDate(nextInstDate);
        todo.setNextInstAmount(nextInstAmount);
        todoRepository.save(todo);

        // Set bid details
        bid.setMember(member);
        bid.setTodo(todo);

        Bid savedBid = bidRepository.save(bid);
        return mapToDto(savedBid);
    }

    // Helper method to calculate next installment date
    private LocalDate calculateNextInstDate(LocalDate currentInstDate, Frequency frequency) {
        if (currentInstDate == null) {
            currentInstDate = LocalDate.now(); // Default to today if null
        }

        return switch (frequency) {
            case WEEKLY -> currentInstDate.plusDays(7);
            case BIWEEKLY -> currentInstDate.plusDays(14);
            case MONTHLY -> currentInstDate.plusMonths(30);
            case TENDAYS -> currentInstDate.plusDays(10);
            case YEARLY -> currentInstDate.plusYears(365);
        };
    }


    @Override
    public BidDto getBid(java.lang.Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + id));
        return mapToDto(bid);
    }

//    @Override
//    public List<BidDto> getBidByMemberId(Long id) {
//        return bidRepository.findByMemberId(id)
//                .stream()
//                .map(this::mapToDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<BidDto> getAllBids() {
//        return bidRepository.findAll()
//                .stream()
//                .map(this::mapToDto)
//                .collect(Collectors.toList());
//    }

    @Override
    public BidDto updateBid(BidDto bidDto, java.lang.Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + id));
        bid.setAmount(bidDto.getBidAmount());
        bid.setBidDate(bidDto.getBidDate());
        Bid updatedBid = bidRepository.save(bid);
        return mapToDto(updatedBid);
    }

    @Override
    @Transactional
    public void deleteBid(java.lang.Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + id));

        // Remove the reference from the Member entity
        if (bid.getMember() != null) {
            bid.getMember().setBid(null);
        }

        // Remove the reference from the Todo entity
        if (bid.getTodo() != null) {
            bid.getTodo().getBids().remove(bid);
        }
        bidRepository.delete(bid);
    }

    // Get all bids for a specific todoId
    public List<Bid> getBidsByTodoId(Long todoId) {
        return bidRepository.findByTodoId(todoId);
    }

    private BidDto mapToDto(Bid bid) {
        return new BidDto(
                bid.getId(),
                bid.getAmount(),
                bid.getBidDate(),
                bid.getTodo().getId(),
                bid.getMember().getId()
        );
    }

    private Bid mapToEntity(BidDto bidDto) {
        Bid bid = new Bid();
        bid.setAmount(bidDto.getBidAmount());
        bid.setBidDate(bidDto.getBidDate());
        return bid;
    }
}
