import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWT_SECRET } from 'src/constant';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub.id,
      name: payload.sub.name,
      email: payload.sub.email,
    };
  }

  private static extractJwtFromCookie(req: Request): string | null {
    if (req && req.cookies) {
      return req.cookies['rft'] || null;
    }
    return null;
  }
}
