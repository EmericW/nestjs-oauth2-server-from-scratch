import { InvalidRequestException } from 'src/exceptions/invalid-request.exception';
import * as z from 'zod';

export const assert = <SchemaType extends z.ZodSchema>({
  schema,
  data,
  errorToThrow: ErrorToThrow,
}: {
  schema: SchemaType;
  data: any;
  errorToThrow?: new () => Error;
}): z.infer<SchemaType> => {
  return schema.parse(data, {
    errorMap: () => {
      if (ErrorToThrow) {
        throw new ErrorToThrow();
      }

      throw new InvalidRequestException();
    },
  });
};
