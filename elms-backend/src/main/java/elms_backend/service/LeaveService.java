
package elms_backend.service;

import elms_backend.entity.Leave;
import elms_backend.repository.LeaveRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeaveBalanceService balanceService;

    public LeaveService(
            LeaveRepository leaveRepository,
            LeaveBalanceService balanceService) {
        this.leaveRepository = leaveRepository;
        this.balanceService = balanceService;
    }

    // Apply for leave
    public Leave applyLeave(Leave leave) {

        if (leave.getStartDate() == null ||
            leave.getEndDate() == null ||
            leave.getStartDate().isAfter(leave.getEndDate())) {
            throw new RuntimeException("Invalid leave dates");
        }

        if (!List.of("CASUAL", "SICK", "EARNED")
                .contains(leave.getLeaveType())) {
            throw new RuntimeException("Invalid leave type");
        }

        leave.setStatus("PENDING");

        return leaveRepository.save(leave);
    }

    // View all leave requests
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // View employee's leave requests
    public List<Leave> getEmployeeLeaves(String email) {
        return leaveRepository.findByEmployeeEmail(email);
    }

    // View pending leave requests
    public List<Leave> getPendingLeaves() {
        return leaveRepository.findByStatus("PENDING");
    }

    // Approve or reject leave
    @Transactional
    public Leave updateLeaveStatus(Long id, String status) {

        Leave leave = leaveRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Leave request not found")
            );

        if (!"PENDING".equals(leave.getStatus())) {
            throw new RuntimeException(
                "This leave request has already been processed"
            );
        }

        if (!"APPROVED".equals(status) &&
            !"REJECTED".equals(status)) {
            throw new RuntimeException("Invalid leave status");
        }

        if ("APPROVED".equals(status)) {

            int days = (int) ChronoUnit.DAYS.between(
                leave.getStartDate(),
                leave.getEndDate()
            ) + 1;

            int year = leave.getStartDate().getYear();

            balanceService.deductLeave(
                leave.getEmployeeEmail(),
                leave.getLeaveType(),
                days,
                year
            );
        }

        leave.setStatus(status);

        return leaveRepository.save(leave);
    }
}
