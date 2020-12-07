import { MenuItem } from '@material-ui/core';
import * as lodash from "lodash"
import React from 'react';

export class Converter {
    private static items = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static enumToMenuItems(key: string, data: any) {
        if(Converter.items[key]) {
            return Converter.items[key]
        }
        const list = Object.keys(data)
            .map(val => 
                <MenuItem key={data[val]} value={data[val]}>{Converter.decamelCase(val)}</MenuItem>
            );

        Converter.items[key] = list;
        return list;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static getLabelForEnum(data: any, value: string) {
        const label = Object.keys(data).find(k => data[k] === value)
        return label ? Converter.decamelCase(label) : "Unspecified";
    }

    private static decamelCase(key: string) {
        return lodash.startCase(key);
    }
}