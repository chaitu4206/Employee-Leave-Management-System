
package elms_backend.service;

import elms_backend.entity.LeaveBalance;
import elms_backend.repository.LeaveBalanceRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
public class LeaveBalanceService {

    private final LeaveBalanceRepository balanceRepository;

    public LeaveBalanceService(LeaveBalanceRepository balanceRepository) {
        this.balanceRepository = balanceRepository;
    }

    // Allocate default leave balances to an employee
    @Transactional
    public void createDefaultBalances(String employeeEmail) {

        int currentYear = Year.now().getValue();

        createBalance(employeeEmail, "CASUAL", 12, currentYear);
        createBalance(employeeEmail, "SICK", 10, currentYear);
        createBalance(employeeEmail, "EARNED", 15, currentYear);
    }

    private void createBalance(
            String email, String type, int days, int year) {

        boolean exists = balanceRepository
            .findByEmployeeEmailAndLeaveTypeAndYear(email, type, year)
            .isPresent();

        if (!exists) {
            LeaveBalance balance = new LeaveBalance();
            balance.setEmployeeEmail(email);
            balance.setLeaveType(type);
            balance.setTotalDays(days);
            balance.setUsedDays(0);
            balance.setYear(year);

            balanceRepository.save(balance);
        }
    }

    // Get all leave balances for an employee
    public List<LeaveBalance> getEmployeeBalances(String email) {
        return balanceRepository.findByEmployeeEmail(email);
    }

    // Deduct approved leave days
    @Transactional
    public void deductLeave(
            String employeeEmail,
            String leaveType,
            int days,
            int year) {

        if (days <= 0) {
            throw new RuntimeException("Invalid number of leave days");
        }

        LeaveBalance balance = balanceRepository
            .findByEmployeeEmailAndLeaveTypeAndYear(
                employeeEmail, leaveType, year
            )
            .orElseThrow(() ->
                new RuntimeException("Leave balance not found")
            );

        if (balance.getRemainingDays() < days) {
            throw new RuntimeException("Insufficient leave balance");
        }

        balance.setUsedDays(balance.getUsedDays() + days);

        balanceRepository.save(balance);
    }
}
