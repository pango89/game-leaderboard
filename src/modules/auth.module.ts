import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../passport/jwt.strategy';
import { jwtConstants } from '../configurations/constant';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: jwtConstants.accessTokenExpiry,
        algorithm: 'HS256',
        issuer: jwtConstants.issuer,
        jwtid: jwtConstants.jwtIdForAccessToken,
      },
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
