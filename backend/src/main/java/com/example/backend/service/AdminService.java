package com.example.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dao.CheckoutRepository;
import com.example.backend.dao.JewelryRepository;
import com.example.backend.dao.ReviewRepository;
import com.example.backend.entity.Jewelry;
import com.example.backend.requestmodels.AddJewelryRequest;

@Service
@Transactional
public class AdminService {

    private final JewelryRepository jewelryRepository;
    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;
   
    @Autowired
    public AdminService(JewelryRepository jewelryRepository,
    					ReviewRepository reviewRepository,
    					CheckoutRepository checkoutRepository) {
        this.jewelryRepository = jewelryRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }
    public void increaseJewelryQuantity(Long jewelryId) throws Exception {
        Optional<Jewelry> jewelry = jewelryRepository.findById(jewelryId);
        if (!jewelry.isPresent()) {
            throw new Exception("Jewelry not found");
        }

        Jewelry j = jewelry.get();
        j.setStockQuantity(j.getStockQuantity() + 1);
        j.setStockQuantity(j.getStockQuantity() + 1); 
        jewelryRepository.save(j);
    }


    public void decreaseJewelryQuantity(Long jewelryId) throws Exception {
        Optional<Jewelry> jewelry = jewelryRepository.findById(jewelryId);
        if (!jewelry.isPresent() || jewelry.get().getStockQuantity() <= 0) {
            throw new Exception("Jewelry not found or quantity locked");
        }

        Jewelry j = jewelry.get();
        j.setStockQuantity(j.getStockQuantity() - 1);

        // Only decrease available if available > 0
        if (j.getStockQuantity() > 0) {
            j.setStockQuantity(j.getStockQuantity() - 1); // ✅ add this
        }

        jewelryRepository.save(j);
    }



    public void postJewelry(AddJewelryRequest addJewelryRequest) {
        Jewelry jewelry = new Jewelry();
        jewelry.setName(addJewelryRequest.getName());
        jewelry.setBrand(addJewelryRequest.getBrand());
        jewelry.setDescription(addJewelryRequest.getDescription());
        jewelry.setStockQuantity(addJewelryRequest.getStockQuantity());
        jewelry.setStockQuantity(addJewelryRequest.getStockQuantity());
        jewelry.setCategory(addJewelryRequest.getCategory());
        jewelry.setPrice(addJewelryRequest.getPrice());
        jewelry.setImg(addJewelryRequest.getImg());

        jewelryRepository.save(jewelry);

    }
    
    public void deleteJewelry(Long jewelryId) throws Exception {
    	
    	Optional<Jewelry> jewelry= jewelryRepository.findById(jewelryId);
    	
    	if(!jewelry.isPresent()) {
    		throw new Exception("Jewelry not found");
    	}
    	
    	jewelryRepository.delete(jewelry.get());
    	checkoutRepository.deleteAllByJewelryId(jewelryId);
    	reviewRepository.deleteAllByJewelryId(jewelryId);
    }
}


