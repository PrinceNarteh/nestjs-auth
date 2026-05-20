import * as tasks from './task.schema';
import * as users from './user.schema';

export const schema = {
  ...tasks,
  ...users,
};

export type Schema = typeof schema;
