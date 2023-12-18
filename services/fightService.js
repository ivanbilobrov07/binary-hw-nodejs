import { fightRepository } from "../repositories/fightRepository.js";

class FightersService {
  getAll() {
    const items = fightRepository.getAll();
    return items;
  }

  create(fightData) {
    const fight = fightRepository.create(fightData);
    return fight;
  }
}

const fightersService = new FightersService();

export { fightersService };
