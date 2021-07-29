import { auth, app } from 'firebase-admin';
import { AddUserInput, UpdateUserInput } from '../generated/graphql';

class UserService {
  private auth: auth.Auth;

  constructor(app: app.App) {
    this.auth = auth(app);
  }

  async getUserByEmail(email: string): Promise<auth.UserRecord> {
    try {
      const user = await this.auth.getUserByEmail(email);

      return user;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return;
      }

      throw Error(error);
    }
  }

  async addUser(data: AddUserInput): Promise<auth.UserRecord> {
    const user = await this.auth.createUser({
      email: data.email
    });

    if (data.admin) {
      await this.auth.setCustomUserClaims(user.uid, { admin: true });
    }

    return user;
  }

  async updateUserInfo(data: UpdateUserInput): Promise<auth.UserRecord> {
    const { uid, ...properties } = data;
    const user = await this.auth.updateUser(uid, properties);

    return user;
  }
}

export default UserService;
