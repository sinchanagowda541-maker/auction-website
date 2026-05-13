-- Seed Data for Auction Database
USE auction_db;

-- Clear existing data (optional - comment out if you want to preserve)
-- DELETE FROM product_images;
-- DELETE FROM bids;
-- DELETE FROM chat_messages;
-- DELETE FROM products;
-- DELETE FROM users;

-- Insert Sample Users (Sellers and Buyers)
INSERT INTO users (name, email, password_hash, role, address, phone_number, date_of_birth, age, gender) VALUES
('Alice Johnson', 'alice@example.com', '$2b$10$example_hash_1', 'seller', '123 Main St, New York, NY', '555-0101', '1990-05-15', 34, 'female'),
('Bob Smith', 'bob@example.com', '$2b$10$example_hash_2', 'seller', '456 Oak Ave, Los Angeles, CA', '555-0102', '1988-08-22', 36, 'male'),
('Carol Davis', 'carol@example.com', '$2b$10$example_hash_3', 'seller', '789 Pine Rd, Chicago, IL', '555-0103', '1992-12-10', 32, 'female'),
('David Wilson', 'david@example.com', '$2b$10$example_hash_4', 'buyer', '321 Elm St, Houston, TX', '555-0104', '1995-03-18', 29, 'male'),
('Eve Martinez', 'eve@example.com', '$2b$10$example_hash_5', 'buyer', '654 Maple Dr, Phoenix, AZ', '555-0105', '1993-07-25', 31, 'female'),
('Frank Brown', 'frank@example.com', '$2b$10$example_hash_6', 'buyer', '987 Cedar Ln, Philadelphia, PA', '555-0106', '1991-01-30', 33, 'male'),
('Grace Lee', 'grace@example.com', '$2b$10$example_hash_7', 'seller', '159 Birch Way, San Antonio, TX', '555-0107', '1989-09-12', 35, 'female'),
('Henry Taylor', 'henry@example.com', '$2b$10$example_hash_8', 'buyer', '246 Spruce Ct, San Diego, CA', '555-0108', '1994-11-05', 30, 'male');

