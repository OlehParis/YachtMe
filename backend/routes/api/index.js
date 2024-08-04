// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const yachtsRouter = require('./yachts.js');
const reviewsRouter = require('./reviews.js');
const yachtImagesRouter = require('./yacht-images.js');
const bookingsRouter = require('./bookings.js');
const { restoreUser } = require("../../utils/auth.js");
const uploadRouter = require('./upload.js');
// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/reviews', reviewsRouter);
router.use('/users', usersRouter);
router.use('/yachts', yachtsRouter);
router.use('/yacht-images', yachtImagesRouter);
router.use('/upload', uploadRouter);
router.use('/bookings', bookingsRouter)
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
