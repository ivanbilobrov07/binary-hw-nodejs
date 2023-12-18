import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  getAll() {
    const items = fighterRepository.getAll();
    return items;
  }

  create(fighterData) {
    const fighter = fighterRepository.create(fighterData);
    return fighter;
  }

  update(id, dataToUpdate) {
    const fighter = fighterRepository.update(id, dataToUpdate);

    if (!fighter || !fighter.id) {
      return null;
    }

    return fighter;
  }

  delete(id) {
    const items = fighterRepository.delete(id);

    if (!items.length) {
      return null;
    }
    return items[0];
  }

  search(search) {
    const item = fighterRepository.getOne(search);

    if (!item) {
      return null;
    }

    return item;
  }
}

const fighterService = new FighterService();

export { fighterService };
