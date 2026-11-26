
package elms_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "leave_balances",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"employee_email", "leave_type", "year"}
        )
    }
)
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_email", nullable = false)
    private String employeeEmail;

    @Column(name = "leave_type", nullable = false)
    private String leaveType;

    @Column(nullable = false)
    private int totalDays;

    @Column(nullable = false)
    private int usedDays = 0;

    @Column(nullable = false)
    private int year;

    public LeaveBalance() {
    }

    public Long getId() {
        return id;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public int getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(int totalDays) {
        this.totalDays = totalDays;
    }

    public int getUsedDays() {
        return usedDays;
    }

    public void setUsedDays(int usedDays) {
        this.usedDays = usedDays;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    @Transient
    public int getRemainingDays() {
        return totalDays - usedDays;
    }
}
