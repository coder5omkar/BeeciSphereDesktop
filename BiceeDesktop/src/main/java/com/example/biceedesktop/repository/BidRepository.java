package com.example.biceedesktop.repository;

import com.example.biceedesktop.entity.Bid;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BidRepository  extends CrudRepository<Bid, Long> {

    // Find all bids by todoId
    List<Bid> findByTodoId(Long todoId);
}
