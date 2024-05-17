package ru.locate.garbage.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.locate.garbage.server.model.ImageFromWorker;
import ru.locate.garbage.server.model.Point;

import java.util.List;

public interface ImageFromWorkerRepository extends JpaRepository<ImageFromWorker, Long> {

    List<ImageFromWorker> findAllByPoint(Point point);
}
