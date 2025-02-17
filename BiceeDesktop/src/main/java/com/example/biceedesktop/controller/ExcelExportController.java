package com.example.biceedesktop.controller;

import com.example.biceedesktop.entity.*;
import com.example.biceedesktop.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/excel")
public class ExcelExportController {

    private final MemberRepository memberRepository;
    private final BidRepository bidRepository;
    private final TodoRepository todoRepository;
    private final ContryRepository contryRepository;

    public ExcelExportController(MemberRepository memberRepository,
                                 BidRepository bidRepository,
                                 TodoRepository todoRepository,
                                 ContryRepository contryRepository) {
        this.memberRepository = memberRepository;
        this.bidRepository = bidRepository;
        this.todoRepository = todoRepository;
        this.contryRepository = contryRepository;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportToExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {

            // Create sheets for each entity
            writeMembersSheet(workbook, memberRepository.findAll());
            writeBidsSheet(workbook, bidRepository.findAll());
            writeTodosSheet(workbook, todoRepository.findAll());
            writeContrySheet(workbook, contryRepository.findAll());

            // Convert to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            byte[] excelBytes = outputStream.toByteArray();

            // Set headers for file download
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=exported_data.xlsx");
            headers.add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private void writeMembersSheet(Workbook workbook, List<Member> members) {
        Sheet sheet = workbook.createSheet("Members");
        Row header = sheet.createRow(0);
        String[] columns = {"ID", "Name", "Email", "Phone", "Address", "Status"};
        createHeaderRow(header, columns);

        int rowNum = 1;
        for (Member member : members) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(member.getId());
            row.createCell(1).setCellValue(member.getName());
            row.createCell(2).setCellValue(member.getEmail());
            row.createCell(3).setCellValue(member.getPhoneNumber());
            row.createCell(4).setCellValue(member.getAddress());
            row.createCell(5).setCellValue(member.getStatus().name());
        }
    }

    private void writeBidsSheet(Workbook workbook, List<Bid> bids) {
        Sheet sheet = workbook.createSheet("Bids");
        Row header = sheet.createRow(0);
        String[] columns = {"ID", "Amount", "Bid Date", "Todo ID", "Member ID"};
        createHeaderRow(header, columns);

        int rowNum = 1;
        for (Bid bid : bids) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(bid.getId());
            row.createCell(1).setCellValue(bid.getAmount());
            row.createCell(2).setCellValue(bid.getBidDate() != null ? bid.getBidDate().toString() : "");
            row.createCell(3).setCellValue(bid.getTodo() != null ? bid.getTodo().getId() : null);
            row.createCell(4).setCellValue(bid.getMember() != null ? bid.getMember().getId() : null);
        }
    }

    private void writeTodosSheet(Workbook workbook, List<Todo> todos) {
        Sheet sheet = workbook.createSheet("Todos");
        Row header = sheet.createRow(0);
        String[] columns = {"ID", "Title", "Description", "Frequency", "Installments", "Completed"};
        createHeaderRow(header, columns);

        int rowNum = 1;
        for (Todo todo : todos) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(todo.getId());
            row.createCell(1).setCellValue(todo.getTitle());
            row.createCell(2).setCellValue(todo.getDescription());
            row.createCell(3).setCellValue(todo.getFrequency().name());
            row.createCell(4).setCellValue(todo.getNumberOfInstallments());
            row.createCell(5).setCellValue(todo.isCompleted());
        }
    }

    private void writeContrySheet(Workbook workbook, List<Contry> countrys) {
        Sheet sheet = workbook.createSheet("Contry");
        Row header = sheet.createRow(0);
        String[] columns = {"ID", "Amount", "Date", "Number of Inst.", "Member ID", "Discount"};
        createHeaderRow(header, columns);

        int rowNum = 1;
        for (Contry contry : countrys) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(contry.getId() != null ? contry.getId().toString() : "");
            row.createCell(1).setCellValue(contry.getAmount() != null ? contry.getAmount().toString() : "");
            row.createCell(2).setCellValue(contry.getCountryDate() != null ? contry.getCountryDate().toString() : "");
            row.createCell(3).setCellValue(contry.getNumberOfInst() != null ? contry.getNumberOfInst() : 0);
            row.createCell(4).setCellValue(contry.getMember() != null && contry.getMember().getId() != null
                    ? contry.getMember().getId().toString() : "");
            row.createCell(5).setCellValue(contry.getDiscount() != null ? contry.getDiscount().toString() : "");
        }
    }


    private void createHeaderRow(Row header, String[] columnNames) {
        CellStyle style = header.getSheet().getWorkbook().createCellStyle();
        Font font = header.getSheet().getWorkbook().createFont();
        font.setBold(true);
        style.setFont(font);

        for (int i = 0; i < columnNames.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columnNames[i]);
            cell.setCellStyle(style);
        }
    }
}
