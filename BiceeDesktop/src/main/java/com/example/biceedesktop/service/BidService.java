package com.example.biceedesktop.service;

import com.example.biceedesktop.dto.BidDto;
import com.example.biceedesktop.dto.BidDto;
import com.example.biceedesktop.entity.Bid;

import java.util.List;

public interface BidService {

    BidDto addBid(BidDto BidDto);

    BidDto getBid(Long id);

//    List<BidDto> getBidByMemberId(Long id);
//
//    List<BidDto> getAllBids();

    BidDto updateBid(BidDto BidDto, Long id);

    void deleteBid(Long id);

    List<Bid> getBidsByTodoId(Long id);
}
