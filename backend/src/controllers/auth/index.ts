import * as v from '@utils/validators';
import * as passwordUtils from '@utils/password';
import * as sessionUtils from '@utils/sessions';
import * as usersModel from '@models/users';
import * as sessionsModel from '@models/sessions';
import { AuthApi } from '@web-api';
import { createController } from '@utils/controllers';
import { ErrorResponse } from '@utils/error-handler';

export const initialize = createController<AuthApi.Initialize>(
  async (req, res) => {
    const { userId, email, name, role, category } = req.user;

    return {
      data: { userId, email, name, role, category },
    };
  }
);

export const login = createController<AuthApi.Login>(async (req, res) => {
  const { email, password } = req.body;

  if (!v.isEmail(email)) {
    throw new ErrorResponse('INVALID_PARAMS', 'Invalid email');
  }

  if (!v.isValidPasswordFormat(password, 8)) {
    throw new ErrorResponse('INVALID_PARAMS', 'Invalid password');
  }

  const user = await usersModel.getUserByEmail()(email);

  if (!user) {
    throw new ErrorResponse('UNAUTHORIZED', 'Invalid email or password');
  }

  if (!user.password) {
    throw new ErrorResponse('UNAUTHORIZED', 'Invalid email or password');
  }

  const isMatch = await passwordUtils.comparePassword(password, user.password);

  if (!isMatch) {
    throw new ErrorResponse('UNAUTHORIZED', 'Invalid username or password');
  }

  const sessionId = await sessionsModel.createSession()({
    userId: user.userId,
  });

  sessionUtils.setSessionCookie(sessionId, res);
  sessionUtils.signSessionToken(sessionId);

  return { statusCode: 204 };
});

export const getProfile = createController<AuthApi.GetProfile>(
  async (req, res) => {
    const { userId } = req.user;

    const user = await usersModel.getUser()(userId);

    if (!user) {
      throw new ErrorResponse('UNAUTHORIZED', 'Unable to get profile');
    }

    return {
      data: { name: user.displayName, email: user.email },
    };
  }
);

export const logout = createController<AuthApi.Logout>(async (req, res) => {
  const { sessionId } = req.user;

  await sessionsModel.updateSession()(sessionId, {
    revokeType: 'sign_out',
    revokeAt: new Date(),
    lastActiveAt: new Date(),
  });

  sessionUtils.removeSessionCookie(res);

  return { statusCode: 204 };
});
