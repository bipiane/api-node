import {MigrationInterface, QueryRunner, getRepository} from 'typeorm';
import {Usuario} from '../entity/Usuario';

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new Usuario();
    user.username = 'admin';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'ADMIN';
    const userRepository = getRepository(Usuario);

    const exist = await userRepository.findOne({where: {username: user.username}});
    if (!exist) {
      await userRepository.save(user);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
