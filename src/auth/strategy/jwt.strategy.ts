import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, 
      secretOrKey: process.env.JWT_SECRET, 
    });
  }

  /**
   * Validate the payload of the JWT.
   * This method runs automatically when the token is successfully parsed and validated.
   * @param payload - The payload decoded from the JWT.
   */
  async validate(payload: { userId: string; role: string }) {
    return { userId: payload.userId, role: payload.role }; 
  }
}