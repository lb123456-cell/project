package com.example.backend.projection;

import com.example.backend.entity.Jewelry;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "jewelryInline", types = { Jewelry.class })
public interface JewelryProjection {
    Long getId();
    String getName();
    String getBrand();
    String getDescription();
    int getStockQuantity();
    int getPrice();
    String getCategory();
    String getImg();
}
