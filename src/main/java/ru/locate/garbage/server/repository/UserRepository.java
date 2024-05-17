package ru.locate.garbage.server.repository;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.locate.garbage.server.model.MyUser;


import java.util.Optional;

public interface UserRepository extends JpaRepository <MyUser,Long> {

    Optional<MyUser> findByName(String username);

    @NonNull
    Optional<MyUser> findById(Long id);
}


