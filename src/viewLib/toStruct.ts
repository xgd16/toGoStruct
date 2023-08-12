import {getStrType, StrType} from "./strType";
import {convertToGoStruct} from "./toStructHandler/TableSql";

export class ToStruct {
    // 转换前的
    fromText: string
    // 转换后的
    switchText: string = ''
    // 输入数据类型
    fromDataType: StrType
    constructor(from: string) {
        this.fromText = from
        // 判断输入数据类型
        this.fromDataType = getStrType(from)
    }

    getTo():string {
        switch (this.fromDataType) {
            case StrType.TableSql:
                this.switchText = convertToGoStruct(this.fromText)
                break
        }

        return this.switchText
    }
}