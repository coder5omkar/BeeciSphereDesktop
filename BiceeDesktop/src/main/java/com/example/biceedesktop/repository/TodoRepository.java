package com.example.biceedesktop.repository;


import com.example.biceedesktop.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {

}
