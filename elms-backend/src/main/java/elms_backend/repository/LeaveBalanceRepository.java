
package elms_backend.repository;

import elms_backend.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepository
        extends JpaRepository<LeaveBalance, Long> {

    List<LeaveBalance> findByEmployeeEmail(String employeeEmail);

    Optional<LeaveBalance> findByEmployeeEmailAndLeaveTypeAndYear(
        String employeeEmail,
        String leaveType,
        int year
    );
}
