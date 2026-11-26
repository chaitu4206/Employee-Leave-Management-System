
package elms_backend.repository;

import elms_backend.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByEmployeeEmail(String employeeEmail);

    List<Leave> findByStatus(String status);

}
