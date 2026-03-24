import { getServerDB } from '@/database/core/db-adaptor';
import { UserModel } from '@/database/models/user';

import { trpc } from '../init';

export const serverDatabase = trpc.middleware(async (opts) => {
  const serverDB = await getServerDB();
  const userId = opts.ctx.userId;

  if (process.env.LOCAL_NO_AUTH === '1' && userId) {
    await UserModel.makeSureUserExist(serverDB, userId);
  }

  return opts.next({
    ctx: { serverDB },
  });
});
