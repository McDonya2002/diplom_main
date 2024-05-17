package ru.locate.garbage.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@Table(name="User")
public class MyUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name= "id")

    private Long id;

    @Column(unique = true, name = "name")
    private String name;

    @Column(name= "password")
    private String password;

    @Column(name="firstName")
    private String firstName;

    @Column(name="lastName")
    private String lastName;

    @Column(name="middleName")
    private String middleName;

    @Column(name= "role", nullable = true)
    private Roles role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private UserAvatars UserAvatars;
}

