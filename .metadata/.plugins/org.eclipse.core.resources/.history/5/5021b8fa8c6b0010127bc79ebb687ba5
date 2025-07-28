package com.example.backend.Controller;

import org.springframework.web.bind.annotation.*;

import com.example.backend.entity.Review;
import com.example.backend.requestmodels.ReviewRequest;
import com.example.backend.service.ReviewService;
import com.example.backend.utils.ExtractJWT;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ✅ Check if user already reviewed this jewelry
    @GetMapping("/secure/user/jewelry")
    public Boolean reviewJewelryByUser(@RequestHeader(value = "Authorization") String token,
                                       @RequestParam Long jewelryId) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }
        return reviewService.userReviewListed(userEmail, jewelryId);
    }

    // ✅ Create a review
    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception {

        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "sub");
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }

        reviewService.postReview(
            userEmail,
            reviewRequest.getJewelryId(),
            reviewRequest.getRating(),
            reviewRequest.getReviewDescription()
        );
    }

    // ✅ NEW: Get all reviews by jewelry ID (for frontend display)
    @GetMapping("/secure/byJewelryId")
    public List<Review> getReviewsByJewelryId(@RequestParam Long jewelryId) {
        return reviewService.getReviewsByJewelryId(jewelryId);
    }

    // 🔁 Optional: Basic health check
    @GetMapping("/ping")
    public String ping() {
        return "ReviewController is working!";
    }
}
