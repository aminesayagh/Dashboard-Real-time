import { z } from 'zod';
import { Types } from 'mongoose';

export const zObjectId = z.instanceof(Types.ObjectId);