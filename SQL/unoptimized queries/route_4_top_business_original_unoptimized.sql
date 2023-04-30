
SET @category := 'Restaurants';

SELECT
    B.zipcode,
    Z.city,
    Z.state,
    AVG(review_stars) AS avg_review_star,
    COUNT(*) AS num_business
FROM Business B
JOIN Zipcode Z
    ON B.zipcode = Z.zipcode
WHERE B.id IN
    (SELECT business_id
    FROM Business_Category BC
    JOIN Category C ON BC.category_id = C.id
    WHERE LOWER(C.name) LIKE CONCAT('%', @category, '%'))
GROUP BY B.zipcode, Z.city, Z.state
ORDER BY avg_review_star DESC, num_business DESC;