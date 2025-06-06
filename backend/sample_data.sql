-- Clean the database
DELETE FROM Feedbacks;
DELETE FROM DishesToIngredients;
DELETE FROM Ingredients;
DELETE FROM Dishes;

-- Add Dishes with real image URLs and multi-line descriptions
INSERT INTO Dishes (name, img, description) VALUES (
  'Pizza Margherita',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Pizza Margherita is a classic Neapolitan pizza topped with tomato sauce, mozzarella cheese, and fresh basil leaves.
It is celebrated for its simplicity and fresh ingredients.
A true symbol of Italian culinary tradition.'
);

INSERT INTO Dishes (name, img, description) VALUES (
  'Chicken Curry',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=3113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Chicken Curry is a flavorful dish made with tender chicken pieces simmered in a spiced curry sauce.
It is enjoyed across many cultures, especially in South Asia.
The rich sauce is often served with rice or bread.'
);

INSERT INTO Dishes (name, img, description) VALUES (
  'Spaghetti Carbonara',
  'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Spaghetti Carbonara is a Roman pasta dish made with eggs, cheese, pancetta, and black pepper.
It is creamy and savory, with a rich, comforting flavor.
A beloved staple of Italian cuisine.'
);

INSERT INTO Dishes (name, img, description) VALUES (
  'Beef Steak',
  'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Beef Steak is a juicy cut of beef, grilled or pan-seared to perfection.
It is often seasoned simply with salt and pepper.
Served with sides like potatoes or vegetables, it is a favorite worldwide.'
);

INSERT INTO Dishes (name, img, description) VALUES (
  'Salmon Sushi',
  'https://images.unsplash.com/photo-1558985212-92c2ff0b56e7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Salmon Sushi features slices of fresh salmon atop vinegared rice, sometimes wrapped in seaweed.
It is a staple of Japanese cuisine, prized for its delicate flavor and texture.
Often enjoyed with soy sauce, wasabi, and pickled ginger.'
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


