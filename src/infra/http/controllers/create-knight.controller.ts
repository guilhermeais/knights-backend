import { Logger } from '@/application/protocols/gateways/logger.interface';
import { CreateKnight } from '@/application/usecases/create-knight';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateKnightDto } from '../dto/create-knight.dto';
import { KnightPresenter } from '../presenters/knight.presenter';

@Controller('/knights')
export class CreateKnightController {
  constructor(
    private readonly createKnight: CreateKnight,
    private readonly logger: Logger,
  ) {}

  @Post()
  async handle(@Body() body: CreateKnightDto) {
    try {
      this.logger.info(
        CreateKnightController.name,
        `Creating a new knight with name: ${body.name}`,
      );
      const knight = await this.createKnight.execute(body);

      this.logger.info(
        CreateKnightController.name,
        `Knight ${knight.name} created with id: ${knight.id}`,
      );

      return KnightPresenter.toHTTP(knight);
    } catch (error) {
      this.logger.error(
        CreateKnightController.name,
        `Error on creating kngith ${body.name}: ${error.message}`,
      );
      throw error;
    }
  }
}
