package com.library.management.repository;

import com.library.management.dto.UserDTO;
import com.library.management.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByUsernameIgnoreCase(String username);

    @Query("""
            SELECT new com.library.management.dto.UserDTO(
                u.id,
                u.username,
                u.name,
                u.email,
                u.phone,
                u.address,
                u.membershipDate
            )
            FROM User u
            ORDER BY u.id DESC
            """)
    List<UserDTO> findAllDtos();

    @Query("""
            SELECT new com.library.management.dto.UserDTO(
                u.id,
                u.username,
                u.name,
                u.email,
                u.phone,
                u.address,
                u.membershipDate
            )
            FROM User u
            WHERE u.id = :id
            """)
    Optional<UserDTO> findDtoById(@Param("id") Long id);
}

