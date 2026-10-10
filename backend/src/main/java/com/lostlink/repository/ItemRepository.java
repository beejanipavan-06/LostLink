package com.lostlink.repository;

import com.lostlink.entity.Item;
import com.lostlink.entity.ItemStatus;
import com.lostlink.entity.ItemType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByUserId(Long userId);
    List<Item> findByType(ItemType type);
    List<Item> findByTypeAndStatus(ItemType type, ItemStatus status);

    @Query("SELECT i FROM Item i WHERE " +
           "(:type IS NULL OR i.type = :type) AND " +
           "(:category IS NULL OR LOWER(i.category) = LOWER(:category)) AND " +
           "(:location IS NULL OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:color IS NULL OR LOWER(i.color) LIKE LOWER(CONCAT('%', :color, '%'))) AND " +
           "(:brand IS NULL OR LOWER(i.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:query IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Item> searchItems(
            @Param("type") ItemType type,
            @Param("category") String category,
            @Param("location") String location,
            @Param("color") String color,
            @Param("brand") String brand,
            @Param("query") String query,
            Pageable pageable
    );

    long countByType(ItemType type);
    long countByStatus(ItemStatus status);

    @Query("SELECT i.category, COUNT(i) FROM Item i GROUP BY i.category")
    List<Object[]> countItemsByCategory();

    @Query("SELECT i.location, COUNT(i) FROM Item i GROUP BY i.location")
    List<Object[]> countItemsByLocation();

    @Query("SELECT i.location, COUNT(i) FROM Item i WHERE i.type = 'LOST' GROUP BY i.location ORDER BY COUNT(i) DESC")
    List<Object[]> findTopLostLocations();

    @Query("SELECT i.category, COUNT(i) FROM Item i WHERE i.type = 'LOST' GROUP BY i.category ORDER BY COUNT(i) DESC")
    List<Object[]> findTopLostCategories();
}
