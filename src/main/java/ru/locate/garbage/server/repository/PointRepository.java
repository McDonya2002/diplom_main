package ru.locate.garbage.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import ru.locate.garbage.server.model.MyUser;
import ru.locate.garbage.server.model.Point;

import java.util.List;

public interface PointRepository extends JpaRepository<Point,Long> {

    List<Point>findAllByIdNotNull();

    List<Point>findAllByStatusForAdmin(String status);

    List<Point>findByLatitudeAndLongitude(double Latitude, double Longitude);

    List<Point>findByUserId(Long user_id);

    Point getPointById(Long id);

    @Query("SELECT MAX(p.id) FROM Point p")
    Long findMaxId();

    @Query("SELECT MIN(p.id) FROM Point p")
    Long findMinId();

    @Query("SELECT COUNT(DISTINCT p.cluster) FROM Point p WHERE p.cluster != -1")
    Long findDistinctClusterNumber();

    List<Point> findAllByCluster(Long clusterNumber);

    List<Point> findAllByStatusForWorkerIsNullAndStatusForAdmin(String status);

    List<Point> findAllByStatusForWorkerIsNotNullAndStatusForAdmin(String status);

    List<Point> findAllByWorker(MyUser worker);
}

