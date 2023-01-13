import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config/dist';
import { Injectable } from '@nestjs/common';
import { CustomerResponse } from '../customers/dto/customer-response.dto';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
        
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
    
  }

  async validate(customer: CustomerResponse) {
    return {
      id: customer.id,
      name: customer.name,
      userType: customer.userType,
    };
  }
}
