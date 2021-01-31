const express = require('express');
const router = express.Router();

const userRouter = require('./user');
// const authRouter = require('./auth');
// const categoriesRouter = require('./categories');
// const brandsRouter =   require('./brands');
// const AwsRouter = require('./aws');
// const promotionRouter = require('./promotion');
// const oilPriceRouter = require('./oilPrice');
// const externalRouter = require('./external');
router.all('/', ((req, res, next) => {
    res.send(
        `<div style="margin: auto; width: 50%; padding: 10px">
            <h1>Welcome to API</h1>
            <p>${req.hostname}${req.baseUrl.toString()}</p>
        </div>`)
}))
router.use('/user', userRouter);
// router.use('/auth', authRouter);
// router.use('/categories', categoriesRouter);
// router.use('/brands', brandsRouter);
// router.use('/aws', AwsRouter);
// router.use('/promotion', promotionRouter);
// router.use('/oilPrice', oilPriceRouter)
// router.use('/external', externalRouter)

module.exports = router;
