import { ClassConstructor } from 'class-transformer';
import { ModuleMocker } from 'jest-mock';

/**
 * Create mock instance of given class or function constructor
 *
 * @param classConstructor Class constructor
 * @returns New instance of given class constructor with all methods being mocked
 */
export function createMockInstance<T>(
    classConstructor: ClassConstructor<T>
): jest.Mocked<T> {
    const mocker = new ModuleMocker(global);

    // get metadata from class constructor or function
    const component = mocker.getMetadata(classConstructor);

    if (component === null) {
        throw Error(
            `createMockInstance failed to getMetadata for: ${classConstructor.name}`
        );
    }

    // use metadata to create new mocked class
    const Mock = mocker.generateFromMetadata<jest.Mocked<any>>(
        component
    );

    // instantiate and return mocked class with all methods stubbed
    return new Mock();
}
