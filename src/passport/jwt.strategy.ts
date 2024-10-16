import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../configurations/constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      issuer: jwtConstants.issuer,
      algorithms: ['HS256'],
      jsonWebTokenOptions: {
        jwtId: jwtConstants.jwtIdForAccessToken,
      },
    });
  }

  async validate(payload: any) {
    // return { userId: payload.sub, username: payload.username };
    return { ...payload };
  }
}
