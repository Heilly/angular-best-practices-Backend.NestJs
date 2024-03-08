import { BadRequestException, Body, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs  from "bcryptjs";
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {

  constructor( 
    @InjectModel( User.name) private userModel: Model<User>,
    private jwtService: JwtService){  }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try{
      const { password, ...userData } = createUserDto;
 //1. Encriptar la contraseña
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });
 // 2. Guardar el Usuario
    await newUser.save();

     //3. Generar el JWT
    //No enviar la contraseña
    const { password:_, ...userCode } = newUser.toJSON();

    
    return userCode;

    } catch ( error ) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException( 'Somthing terrible happen!!' )
    }
  }

  

  async register( registerUserDto: RegisterUserDto ){

    const user = await this.create( registerUserDto );
    /*const user = await this.create( {
      email: registerUserDto.email,
      name: registerUserDto.name,
      password: registerUserDto.password
    } );*/

    return {
      user,
      token: this.getJwtToken({id: user._id})
    }
    

  }
async login( @Body() loginDto: LoginUserDto ):Promise<LoginResponse>{

    const { email, password } = loginDto;

    const user = await this.userModel.findOne( { email });

    if( !user ) {
      throw new UnauthorizedException( 'Not valid credentials - email' );
    }
    if( !bcryptjs.compareSync(password, user.password) ){
      throw new UnauthorizedException( 'Not valid credencials - password' );
    }
    /*
      User { _id, name, email, roles }
      Token -> sdsdfsd.sdfsfd.sdfsf
      console.log( loginDto );
    */
    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({id: user.id})
    }
  }
  
  findAll() : Promise<User[]>{
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async findUserById(id: string){
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();
    console.log(rest);

    return rest;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
