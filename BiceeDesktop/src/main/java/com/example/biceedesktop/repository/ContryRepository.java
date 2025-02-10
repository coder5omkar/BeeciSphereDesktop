package com.example.biceedesktop.repository;

import com.example.biceedesktop.entity.Contry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContryRepository extends JpaRepository<Contry, Long> {

    List<Contry> findByMemberId(Long memberId);
    void deleteByMemberId(Long memberId);
}
