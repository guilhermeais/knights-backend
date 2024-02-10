import { Logger } from '@/application/protocols/gateways/logger.interface';
import { UpdateKnight } from '@/application/usecases/update-knight';
import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateKnightDto } from '../dto/update-knight.dto';

@Controller('/knights')
export class UpdateKnightController {
  constructor(
    private readonly updateKnight: UpdateKnight,
    private readonly logger: Logger,
  ) {}

  @Patch('/:id')
  async handle(@Param('id') id: string, @Body() body: UpdateKnightDto) {
    try {
      this.logger.info(
        UpdateKnightController.name,
        `Updating knight: ${id} with ${JSON.stringify(body, null, 2)}`,
      );
      await this.updateKnight.execute({
        id,
        nickname: body.nickname,
        weapons: body.weapons,
      });

      this.logger.info(UpdateKnightController.name, `Knight ${id} updated!!`);
    } catch (error) {
      this.logger.error(
        UpdateKnightController.name,
        `Error on updating knigth ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
