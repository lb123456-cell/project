package com.example.backend.requestmodels;

import lombok.Data;

@Data
public class AddJewelryRequest {
	
	private String name;
	private String brand;
	private String description;
	private int stockQuantity;
	private double price;        
	private String category;
	private String img;
}

