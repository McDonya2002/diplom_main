package ru.locate.garbage.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name="imagesFromUsers")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ImageFromUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    private long id;
    @Column(name="name")
    private String name;
    @Column(name="originalFileName")
    private String originalFileName;
    @Column(name="size")
    private Long size;
    @Column(name="contentType")
    private String contentType;
    @Lob
    @Column(name="bytes", columnDefinition = "MEDIUMBLOB")
    private byte[] bytes;

    @Column(name="inserted")
    private LocalDateTime inserted;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "point_id")
    private Point point;

    @PrePersist
    private void onCreate(){
        inserted = LocalDateTime.now();
    }

}

