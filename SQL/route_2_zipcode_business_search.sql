

SET @zipcode = '19104';

SELECT B.id, B.name, B.address, B.review_stars, B.review_count,
       GROUP_CONCAT(C.name ORDER BY C.name SEPARATOR ', ') AS business_category_list
FROM Business B
JOIN Business_Category BC
    ON B.id = BC.business_id
JOIN Category C
    ON BC.category_id = C.id
WHERE B.zipcode = @zipcode
GROUP BY B.id, B.name, B.address, B.review_stars, B.review_count
ORDER BY B.name;


