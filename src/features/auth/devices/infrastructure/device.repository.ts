import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument, DeviceModelType } from '../domain/device.entity';

@Injectable()
export class DeviceRepository {
    constructor(
        @InjectModel(Device.name) private readonly deviceModel: DeviceModelType,
    ) {
    }

    /*
    * создаст новый девайс либо обновит даты (exp, iat) для старого
    */
    async createOrUpdateDevice(
        userId: string,
        ip: string,
        deviceName: string,
    ) {
        let device = await this.findDevice(
            userId,
            ip,
            deviceName,
        );

        if (!device) {
            const dateNow = new Date();
            const newDate = new Date(dateNow.setDate(dateNow.getDate() + 1));

            device = this.deviceModel.createDevice(
                userId,
                ip,
                deviceName,
                dateNow.toISOString(),
                newDate.toISOString()
            )

            return device
        }

        return this.updateDeviceLive(device._id.toString())
    }

    async findDevice(
        userId: string,
        ip: string,
        deviceName: string): Promise<DeviceDocument>
    {
        return this.deviceModel.findOne({
            userId: userId,
            ip: ip,
            deviceName: deviceName
        });
    }

    async updateDeviceLive(deviceId: string) {
        const dateNow = new Date();
        const newDate = new Date(dateNow.setDate(dateNow.getDate() + 1));
        return this.deviceModel.findOneAndUpdate(
            {_id: deviceId},
            {iat: dateNow.toISOString(), exp: newDate.toISOString()}
        )
    }

}