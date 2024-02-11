import { Logger } from '@/application/protocols/gateways/logger.interface';
import { GetKnight } from '@/application/usecases/get-knight';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('/knights')
export class GetKnightController {
  constructor(
    private readonly getKnight: GetKnight,
    private readonly logger: Logger,
  ) {}

  @Get('/:id')
  async handle(@Param('id') id: string) {
    try {
      this.logger.info(GetKnightController.name, `Getting knight ${id}`);

      const knight = await this.getKnight.execute(id);

      this.logger.info(
        GetKnightController.name,
        `Found ${knight.id} - ${knight.name} knight.`,
      );

      return knight;
    } catch (error) {
      this.logger.error(
        GetKnightController.name,
        `Error on getting knight ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
