package com.example.biceedesktop.service.impl;

import com.example.biceedesktop.dto.TodoDto;
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
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id:" + id));
        return mapToDto(todo);
    }

    @Override
    public List<TodoDto> getAllTodos() {
        List<Todo> todos = todoRepository.findAll();
        return todos.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public TodoDto updateTodo(TodoDto todoDto, Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id : " + id));

        todo.setTitle(todoDto.getTitle());
        todo.setDescription(todoDto.getDescription());
        todo.setFrequency(todoDto.getFrequency());
        todo.setCompleted(todoDto.isCompleted());
        todo.setNumberOfInstallments(todoDto.getNumberOfInstallments());
        todo.setBcAmount(todoDto.getBcAmount());
        todo.setStartDate(todoDto.getStartDate());
        todo.setEndDate(todoDto.getEndDate());

        Todo updatedTodo = todoRepository.save(todo);
        return mapToDto(updatedTodo);
    }

    @Transactional
    @Override
    public void deleteTodo(Long id) {
        // Step 1: Fetch the Todo entity
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        // Step 2: Delete countries linked to members
        for (Member member : todo.getMembers()) {
            contryRepository.deleteByMemberId(member.getId());
        }

        // Step 3: Delete all members linked to this Todo
        memberRepository.deleteByTodoId(todo.getId());

        // Step 4: Clear the members list from the Todo entity
        todo.getMembers().clear();

        // Step 5: Save the Todo entity to update the relationship (optional)
        todoRepository.save(todo);

        // Step 6: Finally, delete the Todo
        todoRepository.delete(todo);
    }


    @Override
    public TodoDto completeTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id : " + id));
        todo.setCompleted(true);
        Todo updatedTodo = todoRepository.save(todo);
        return mapToDto(updatedTodo);
    }

    @Override
    public TodoDto inCompleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id : " + id));
        todo.setCompleted(false);
        Todo updatedTodo = todoRepository.save(todo);
        return mapToDto(updatedTodo);
    }

    private TodoDto mapToDto(Todo todo) {
        return new TodoDto(todo.getId(), todo.getTitle(), todo.getDescription(), todo.getFrequency(),
                todo.getNumberOfInstallments(), todo.getBcAmount(), todo.isCompleted(),
                todo.getStartDate(), todo.getEndDate());
    }

    private Todo mapToEntity(TodoDto todoDto) {
        return new Todo(null, todoDto.getTitle(), todoDto.getDescription(), todoDto.getFrequency(),
                todoDto.getNumberOfInstallments(), todoDto.getBcAmount(),
                todoDto.getStartDate(), todoDto.getEndDate(),
                todoDto.isCompleted(), null);
    }
}
