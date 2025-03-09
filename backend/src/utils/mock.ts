import User from '@entities/User';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import { users } from './dataMock';

const mocks = async (): Promise<void> => {
  try {
    const [hasUsers] = await Promise.all([User.count()]);

    if (hasUsers > 0) {
      console.log('Mocks ok');
      return;
    }

    for (const user of users ) {

      const passwordHash = await bcrypt.hash(user.password! as string, 10);

      const secret = speakeasy.generateSecret({
        name: `Waitlist: ${user.email}`,
      });

      const usercreated = await User.create({
        name: user.name,
        email: user.email,
        passwordHash,
        secret: secret.base32,
      }).save();

      console.log(`Usuário ${usercreated.name}, ${usercreated.id}`)
    }

  } catch (error) {
    console.log('Erro ao rodar mocks!', error);
  }
};

export default mocks;
