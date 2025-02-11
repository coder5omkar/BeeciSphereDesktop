package com.example.biceedesktop.service.impl;

import com.example.biceedesktop.dto.TodoDto;
import com.example.biceedesktop.entity.Bid;
import com.example.biceedesktop.entity.Member;
import com.example.biceedesktop.entity.Todo;
import com.example.biceedesktop.exception.ResourceNotFoundException;
import com.example.biceedesktop.repository.ContryRepository;
import com.example.biceedesktop.repository.MemberRepository;
import com.example.biceedesktop.repository.TodoRepository;
import com.example.biceedesktop.service.TodoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoServiceImpl implements TodoService {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ContryRepository contryRepository;

    @Override
    public TodoDto addTodo(TodoDto todoDto) {
        Todo todo = mapToEntity(todoDto);
        Todo savedTodo = todoRepository.save(todo);
        return mapToDto(savedTodo);
    }

    @Override
    public TodoDto getTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        return mapToDto(todo);
    }

    @Override
    public List<TodoDto> getAllTodos() {
        return todoRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TodoDto updateTodo(TodoDto todoDto, Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todo.setTitle(todoDto.getTitle());
        todo.setDescription(todoDto.getDescription());
        todo.setFrequency(todoDto.getFrequency());
        todo.setCompleted(todoDto.isCompleted());
        todo.setNumberOfInstallments(todoDto.getNumberOfInstallments());
        todo.setBcAmount(todoDto.getBcAmount());
        todo.setStartDate(todoDto.getStartDate());
        todo.setEndDate(todoDto.getEndDate());
        todo.setCurrentInstDate(todoDto.getCurrentInstDate());
        todo.setCurrentInstAmount(todoDto.getCurrentInstAmount());
        todo.setNextInstAmount(todoDto.getNextInstAmount());
        todo.setNextInstDate(todoDto.getNextInstDate());

        Todo updatedTodo = todoRepository.save(todo);
        return mapToDto(updatedTodo);
    }

    @Transactional
    @Override
    public void deleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        // Delete related country records
        for (Member member : todo.getMembers()) {
            contryRepository.deleteByMemberId(member.getId());
        }

        // Delete all members linked to this Todo
        memberRepository.deleteByTodoId(todo.getId());

        // Delete the Todo
        todoRepository.delete(todo);
    }

    @Override
    public TodoDto completeTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        todo.setCompleted(true);
        return mapToDto(todoRepository.save(todo));
    }

    @Override
    public TodoDto inCompleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        todo.setCompleted(false);
        return mapToDto(todoRepository.save(todo));
    }

    private TodoDto mapToDto(Todo todo) {
        return new TodoDto(
                todo.getId(), todo.getTitle(), todo.getDescription(), todo.getFrequency(),
                todo.getNumberOfInstallments(), todo.getBcAmount(), todo.isCompleted(),
                todo.getStartDate(), todo.getEndDate(), todo.getCurrentInstDate(),
                todo.getCurrentInstAmount(), todo.getNextInstAmount(), todo.getNextInstDate(),
                todo.getBids().stream().map(Bid::getId).collect(Collectors.toList()),
                todo.getMembers().stream().map(Member::getId).collect(Collectors.toList())
        );
    }

    private Todo mapToEntity(TodoDto todoDto) {
        return new Todo(null, todoDto.getTitle(), todoDto.getDescription(), todoDto.getFrequency(),
                todoDto.getNumberOfInstallments(), todoDto.getBcAmount(),
                todoDto.getStartDate(), todoDto.getEndDate(), todoDto.getCurrentInstDate(),
                todoDto.getCurrentInstAmount(), todoDto.getNextInstAmount(), todoDto.getNextInstDate(),
                todoDto.isCompleted(), null, null);
    }
}
