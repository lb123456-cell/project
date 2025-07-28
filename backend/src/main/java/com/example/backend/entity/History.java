package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("userEmail")
    private String userEmail;

    @JsonProperty("checkoutDate")
    private String checkoutDate;

    @JsonProperty("returnDate")
    private String returnDate;

    @JsonProperty("name")
    private String name;

    @JsonProperty("brand")
    private String brand;

    @JsonProperty("description")
    private String description;

    @JsonProperty("img")
    private String img;

    public String getUserEmail() {
        return userEmail;
    }

    public String getCheckoutDate() {
        return checkoutDate;
    }

    public String getReturnDate() {
        return returnDate;
    }

    public String getName() {
        return name;
    }

    public String getBrand() {
        return brand;
    }

    public String getDescription() {
        return description;
    }

    public String getImg() {
        return img;
    }

    public Long getId() {
        return id;
    }
    public History(String userEmail, String checkoutDate, String returnDate, 
            String name, String brand, String description, String img) {
    this.userEmail = userEmail;
    this.checkoutDate = checkoutDate;
    this.returnDate = returnDate;
    this.name = name;
    this.brand = brand;
    this.description = description;
    this.img = img;
}

}
