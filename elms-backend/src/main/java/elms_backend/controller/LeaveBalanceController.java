
package elms_backend.controller;

import elms_backend.entity.LeaveBalance;
import elms_backend.service.LeaveBalanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/balances")
public class LeaveBalanceController {

    private final LeaveBalanceService balanceService;

    public LeaveBalanceController(LeaveBalanceService balanceService) {
        this.balanceService = balanceService;
    }

    // Employee views their own leave balances
    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<LeaveBalance>> getMyBalances(
            Authentication authentication) {

        return ResponseEntity.ok(
            balanceService.getEmployeeBalances(authentication.getName())
        );
    }
}
