package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "review")
@Data
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "jewelry_id")
    private Long jewelryId;

    @Column(name = "rating")
    private double rating;

    @Column(name = "review_description")
    private String reviewDescription;

    @Column(name = "date")
    private Date date;
}


