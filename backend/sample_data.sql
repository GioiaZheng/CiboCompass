-- Clear existing data
DELETE FROM Comments;
DELETE FROM Feedbacks;
DELETE FROM DishesToIngredients;
DELETE FROM Ingredients;
DELETE FROM Dishes;

-- Add Dishes
INSERT INTO Dishes (name, img) VALUES ('Pizza Margherita', 'example.jpg');
INSERT INTO Dishes (name, img) VALUES ('Chicken Curry', 'example.jpg');
INSERT INTO Dishes (name, img) VALUES ('Spaghetti Carbonara', 'example.jpg');
INSERT INTO Dishes (name, img) VALUES ('Beef Steak', 'example.jpg');
INSERT INTO Dishes (name, img) VALUES ('Salmon Sushi', 'example.jpg');

-- Add ingredients
INSERT INTO Ingredients (id, ingredientName) VALUES (1, 'Dough');
INSERT INTO Ingredients (id, ingredientName) VALUES (2, 'Tomato');
INSERT INTO Ingredients (id, ingredientName) VALUES (3, 'Mozzarella Cheese');
INSERT INTO Ingredients (id, ingredientName) VALUES (4, 'Olive Oil');
INSERT INTO Ingredients (id, ingredientName) VALUES (5, 'Basil');
INSERT INTO Ingredients (id, ingredientName) VALUES (6, 'Chicken');
INSERT INTO Ingredients (id, ingredientName) VALUES (7, 'Curry Powder');
INSERT INTO Ingredients (id, ingredientName) VALUES (8, 'Coconut Milk');
INSERT INTO Ingredients (id, ingredientName) VALUES (9, 'Onion');
INSERT INTO Ingredients (id, ingredientName) VALUES (10, 'Garlic');
INSERT INTO Ingredients (id, ingredientName) VALUES (11, 'Spaghetti');
INSERT INTO Ingredients (id, ingredientName) VALUES (12, 'Eggs');
INSERT INTO Ingredients (id, ingredientName) VALUES (13, 'Bacon');
INSERT INTO Ingredients (id, ingredientName) VALUES (14, 'Parmesan Cheese');
INSERT INTO Ingredients (id, ingredientName) VALUES (15, 'Black Pepper');
INSERT INTO Ingredients (id, ingredientName) VALUES (16, 'Beef');
INSERT INTO Ingredients (id, ingredientName) VALUES (17, 'Salt');
INSERT INTO Ingredients (id, ingredientName) VALUES (18, 'Butter');
INSERT INTO Ingredients (id, ingredientName) VALUES (19, 'Salmon');
INSERT INTO Ingredients (id, ingredientName) VALUES (20, 'Rice');
INSERT INTO Ingredients (id, ingredientName) VALUES (21, 'Nori');
INSERT INTO Ingredients (id, ingredientName) VALUES (22, 'Wasabi');
INSERT INTO Ingredients (id, ingredientName) VALUES (23, 'Soy Sauce');

-- Associate ingredients with Pizza Margherita
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Pizza Margherita', 1);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Pizza Margherita', 2);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Pizza Margherita', 3);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Pizza Margherita', 4);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Pizza Margherita', 5);

-- Associate ingredients with Chicken Curry
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Chicken Curry', 6);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Chicken Curry', 7);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Chicken Curry', 8);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Chicken Curry', 9);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Chicken Curry', 10);

-- Associate ingredients with Spaghetti Carbonara
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 11);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 12);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 13);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 14);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 15);

-- Associate ingredients with Beef Steak
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Beef Steak', 16);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Beef Steak', 17);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Beef Steak', 15);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Beef Steak', 18);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Beef Steak', 10);

-- Associate ingredients with Salmon Sushi
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Salmon Sushi', 19);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Salmon Sushi', 20);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Salmon Sushi', 21);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Salmon Sushi', 22);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Salmon Sushi', 23);

-- Add feedback data for different nationalities
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'Italy', 98, 2);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'USA', 85, 15);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'Japan', 70, 30);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'India', 65, 35);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'France', 80, 20);

INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Chicken Curry', 'Italy', 60, 40);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Chicken Curry', 'USA', 70, 30);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Chicken Curry', 'Japan', 65, 35);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Chicken Curry', 'India', 95, 5);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Chicken Curry', 'France', 55, 45);

INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'Italy', 95, 5);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'USA', 80, 20);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'Japan', 60, 40);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'India', 50, 50);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'France', 85, 15);

INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Beef Steak', 'Italy', 75, 25);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Beef Steak', 'USA', 90, 10);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Beef Steak', 'Japan', 70, 30);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Beef Steak', 'India', 30, 70);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Beef Steak', 'France', 80, 20);

INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Salmon Sushi', 'Italy', 65, 35);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Salmon Sushi', 'USA', 75, 25);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Salmon Sushi', 'Japan', 95, 5);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Salmon Sushi', 'India', 40, 60);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Salmon Sushi', 'France', 70, 30);

-- Add comments for Pizza Margherita
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'Authentic and delicious, just like in Naples!');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'Perfect balance of flavors, the basil makes it special.');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'Simple yet so satisfying, a true classic.');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'The crust was perfectly crispy on the outside and soft inside.');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'Need more cheese in my opinion, but still good.');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'Best pizza I''ve had outside of Italy!');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'The tomato sauce was so fresh and flavorful.');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'A bit too simple for my taste, but well made.');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'This pizza brings back memories of my trip to Italy.');
INSERT INTO Comments (dishName, comment) VALUES ('Pizza Margherita', 'Would definitely order again, a timeless favorite.');

-- Add comments for Chicken Curry
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'Great balance of spices, not too hot but very flavorful.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'The chicken was tender and the sauce was creamy.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'Could use more heat, but I understand it''s adjusted for general taste.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'Authentic flavor profile, reminds me of homemade curry.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'The coconut milk adds a wonderful richness to the dish.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'Perfect with rice, a complete and satisfying meal.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'The aroma alone makes this dish worth ordering.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'A bit too mild for my taste, but still delicious.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'Great comfort food for cold evenings.');
INSERT INTO Comments (dishName, comment) VALUES ('Chicken Curry', 'The blend of spices is perfect, not overwhelming at all.');

-- Add comments for Spaghetti Carbonara
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'Perfectly creamy without being too heavy. Authentic recipe!');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'The pancetta adds the perfect salty touch to the dish.');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'Al dente pasta and rich egg sauce, just as it should be.');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'A bit too peppery for me, but I know that''s traditional.');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'Simple ingredients that come together perfectly.');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'The quality of the cheese really shines in this dish.');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'I appreciate that there''s no cream, just as authentic carbonara should be.');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'Comfort food at its finest, rich and satisfying.');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'The eggs create a silky sauce that coats each strand of pasta perfectly.');
INSERT INTO Comments (dishName, comment) VALUES ('Spaghetti Carbonara', 'One of the best carbonaras I''ve had outside of Rome.');

-- Add comments for Beef Steak
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'Perfectly cooked to medium-rare as requested, tender and juicy.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'The quality of the beef really shows, excellent marbling.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'Simple seasoning lets the flavor of the meat shine.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'A bit overcooked for my taste, but still flavorful.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'The crust on the outside was perfect, nice sear.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'Melts in your mouth, worth every penny.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'The garlic butter on top adds an amazing flavor dimension.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'Impressive quality meat, cooked with respect for the ingredient.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'A classic dish done perfectly, no fancy tricks needed.');
INSERT INTO Comments (dishName, comment) VALUES ('Beef Steak', 'Excellent consistency throughout, not a single tough bite.');

-- Add comments for Salmon Sushi
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'Fresh fish with the perfect texture, melt-in-your-mouth experience.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'The rice was seasoned perfectly, not too vinegary.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'The salmon was buttery and had a clean taste of the sea.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'Simple but executed perfectly, quality ingredients make the difference.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'The fish-to-rice ratio was spot on, not too much of either.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'Could be a bit more generous with the salmon, but taste was excellent.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'The wasabi and soy sauce provided were of good quality and complemented the sushi well.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'A clean, light flavor that showcases the quality of the ingredients.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'One of the best salmon sushi experiences I''ve had outside of Japan.');
INSERT INTO Comments (dishName, comment) VALUES ('Salmon Sushi', 'The nori was crisp and the overall bite was perfectly balanced.');