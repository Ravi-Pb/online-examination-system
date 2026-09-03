package com.example.oes.dto;

public class UserResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String userRole;
    private String accountStatus;

    public UserResponse() {
    }

    public UserResponse(
            Long userId,
            String fullName,
            String email,
            String userRole,
            String accountStatus
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.userRole = userRole;
        this.accountStatus = accountStatus;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }


}