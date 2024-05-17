package ru.locate.garbage.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.Date;

@Data
@Entity
@Table(name="points")
public class Point {
    @Column(name= "latitude", nullable = false)
    private double latitude;

    @Column(name= "longitude", nullable = false)
    private double longitude;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name= "id")
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="statusForUser")
    private String statusForUser;

    @Column(name="statusForWorker")
    private String statusForWorker;

    @Column(name="statusForAdmin")
    private String statusForAdmin;

    @Column(name="commentFromAdmin")
    private String commentFromAdmin;

    private Date date;
    private Long cluster;
    private Long place;
    @PrePersist
    protected void onCreate() {
        date = new Date();
        cluster = (long) -1;
        place = (long) -1;
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private MyUser user;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private MyUser worker;

    @OneToOne(mappedBy = "point", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private ImageFromUser imageFromUser;

    @OneToOne(mappedBy = "point", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private ImageFromWorker imageFromWorker;
}



