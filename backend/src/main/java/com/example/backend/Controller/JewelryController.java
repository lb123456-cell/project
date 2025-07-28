package com.example.backend.Controller;

import com.example.backend.entity.Jewelry;
import com.example.backend.responsemodels.ShelfCurrentLoansResponse;
import com.example.backend.service.JewelryService;
import com.example.backend.utils.ExtractJWT;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jewelries")
@CrossOrigin("http://localhost:3000")
public class JewelryController {

    private final JewelryService jewelryService;

    public JewelryController(JewelryService jewelryService) {
        this.jewelryService = jewelryService;
    }

    @GetMapping("/secure/currentLoans")
    public ResponseEntity<?> currentLoans(@RequestHeader(value = "Authorization") String token) {
        try {
            System.out.println("===> Raw token: " + token);
            String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
            System.out.println("===> Extracted userEmail: " + userEmail);

            if (userEmail == null || userEmail.isEmpty()) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            List<ShelfCurrentLoansResponse> loans = jewelryService.currentLoans(userEmail);
            return ResponseEntity.ok(loans);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Backend Exception: " + e.getMessage());
        }
    }


    @PutMapping("/secure/checkout")
    public Jewelry checkoutJewelry(
            @RequestHeader("Authorization") String token,
            @RequestParam Long jewelryId) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        return jewelryService.checkoutJewelry(userEmail, jewelryId);
    }

    @PutMapping("/secure/return")
    public void returnJewelry(
            @RequestHeader(value = "Authorization") String token,
            @RequestParam Long jewelryId) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        jewelryService.returnJewelry(userEmail, jewelryId);
    }
    
    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value= "Authorization")String token,
    					@RequestParam Long jewelryId)throws Exception{
    	String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
    	jewelryService.renewLoan(userEmail, jewelryId);
    }

    @GetMapping("/secure/test-auth")
    public String testSecure(@RequestHeader("Authorization") String token) {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        return "Secure is working for: " + userEmail;
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean isCheckedOutByUser(
            @RequestHeader("Authorization") String token,
            @RequestParam Long jewelryId) {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        return jewelryService.isJewelryCheckedOutByUser(userEmail, jewelryId);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader("Authorization") String token) {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        return jewelryService.currentLoanCount(userEmail);
    }

    @GetMapping("/checkout/count")
    public int getCheckoutCount(@RequestParam Long jewelryId) {
        return jewelryService.getCheckoutCountForJewelry(jewelryId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Jewelry> getJewelryById(@PathVariable Long id) {
        return jewelryService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
