const {Router} = require('express');
const Link = require('../models/Link');
const router = Router();
const auth = require('../middleware/auth.middleware');
const config = require('config');
const shortId = require('shortid');

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl');
        const {from} = req.body;

        const code = shortId.generate();

        const exists = await Link.findOne({from});

        if(exists) {
           return res.json({link: exists})
        }

        const to = baseUrl + '/t/' + code;

        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save();

        res.status(201).json({link})

    } catch (e) {
        res.status(500).json({message: "Something went wrong. Please, try again!"})
    }
});

    
router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({owner: req.user.userId});
        const result = await res.json(links);
    } catch (e) {
        res.status(500).json({message: "Something went wrong. Please, try again!"})
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const links = await Link.findById(req.params.id);
        const result = await res.json(links);
    } catch (e) {
        res.status(500).json({message: "Something went wrong. Please, try again!"})
    }
})



module.exports = router;