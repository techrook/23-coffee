import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the currently authenticated user or a specific property.
 * 
 * @param data - (Optional) A specific property of the user to extract (e.g., 'id', 'email').
 * @param ctx - The execution context to access the request.
 * @returns The user object or a specific property from the JWT payload.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log(user) 
    return data ? user?.[data] : user;
  },
);
