import { Logger } from '@/application/protocols/gateways/logger.interface';
import { DeleteKnight } from '@/application/usecases/delete-knight';
import { Controller, Delete, Param } from '@nestjs/common';

@Controller('/knights')
export class DeleteKnightController {
  constructor(
    private readonly deleteKnight: DeleteKnight,
    private readonly logger: Logger,
  ) {}

  @Delete('/:id')
  async handle(@Param('id') id: string) {
    try {
      this.logger.info(DeleteKnightController.name, `Deleting knight ${id}`);

      await this.deleteKnight.execute({
        id,
      });

      this.logger.info(DeleteKnightController.name, `Knight ${id} deleted.`);
    } catch (error) {
      this.logger.error(
        DeleteKnightController.name,
        `Error on deleting knight ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
