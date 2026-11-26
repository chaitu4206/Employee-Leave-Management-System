
package elms_backend.controller;

import elms_backend.entity.Leave;
import elms_backend.service.LeaveService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // Employee applies for leave
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Leave> applyLeave(
            @RequestBody Leave leave,
            Authentication authentication) {

        // Get employee email from authenticated JWT
        // Prevent employees from applying on behalf of others
        leave.setEmployeeEmail(authentication.getName());

        return ResponseEntity.ok(
            leaveService.applyLeave(leave)
        );
    }

    // Employee views their own leave requests
    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<Leave>> getMyLeaves(
            Authentication authentication) {

        return ResponseEntity.ok(
            leaveService.getEmployeeLeaves(authentication.getName())
        );
    }

    // Manager or Admin views pending requests
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<Leave>> getPendingLeaves() {

        return ResponseEntity.ok(
            leaveService.getPendingLeaves()
        );
    }

    // Manager or Admin approves/rejects leave requests
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Leave> updateLeaveStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        return ResponseEntity.ok(
            leaveService.updateLeaveStatus(
                id,
                request.get("status")
            )
        );
    }
}
