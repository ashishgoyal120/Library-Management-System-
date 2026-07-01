package com.library.management.repository;

import com.library.management.model.AdminUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByEmailIgnoreCase(String email);

    Optional<AdminUser> findByUsernameIgnoreCase(String username);
}
