-- Clean the database
DELETE FROM Feedbacks;
DELETE FROM DishesToIngredients;
DELETE FROM Ingredients;
DELETE FROM Dishes;

-- Add Dishes with real image URLs and multi-line descriptions
INSERT INTO Dishes (name, img, description) VALUES (
  'Pizza Margherita',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Pizza Margherita is a classic Neapolitan pizza topped with tomato sauce, mozzarella cheese, and fresh basil leaves. It is celebrated for its simplicity and fresh ingredients. A true symbol of Italian culinary tradition.'
);

INSERT INTO Dishes (name, img, description) VALUES (
  'Spaghetti Carbonara',
  'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Spaghetti Carbonara is a Roman pasta dish made with eggs, cheese, pancetta, and black pepper. It is creamy and savory, with a rich, comforting flavor. A beloved staple of Italian cuisine.'
);

INSERT INTO Dishes (name, img, description) VALUES (
  'Fiorentina Steak',
  'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Beef Steak is a juicy cut of beef, grilled or pan-seared to perfection. It is often seasoned simply with salt and pepper. Served with sides like potatoes or vegetables, it is a favorite worldwide.'
);
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

-- Associate ingredients with Spaghetti Carbonara
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 11);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 12);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 13);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 14);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Spaghetti Carbonara', 15);

-- Associate ingredients with Fiorentina Steak
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Fiorentina Steak', 16);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Fiorentina Steak', 17);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Fiorentina Steak', 15);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Fiorentina Steak', 18);
INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('Fiorentina Steak', 10);

-- Add feedback data for different nationalities
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'Italy', 98, 2);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'USA', 85, 15);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'Japan', 70, 30);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'India', 65, 35);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Pizza Margherita', 'France', 80, 20);

INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'Italy', 95, 5);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'USA', 80, 20);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'Japan', 60, 40);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'India', 50, 50);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Spaghetti Carbonara', 'France', 85, 15);

INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Fiorentina Steak', 'Italy', 75, 25);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Fiorentina Steak', 'USA', 90, 10);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Fiorentina Steak', 'Japan', 70, 30);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Fiorentina Steak', 'India', 30, 70);
INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES ('Fiorentina Steak', 'France', 80, 20);


