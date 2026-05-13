const db = require('../config/db');

exports.createAuction = async (req, res) => {
    const { title, description, starting_price, start_date, end_date, category, address } = req.body;
    let image_url = '';
    
    if (req.files && req.files.length > 0) {
        if (req.files.length < 3) {
            return res.status(400).json({ message: 'Please upload at least 3 images for the product' });
        }
        // First image becomes the primary image
        image_url = `/uploads/${req.files[0].filename}`;
    } else {
        return res.status(400).json({ message: 'At least one image file is required' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO products (seller_id, title, description, starting_price, current_highest_bid, start_date, end_date, image_url, category, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.userId, title, description, starting_price, starting_price, start_date, end_date, image_url, category, address || '']
        );
        
        const productId = result.insertId;
        
        // Insert all images into product_images
        for (const file of req.files) {
            await db.execute(
                'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
                [productId, `/uploads/${file.filename}`]
            );
        }

        res.status(201).json({ message: 'Auction created successfully', auctionId: productId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllAuctions = async (req, res) => {
    try {
        const [auctions] = await db.execute('SELECT * FROM products ORDER BY end_date ASC');
        res.status(200).json(auctions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSellerAuctions = async (req, res) => {
    try {
        const [auctions] = await db.execute('SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC', [req.userId]);
        res.status(200).json(auctions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAuctionById = async (req, res) => {
    try {
        const [auctions] = await db.execute(`
            SELECT p.*, u.name as host_name, u.email as host_email, u.phone_number as host_phone
            FROM products p 
            JOIN users u ON p.seller_id = u.id 
            WHERE p.id = ?
        `, [req.params.id]);
        if (auctions.length === 0) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        
        const auction = auctions[0];
        
        // Fetch all images
        const [images] = await db.execute('SELECT image_url FROM product_images WHERE product_id = ?', [req.params.id]);
        auction.all_images = images.map(img => img.image_url);
        
        res.status(200).json(auction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSimilarAuctions = async (req, res) => {
    try {
        // Fetch current auction category
        const [auctions] = await db.execute('SELECT category FROM products WHERE id = ?', [req.params.id]);
        if (auctions.length === 0) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        
        const category = auctions[0].category;
        
        // Fetch up to 4 active auctions from same category excluding the current one
        const [similar] = await db.execute(`
            SELECT * FROM products 
            WHERE category = ? AND id != ? AND end_date > NOW()
            ORDER BY created_at DESC 
            LIMIT 4
        `, [category, req.params.id]);
        
        res.status(200).json(similar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.placeBid = async (req, res) => {
    const auctionId = req.params.id;
    const { bid_amount } = req.body;
    
    try {
        const [auctions] = await db.execute('SELECT * FROM products WHERE id = ?', [auctionId]);
        if (auctions.length === 0) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        const auction = auctions[0];

        if (new Date() > new Date(auction.end_date)) {
            return res.status(400).json({ message: 'Auction has already ended' });
        }

        if (Number(bid_amount) <= Number(auction.current_highest_bid)) {
            return res.status(400).json({ message: 'Bid amount must be higher than current highest bid' });
        }

        // Insert new bid
        await db.execute('INSERT INTO bids (auction_id, buyer_id, bid_amount) VALUES (?, ?, ?)', [auctionId, req.userId, bid_amount]);
        
        // Update product current highest bid
        await db.execute('UPDATE products SET current_highest_bid = ? WHERE id = ?', [bid_amount, auctionId]);

        // Get user name to broadcast
        const [users] = await db.execute('SELECT name FROM users WHERE id = ?', [req.userId]);
        const userName = users[0].name;

        // Broadcast to clients in this auction's room
        const io = req.app.get('io');
        if (io) {
            io.to(`auction_${auctionId}`).emit('new_bid', {
                bidder_name: userName,
                bid_amount: bid_amount,
                bid_time: new Date()
            });
        }

        res.status(200).json({ message: 'Bid placed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAuctionBids = async (req, res) => {
    try {
        const [bids] = await db.execute(`
            SELECT b.*, u.name as bidder_name 
            FROM bids b 
            JOIN users u ON b.buyer_id = u.id 
            WHERE b.auction_id = ? 
            ORDER BY b.bid_amount DESC
        `, [req.params.id]);
        res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserActivity = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Get user's placed bids with auction details
        const [bids] = await db.execute(`
            SELECT b.bid_amount, b.bid_time, p.title, p.id as auction_id, p.end_date, p.current_highest_bid 
            FROM bids b 
            JOIN products p ON b.auction_id = p.id 
            WHERE b.buyer_id = ? 
            ORDER BY b.bid_time DESC
        `, [userId]);

        // Get user's created auctions
        const [auctions] = await db.execute(`
            SELECT id, title, current_highest_bid, end_date, status, created_at 
            FROM products 
            WHERE seller_id = ? 
            ORDER BY created_at DESC
        `, [userId]);

        res.status(200).json({ bids, auctions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.endAuctionEarly = async (req, res) => {
    try {
        const auctionId = req.params.id;
        
        // Verify ownership
        const [auctions] = await db.execute('SELECT * FROM products WHERE id = ?', [auctionId]);
        if (auctions.length === 0) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        
        if (auctions[0].seller_id !== req.userId) {
            return res.status(403).json({ message: 'You are not the host of this auction' });
        }
        
        // Update the end date to now
        await db.execute('UPDATE products SET end_date = NOW() WHERE id = ?', [auctionId]);
        
        res.status(200).json({ message: 'Auction ended successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteAuction = async (req, res) => {
    try {
        const auctionId = req.params.id;

        // Verify ownership
        const [auctions] = await db.execute('SELECT * FROM products WHERE id = ?', [auctionId]);
        if (auctions.length === 0) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (auctions[0].seller_id !== req.userId) {
            return res.status(403).json({ message: 'You are not the host of this auction' });
        }

        // Delete related bids and images first
        await db.execute('DELETE FROM bids WHERE auction_id = ?', [auctionId]);
        await db.execute('DELETE FROM product_images WHERE product_id = ?', [auctionId]);

        // Delete the product
        await db.execute('DELETE FROM products WHERE id = ?', [auctionId]);

        // Notify connected clients in the auction room
        const io = req.app.get('io');
        if (io) {
            io.to(`auction_${auctionId}`).emit('auction_deleted', { auctionId });
        }

        res.status(200).json({ message: 'Auction deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
