import { CreateKnight } from '@/application/usecases/create-knight';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateKnightDto } from '../dto/create-knight.dto';
import { KnightPresenter } from '../presenters/knight.presenter';

@Controller('/knights')
export class CreateKnightController {
  constructor(private readonly createKnight: CreateKnight) {}

  @Post()
  async handle(@Body() body: CreateKnightDto) {
    const knight = await this.createKnight.execute(body);

    return KnightPresenter.toHTTP(knight);
  }
}
