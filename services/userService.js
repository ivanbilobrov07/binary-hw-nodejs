import { userRepository } from "../repositories/userRepository.js";

class UserService {
  getAll() {
    const items = userRepository.getAll();
    return items;
  }

  create(userData) {
    const user = userRepository.create(userData);
    return user;
  }

  update(id, dataToUpdate) {
    const user = userRepository.update(id, dataToUpdate);

    if (!user || !user.id) {
      return null;
    }

    return user;
  }

  delete(id) {
    const items = userRepository.delete(id);

    if (!items.length) {
      return null;
    }
    return items[0];
  }

  search(search) {
    const item = userRepository.getOne(search);

    if (!item) {
      return null;
    }
    return item;
  }
}

const userService = new UserService();

export { userService };
