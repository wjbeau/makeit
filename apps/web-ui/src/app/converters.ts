import * as lodash from "lodash"

export class Converter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static enumToOptions(data: any) {
        return Object.keys(data)
            .map(key => {
                return {
                    id: data[key],
                    label: Converter.decamelCase(key)
                }
            });
    }

    private static decamelCase(key: string) {
        return lodash.startCase(key);
    }
}