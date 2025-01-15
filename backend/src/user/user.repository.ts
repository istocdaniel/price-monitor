import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity'; // Importáld a User entitást

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // Itt adhatsz hozzá egyéni lekérdezéseket
}
