import {Body, Controller, HttpCode, Post,} from '@nestjs/common';
import {AlertGateway} from "./alert.gateway";

@Controller('alert')
export class AlertController {
    constructor( private alertGateWay : AlertGateway) {}

    @Post()
    @HttpCode(200)
    sendAlertToAll(@Body() dto: {message : string}){
        this.alertGateWay.sendToAll(dto.message);
        return dto;
    }

}
