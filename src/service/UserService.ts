import { auth, app } from 'firebase-admin';

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
}

export default UserService;
