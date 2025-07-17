package com.nomnomatlas.repository.custom;

import com.nomnomatlas.repository.entity.RestaurantEntity;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class RestaurantSpecification {

    public static Specification<RestaurantEntity> search(
            String categoryName,
            LocalTime openTime,
            LocalTime closeTime,
            List<String> dishNames
    ) {
        return (root, query, criteriaBuilder) -> {
            // Dùng để gom tất cả các điều kiện WHERE lại
            List<Predicate> predicates = new ArrayList<>();

            // Luôn cần DISTINCT để tránh trả về nhà hàng trùng lặp
            query.distinct(true);

            if (categoryName != null && !categoryName.isBlank()) {
                // JOIN tới category và so sánh tên
                Predicate categoryPredicate = criteriaBuilder.equal(
                        criteriaBuilder.lower(root.join("dishEntityList").join("categoryEntity").get("name")),
                        categoryName.toLowerCase()
                );
                predicates.add(categoryPredicate);
            }

            if (openTime != null) {
                Predicate openTimePredicate = criteriaBuilder.lessThanOrEqualTo(root.get("openingTime"), openTime);
                predicates.add(openTimePredicate);
            }

            if (closeTime != null) {
                Predicate closeTimePredicate = criteriaBuilder.greaterThanOrEqualTo(root.get("closingTime"), closeTime);
                predicates.add(closeTimePredicate);
            }

            // Đây là cách xử lý List đúng đắn!
            if (dishNames != null && !dishNames.isEmpty()) {
                // Dùng biểu thức `in` của Criteria API
                Predicate dishPredicate = root.join("dishEntityList").get("name").in(dishNames);
                predicates.add(dishPredicate);
            }

            // Kết hợp tất cả các điều kiện bằng AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
