package com.example.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dao.PaymentRepository;
import com.example.backend.entity.Payment;
import com.example.backend.requestmodels.PaymentInfoRequest;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

@Service
@Transactional
public class PaymentService {
	
	private PaymentRepository paymentRepository;
	
	@Autowired
	public PaymentService(PaymentRepository paymentRepository, @Value("${stripe.key.secret}")String secretKey) {
		this.paymentRepository = paymentRepository;
		Stripe.apiKey = secretKey;
	}
	
	public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest)throws StripeException {
		List<String> paymentMethodTypes = new ArrayList<>();
		paymentMethodTypes.add("card");
		
		Map<String, Object> params = new HashMap<>();
		params.put("amount", paymentInfoRequest.getAmount());
		params.put("currency", paymentInfoRequest.getCurrency());
		params.put("payment_method_types", paymentMethodTypes);
		
		return PaymentIntent.create(params);
	}
	
	public ResponseEntity<String> stripePayment(String userEmail) throws Exception {
		Payment payment = paymentRepository.findByUserEmail(userEmail);
		
		if(payment == null) {
			throw new Exception("Payment information is missing");
		}
		
		payment.setAmount(00.00);
		paymentRepository.save(payment);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	public Payment getUserPayment(String userEmail) {
	    return paymentRepository.findByUserEmail(userEmail);
	}


}
