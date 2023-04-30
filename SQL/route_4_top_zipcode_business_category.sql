

SET @category := 'Restaurants';

SELECT
   Z.zipcode,
   Z.city,
   Z.state,
   AVG(review_stars) AS avg_review_star,
   COUNT(*) AS num_business
FROM Zipcode Z
JOIN
  (SELECT review_stars, zipcode
   FROM Business b
    JOIN Business_Category BC ON b.id = BC.business_id
   JOIN Category C ON BC.category_id = C.id
   WHERE C.name = @category) businesses
ON Z.zipcode = businesses.zipcode
GROUP BY Z.zipcode, Z.city, Z.state
ORDER BY avg_review_star DESC, num_business DESC;




