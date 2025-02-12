package com.example.biceedesktop.controller;

import com.example.biceedesktop.dto.BidDto;
import com.example.biceedesktop.entity.Bid;
import com.example.biceedesktop.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    // Create a new bid
    @PostMapping
    public ResponseEntity<BidDto> createBid(@RequestBody BidDto bidDto) {
        BidDto createdBid = bidService.addBid(bidDto);
        return new ResponseEntity<>(createdBid, HttpStatus.CREATED);
    }

    // Get a bid by ID
    @GetMapping("/{id}")
    public ResponseEntity<BidDto> getBidById(@PathVariable Long id) {
        BidDto bidDto = bidService.getBid(id);
        return new ResponseEntity<>(bidDto, HttpStatus.OK);
    }

    // Update a bid by ID
    @PutMapping("/{id}")
    public ResponseEntity<BidDto> updateBid(@PathVariable Long id, @RequestBody BidDto bidDto) {
        BidDto updatedBid = bidService.updateBid(bidDto, id);
        return new ResponseEntity<>(updatedBid, HttpStatus.OK);
    }

    // Delete a bid by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBid(@PathVariable Long id) {
        bidService.deleteBid(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/todo/{id}")
    public ResponseEntity<List<Bid>> getBidsByTodoId(@PathVariable Long id) {
        List<Bid> bids = bidService.getBidsByTodoId(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}