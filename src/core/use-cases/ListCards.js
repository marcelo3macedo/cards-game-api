class ListCards {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute() {
    return await this.cardRepository.findAll();
  }
}

module.exports = ListCards;