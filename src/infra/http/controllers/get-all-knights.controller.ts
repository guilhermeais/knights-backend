import { Logger } from '@/application/protocols/gateways/logger.interface';
import { GetAllKnights } from '@/application/usecases/get-all-knights';
import { Controller, Get, Query } from '@nestjs/common';
import { GetAllKnightsDto } from '../dto/get-all-knights.dto';

@Controller('/knights')
export class GetAllKnightsController {
  constructor(
    private readonly getAllKnights: GetAllKnights,
    private readonly logger: Logger,
  ) {}

  @Get()
  async handle(@Query() query: GetAllKnightsDto) {
    try {
      const { type } = query;
      const limit = query.limit ?? 10;
      const page = query.page ?? 1;

      this.logger.info(
        GetAllKnightsController.name,
        `Getting all knights with query: ${JSON.stringify(query, null, 2)}`,
      );
      const response = await this.getAllKnights.execute({
        limit,
        page,
        type,
      });

      this.logger.info(
        GetAllKnightsController.name,
        `Found ${response.data.length} knights with ${response.total} total knights and ${response.totalPages} pages.`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        GetAllKnightsController.name,
        `Error on getting knights ${JSON.stringify(query, null, 2)}: ${error.message}`,
      );
      throw error;
    }
  }
}
