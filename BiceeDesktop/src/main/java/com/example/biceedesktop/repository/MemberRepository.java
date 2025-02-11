package com.example.biceedesktop.repository;

import com.example.biceedesktop.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findBytodoId(Long todoId);

    void deleteByTodoId(Long todoId);

    Optional<Member> findByEmail(String email);
}
