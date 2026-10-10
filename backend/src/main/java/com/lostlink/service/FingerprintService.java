package com.lostlink.service;

import com.lostlink.dto.FingerprintDTO;
import com.lostlink.entity.Item;
import com.lostlink.entity.ItemFingerprint;
import com.lostlink.repository.ItemFingerprintRepository;
import com.lostlink.util.StringSimilarityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class FingerprintService {

    @Autowired
    private ItemFingerprintRepository fingerprintRepository;

    public ItemFingerprint generateFingerprint(Item item) {
        String fullText = (item.getTitle() != null ? item.getTitle() : "") + " " +
                (item.getDescription() != null ? item.getDescription() : "") + " " +
                (item.getCategory() != null ? item.getCategory() : "") + " " +
                (item.getBrand() != null ? item.getBrand() : "") + " " +
                (item.getColor() != null ? item.getColor() : "");

        Set<String> tokens = StringSimilarityUtil.tokenizeAndNormalize(fullText);
        String normalizedKeywords = String.join(", ", tokens);

        String feature = item.getPublicDetails() != null ? item.getPublicDetails() :
                (item.getPrivateDetails() != null ? "Distinctive verification mark present" : "Standard item attributes");

        ItemFingerprint fingerprint = fingerprintRepository.findByItemId(item.getId())
                .orElse(new ItemFingerprint());

        fingerprint.setItemId(item.getId());
        fingerprint.setCategory(item.getCategory());
        fingerprint.setItemType(item.getType().name());
        fingerprint.setBrand(item.getBrand());
        fingerprint.setColor(item.getColor());
        fingerprint.setLocation(item.getLocation());
        fingerprint.setDateReported(item.getDateReported());
        fingerprint.setDistinctiveFeature(feature);
        fingerprint.setNormalizedKeywords(normalizedKeywords);

        return fingerprintRepository.save(fingerprint);
    }

    public FingerprintDTO getFingerprint(Long itemId) {
        return fingerprintRepository.findByItemId(itemId)
                .map(this::toDTO)
                .orElse(null);
    }

    private FingerprintDTO toDTO(ItemFingerprint fp) {
        FingerprintDTO dto = new FingerprintDTO();
        dto.setId(fp.getId());
        dto.setItemId(fp.getItemId());
        dto.setCategory(fp.getCategory());
        dto.setItemType(fp.getItemType());
        dto.setBrand(fp.getBrand());
        dto.setColor(fp.getColor());
        dto.setLocation(fp.getLocation());
        dto.setDateReported(fp.getDateReported());
        dto.setDistinctiveFeature(fp.getDistinctiveFeature());
        return dto;
    }
}
