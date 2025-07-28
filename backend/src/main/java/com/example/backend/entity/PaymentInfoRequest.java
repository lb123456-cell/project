package com.example.backend.entity;

public class PaymentInfoRequest {
    private int amount;
    private String currency;
    private String receiptEmail;
	public String getReceiptEmail() {
		return receiptEmail;
	}
	public void setReceiptEmail(String receiptEmail) {
		this.receiptEmail = receiptEmail;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}

}
