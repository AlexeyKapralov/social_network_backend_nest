import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../devices/infrastructure/device.repository';
import { InterlayerNotice } from '../../../../../base/models/interlayer';


export class CreateDeviceCommand implements ICommand {
    constructor(
        public loginOrEmail: string,
        public ip: string,
        public deviceName: string,
    ) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase implements ICommandHandler<
    CreateDeviceCommand,
    InterlayerNotice<CreateDeviceResultType>
>{
   constructor(
      private deviceRepository: DeviceRepository
   ) {}

    async execute(command: CreateDeviceCommand): Promise<InterlayerNotice<CreateDeviceResultType>> {
       const device = await this.deviceRepository.createOrUpdateDevice(
           command.loginOrEmail,
           command.ip,
           command.deviceName
       )

        const notice = new InterlayerNotice<CreateDeviceResultType>

        notice.addData({deviceId: device._id.toString()})

        return notice
   }
}

export type CreateDeviceResultType = {
    deviceId: string
}