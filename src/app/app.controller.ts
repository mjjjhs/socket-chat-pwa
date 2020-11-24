import {Controller, Get, HttpCode} from '@nestjs/common';

@Controller('health')
export class AppController {

    @Get()
    @HttpCode(200)
    health(){}
}
