package com.example.biceedesktop.service.impl;

import com.example.biceedesktop.dto.BidDto;
import com.example.biceedesktop.entity.Bid;
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

import java.util.List;

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

        bid.setMember(member);
        bid.setTodo(todo);
        Bid savedBid = bidRepository.save(bid);
        return mapToDto(savedBid);
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

        // Detach relations before deleting
        bid.setMember(null);
        bid.setTodo(null);

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
