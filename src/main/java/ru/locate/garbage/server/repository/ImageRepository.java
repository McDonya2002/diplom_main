package ru.locate.garbage.server.repository;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.locate.garbage.server.model.ImageFromUser;
import ru.locate.garbage.server.model.Point;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<ImageFromUser, Long> {

    @NonNull
    Optional<ImageFromUser> findById(@NonNull Long id);

    List<ImageFromUser> findByPoint(Point point);
}
