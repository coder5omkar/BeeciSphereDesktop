package com.example.biceedesktop.helper;

import com.example.biceedesktop.dto.MemberDto;
import com.example.biceedesktop.entity.MemberStatus;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ExcelHelper {

    public static List<MemberDto> excelToMembers(InputStream inputStream) {
        List<MemberDto> members = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0); // Assuming the data is in the first sheet

            // Iterate through each row in the sheet
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue; // Skip the header row
                }

                // Create a new MemberDto object for each row
                MemberDto member = new MemberDto();

                // Map each cell to the corresponding field in MemberDto
                member.setId(getLongValue(row.getCell(0))); // ID
                member.setName(getStringValue(row.getCell(1))); // Name
                member.setEmail(getStringValue(row.getCell(2))); // Email
                member.setPhoneNumber(getStringValue(row.getCell(3))); // Phone Number
                member.setAddress(getStringValue(row.getCell(4))); // Address
                member.setAmountReceived(getBigDecimalValue(row.getCell(5))); // Amount Received
                member.setMaturityAmount(getBigDecimalValue(row.getCell(6))); // Maturity Amount
                member.setStatus(MemberStatus.ACTIVE); // Status
                member.setDateJoined(new Date()); // Date Joined
                member.setMaturityDate(getDateValue(row.getCell(9))); // Maturity Date
                member.setTodoId(getLongValue(row.getCell(10))); // Todo ID
                member.setTotalDiscount(getBigDecimalValue(row.getCell(11))); // Total Discount

                // Add the member to the list
                members.add(member);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage(), e);
        }

        return members;
    }

    // Helper method to get a String value from a cell
    private static String getStringValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue();
    }

    // Helper method to get a Long value from a cell
    private static Long getLongValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        cell.setCellType(CellType.NUMERIC);
        return (long) cell.getNumericCellValue();
    }

    // Helper method to get a BigDecimal value from a cell
    private static BigDecimal getBigDecimalValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        cell.setCellType(CellType.NUMERIC);
        return BigDecimal.valueOf(cell.getNumericCellValue());
    }

    // Helper method to get a Date value from a cell
    private static Date getDateValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        return cell.getDateCellValue();
    }

    // Helper method to get a MemberStatus value from a cell
//    private static MemberStatus getMemberStatusValue(Cell cell) {
//        if (cell == null) {
//            return null;
//        }
//        cell.setCellType(CellType.STRING);
//        String status = cell.getStringCellValue();
//        return MemberStatus.valueOf(status.toUpperCase()); // Assuming MemberStatus is an enum
//    }
}
