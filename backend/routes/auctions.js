const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auctionController = require('../controllers/auctionController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, jpeg, png) are allowed.'));
    }
});

// Public routes
router.get('/', auctionController.getAllAuctions);
router.get('/:id', auctionController.getAuctionById);
router.get('/:id/bids', auctionController.getAuctionBids);
router.get('/:id/similar', auctionController.getSimilarAuctions);

// User routes (all users can buy and sell)
router.post('/', verifyToken, upload.array('images', 5), auctionController.createAuction);
router.get('/user/my-auctions', verifyToken, auctionController.getSellerAuctions);
router.get('/user/activity', verifyToken, auctionController.getUserActivity);
router.post('/:id/bid', verifyToken, auctionController.placeBid);
router.post('/:id/end', verifyToken, auctionController.endAuctionEarly);

module.exports = router;
