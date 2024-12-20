import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Request, UseGuards, InternalServerErrorException, Res, UseFilters } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { RequestProps, CreateUser, UpdateUser, DeleteUser, FindUsers, ToggleUser, GenerateToken, RecoveryPassword, UserProps} from '@repo/core';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomFilter } from 'src/errors/custom/custom.filter';
import { BcryptProvider } from 'src/providers/bcrypt.provider';
import { JwtProvider } from 'src/providers/jwt.provider';
import { UserPrisma } from 'src/providers/user.prisma';
import { UserService } from './user.service';



@Controller('users')
@UseFilters(CustomFilter)
export class UserController {

  constructor(
    private readonly repo: UserPrisma,
    private readonly crypto: BcryptProvider,
    private readonly tokenProvider: JwtProvider,
    private readonly userService: UserService
  ) { }

  //registro de usuários será aberto?
  @Post("register")
  async register(@Body() data: UserProps, @Res() res: Response) {

    const usecase = new CreateUser(this.repo, this.crypto, this.tokenProvider)
    const result = await usecase.execute(data)

    if (result.success) {
      res.status(result?.status ?? 200).json({
        status: result.status,
        message: result.message,
        data: result.data
      })
      
    } else {
      throw new HttpException(result.message, result.status, { cause: result.errors })
    }
  }

  @Post("esqueci-senha")
  async forgot(@Body() data: RequestProps) {
    try {
      const email = data?.user.email
      const usecase = new GenerateToken(this.repo);
      const user = await usecase.execute(email)
      if(!user){
        throw new BadRequestException("Email não encontrado");
      }else{
        await this.userService.sendEmail(user.email, user.recoveryToken);
        return user
      }
    } catch (error) {
      return error.message
    }
  }

  @Put("recuperar-senha")
  async recovery(@Body() data: any,@Query('email') email: string, @Query('token') token: string) {
    try {
      const usecase = new RecoveryPassword(this.repo, this.crypto);
      data = {...data, email, token}
      await usecase.execute(data)
      
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Res() res: Response) {

    const usecase = new FindUsers(this.repo)
    const result = await usecase.execute()

    if (result.success) {
      res.status(result?.status ?? 200).json({
        status: result.status,
        message: result.message,
        data: result.data
      })

    } else {
      throw new HttpException(result.message, result.status, { cause: result.errors })
    }
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @Res() res: Response) {

    const usecase = new FindUsers(this.repo)
    const result = await usecase.execute(id)

    if (result.success) {
      res.status(result?.status ?? 200).json({
        status: result.status,
        message: result.message,
        data: result.data
      })

    } else {
      throw new HttpException(result.message, result.status, { cause: result.errors })
    }
  }

  @Put()
  @UseGuards(AuthGuard)
  async update(@Body() data: UserProps, @Res() res: Response) {

    const usecase = new UpdateUser(this.repo, this.crypto)
    const result = await usecase.execute(data)

    if (result.success) {
      res.status(result?.status ?? 200).json({
        status: result.status,
        message: result.message,
        data: result.data
      })

    } else {
      throw new HttpException(result.message, result.status, { cause: result.errors })
    }

  }

  @Post("toggle/:id")
  @UseGuards(AuthGuard)
  async toggleStatus(@Param('id') id: string, @Res() res: Response) {

    const usecase = new ToggleUser(this.repo)
    const result = await usecase.execute(id)

    if (result.success) {
      res.status(result?.status ?? 200).json({
        status: result.status,
        message: result.message,
        data: result.data
      })

    } else {
      throw new HttpException(result.message, result.status, { cause: result.errors })
    }
  }

  //usuários podem ser excluídos ou só inativados?
  @Delete(":id")
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @Res() res: Response) {

    const usecase = new DeleteUser(this.repo)
    const result = await usecase.execute(id)

    if (result.success) {
      res.status(result?.status ?? 200).json({
        status: result.status,
        message: result.message,
        data: result.data
      })

    } else {
      throw new HttpException(result.message, result.status, { cause: result.errors })
    }

  }

}
