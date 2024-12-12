import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNumberOrNumberString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNumberOrNumberString',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === 'number' || !isNaN(Number(value));
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a number or a number string`;
                }
            }
        });
    };
}