-- Insert Sample Products (Auctions)
INSERT INTO products (seller_id, title, description, image_url, starting_price, current_highest_bid, start_date, end_date, status, category, address) VALUES
(1, 'Vintage Rolex Submariner', 'A classic 1970s Rolex Submariner in excellent condition with original box and papers. Beautiful patina on the dial and full functionality.', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80', 15000.00, 15500.00, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 'active', 'Watches', 'Geneva, Switzerland'),
(1, 'First Edition Harry Potter', 'Rare first edition, first printing of Harry Potter and the Philosopher\'s Stone. Hardcover, UK edition with dust jacket. Excellent condition with minimal wear.', 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&w=800&q=80', 40000.00, 45000.00, NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 'active', 'Books', 'London, UK'),
(2, 'Signed Michael Jordan Jersey', 'Authentic Chicago Bulls jersey signed by Michael Jordan during the 1996 championship season. Includes certificate of authenticity from PSA/DNA. Museum quality framing available.', 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80', 5000.00, 8200.00, NOW(), DATE_ADD(NOW(), INTERVAL 4 DAY), 'active', 'Sports', 'Chicago, IL'),
(2, 'Leica M6 Classic Camera', 'Pristine condition Leica M6 film camera from 1995. Fully mechanical, recently serviced by professional technician. Includes original case and manual. Ready to shoot.', 'https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=800&q=80', 2500.00, 3100.00, NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY), 'active', 'Electronics', 'Berlin, Germany'),
(3, 'Patek Philippe Nautilus', 'Stunning Patek Philippe Nautilus 5711 in stainless steel with blue dial. The holy grail of sports watches. Complete set with box, papers, and service history. Recently serviced.', 'https://images.unsplash.com/photo-1548171915-e7afefaedbc1?auto=format&fit=crop&w=800&q=80', 80000.00, 85000.00, NOW(), DATE_ADD(NOW(), INTERVAL 6 DAY), 'active', 'Watches', 'Geneva, Switzerland'),
(3, 'Original Oil Painting by Renaissance Artist', 'Hand-painted oil on canvas by a prominent Renaissance period artist. Depicts classical mythology scene with rich colors and fine detail. 18th century European artwork. Professionally authenticated.', 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?auto=format&fit=crop&w=800&q=80', 12000.00, 14500.00, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'active', 'Art', 'Paris, France'),
(1, 'Vintage Omega Seamaster', 'Omega Seamaster from 1965 in excellent working condition. Stainless steel case with original dial and hands. Service history available. A true collector piece.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 3500.00, 4200.00, NOW(), DATE_ADD(NOW(), INTERVAL 4 DAY), 'active', 'Watches', 'Geneva, Switzerland'),
(2, 'Tesla Model S - 2015', 'Stunning 2015 Tesla Model S with 75,000 miles. Full autopilot, excellent battery health (88%). Regular maintenance, no accidents. White exterior, black interior. Clean title.', 'https://images.unsplash.com/photo-1560958089-b8a63dd8b50b?auto=format&fit=crop&w=800&q=80', 35000.00, 42000.00, NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 'active', 'Vehicles', 'Los Angeles, CA');

-- Insert Sample Product Images (Multiple images per product)
INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80'),
(1, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80'),
(1, 'https://images.unsplash.com/photo-1595561881033-6461efb0ac52?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1474377534352-44c90e0ae6d2?auto=format&fit=crop&w=800&q=80'),
(3, 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80'),
(3, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'),
(3, 'https://images.unsplash.com/photo-1514080267045-ad4e584a28a6?auto=format&fit=crop&w=800&q=80'),
(4, 'https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=800&q=80'),
(4, 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?auto=format&fit=crop&w=800&q=80'),
(4, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'),
(5, 'https://images.unsplash.com/photo-1548171915-e7afefaedbc1?auto=format&fit=crop&w=800&q=80'),
(5, 'https://images.unsplash.com/photo-1523638692108-6f3ee3c537c5?auto=format&fit=crop&w=800&q=80'),
(5, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'),
(6, 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?auto=format&fit=crop&w=800&q=80'),
(6, 'https://images.unsplash.com/photo-1578924519327-21a73020593d?auto=format&fit=crop&w=800&q=80'),
(6, 'https://images.unsplash.com/photo-1578321272176-d2a06d10a55f?auto=format&fit=crop&w=800&q=80'),
(7, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'),
(7, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80'),
(7, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'),
(8, 'https://images.unsplash.com/photo-1560958089-b8a63dd8b50b?auto=format&fit=crop&w=800&q=80'),
(8, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80'),
(8, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80');

-- Insert Sample Bids
INSERT INTO bids (auction_id, buyer_id, bid_amount, bid_time) VALUES
(1, 4, 15100.00, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 5, 15300.00, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 6, 15500.00, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(2, 4, 42000.00, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(2, 5, 45000.00, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(3, 6, 7500.00, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(3, 8, 8200.00, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(4, 5, 2800.00, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(4, 6, 3100.00, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(5, 8, 82000.00, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(5, 4, 85000.00, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(6, 6, 13000.00, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(6, 8, 14500.00, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(7, 5, 3800.00, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(7, 4, 4200.00, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(8, 6, 38000.00, DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(8, 5, 40000.00, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(8, 4, 42000.00, DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- Insert Sample Chat Messages
INSERT INTO chat_messages (auction_id, user_id, message, created_at) VALUES
(1, 4, 'Is this watch still available?', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 1, 'Yes! Still available and in perfect condition.', DATE_SUB(NOW(), INTERVAL 1.5 HOUR)),
(1, 5, 'Can you provide more photos?', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 1, 'Sure! Let me upload more photos soon.', DATE_SUB(NOW(), INTERVAL 50 MINUTE)),
(2, 4, 'Is this a genuine first edition?', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(2, 1, 'Absolutely! Fully authenticated and in excellent condition.', DATE_SUB(NOW(), INTERVAL 2.5 HOUR)),
(3, 6, 'Does this include authentication certificate?', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(3, 2, 'Yes, comes with PSA/DNA certificate. Authentic 100%', DATE_SUB(NOW(), INTERVAL 3.5 HOUR)),
(5, 8, 'Beautiful piece! What\'s the condition?', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(5, 3, 'Pristine condition! Complete with box and papers.', DATE_SUB(NOW(), INTERVAL 1.5 HOUR));

-- Verify insertion
SELECT 'Users inserted:' as status, COUNT(*) as count FROM users;
SELECT 'Products inserted:' as status, COUNT(*) as count FROM products;
SELECT 'Product images inserted:' as status, COUNT(*) as count FROM product_images;
SELECT 'Bids inserted:' as status, COUNT(*) as count FROM bids;
SELECT 'Chat messages inserted:' as status, COUNT(*) as count FROM chat_messages;
