package com.example.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long>{
	
	Payment findByUserEmail(String userEmail);

}
