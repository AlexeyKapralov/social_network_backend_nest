import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Device {
    @Prop()
    userId: string;

    @Prop()
    ip: string;

    @Prop()
    exp: string;

    @Prop()
    deviceName: string;

    @Prop()
    iat: string;

    static createDevice(
        userId: string,
        ip: string,
        exp: string,
        deviceName: string,
        iat: string,
    ) {
        const device = new this();

        device.deviceName = deviceName;
        device.userId = userId;
        device.ip = ip;
        device.exp = exp;
        device.iat = iat;

        return device
    }
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.methods = {};

DeviceSchema.statics = {
    createDevice: Device.createDevice,
};

export type DeviceStaticType = {
    createDevice: (
        userId: string,
        ip: string,
        exp: string,
        deviceName: string,
        iat: string) => DeviceDocument
}

export type DeviceDocument = HydratedDocument<Device>
export type DeviceModelType = Model<DeviceDocument> & DeviceStaticType
