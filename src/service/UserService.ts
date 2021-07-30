import { auth, app } from 'firebase-admin';
import { AddUserInput, UpdateUserInput, User } from '../generated/graphql';

class UserService {
  private auth: auth.Auth;

  constructor(app: app.App) {
    this.auth = auth(app);
  }

  private mapUserRespone(data: auth.UserRecord): User {
    const { uid, email, displayName, phoneNumber, customClaims } = data;

    const admin =
      (customClaims && 'admin' in customClaims && (customClaims.admin as boolean)) || false;

    return {
      uid,
      email,
      displayName,
      phoneNumber,
      admin: admin
    };
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.auth.getUserByEmail(email);

      return this.mapUserRespone(user);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return;
      }

      throw Error(error);
    }
  }

  private async listAllUsers(nextPageToken?: string): Promise<User[]> {
    const { pageToken, users } = await this.auth.listUsers(1000, nextPageToken);

    let nextuserData: User[];
    if (pageToken) {
      nextuserData = await this.listAllUsers(pageToken);
    }

    const userData = users.map((user) => this.mapUserRespone(user));

    if (!nextuserData) {
      return userData;
    }

    return [...userData, ...nextuserData];
  }

  async getAllUser(): Promise<User[]> {
    return this.listAllUsers();
  }

  async addUser(data: AddUserInput): Promise<User> {
    const user = await this.auth.createUser({
      email: data.email
    });

    if (data.admin) {
      await this.auth.setCustomUserClaims(user.uid, { admin: true });
    }

    return this.mapUserRespone(user);
  }

  async updateUserInfo(data: UpdateUserInput): Promise<User> {
    const { uid, ...properties } = data;
    const user = await this.auth.updateUser(uid, properties);

    return this.mapUserRespone(user);
  }
}

export default UserService;
