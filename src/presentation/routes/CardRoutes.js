const { Router } = require('express');
const CardController = require('../controllers/CardController');
const SequelizeCardRepository = require('../../infrastructure/repositories/SequelizeCardRepository');

const router = Router();

const cardRepository = new SequelizeCardRepository();
const cardController = new CardController(cardRepository);

router.get('/', (req, res) => cardController.handleList(req, res));

module.exports = router;