import {getStrType, StrType} from "./strType";
import {TableSqlToGoStruct} from "./toStructHandler/TableSql";
import {JsonToGoStruct} from "./toStructHandler/Json";

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

    getStrType():StrType {
        return this.fromDataType
    }

    getTo():string {
        switch (this.fromDataType) {
            case StrType.TableSql:
                this.switchText = TableSqlToGoStruct(this.fromText)
                break
            case StrType.Json:
                this.switchText = JsonToGoStruct(this.fromText, "YourStructName")
                break
        }

        return this.switchText
    }
}