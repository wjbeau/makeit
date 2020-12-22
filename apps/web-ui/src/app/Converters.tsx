import { MenuItem } from '@material-ui/core';
import * as lodash from "lodash"
import React from 'react';
import { PersonInfo } from '@makeit/types';


export class Converter {
    private static items = {};

    public static enumToMenuItems(key: string, data, exclude?) {
        if(Converter.items[key]) {
            return Converter.items[key]
        }
        const list = Object.keys(data)
            .filter(i => !exclude || !exclude.find(e => e === i))
            .map(val => 
                <MenuItem key={data[val]} value={data[val]}>{Converter.decamelCase(val)}</MenuItem>
            );

        Converter.items[key] = list;
        return list;
    }

    public static getLabelForEnum(data, value: string) {
        const label = Object.keys(data).find(k => data[k] === value)
        return label ? Converter.decamelCase(label) : "Unspecified";
    }

    public static convertAllDates(obj) {
        return Converter.mapValuesDeep(obj, Converter.convertToDate);
    }
    
    private static mapValuesDeep(obj, cb) {
        if (lodash.isArray(obj)) {
        return obj.map((innerObj) => Converter.mapValuesDeep(innerObj, cb));
        } else if (lodash.isObject(obj)) {
        return lodash.mapValues(obj, (val) => Converter.mapValuesDeep(val, cb));
        } else {
        return cb(obj);
        }
    }
  
    private static convertToDate(value) {
        if (Converter.isSerializedDate(value)) return new Date(value);
        return value;
    }
    
    private static isSerializedDate(value) {
        const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        return lodash.isString(value) && datePattern.test(value);
    }

    private static decamelCase(key: string) {
        if(key === "IMDb") {
            return key;
        }
        return lodash.startCase(key);
    }

    public static getInitials(person: PersonInfo) {
      const words = lodash.words(person.firstName + '' + person.lastName);
      return words.map((w) => lodash.capitalize(w).charAt(0)).join('');
    }
}