export enum StrType {
    Json,
    XML,
    TableSql,
}

export const GetStrTypeName = (strType: StrType): string => {
    switch (strType) {
        case StrType.Json:
            return "json"
        case StrType.TableSql:
            return "sql"
        case StrType.XML:
            return "xml"
    }
}

export const getStrType = (text:string):StrType => {
    let defaultStrType = StrType.Json
    // 判断字符串类型
    if (isValidJSON(text)) defaultStrType = StrType.Json
    if (isValidXML(text)) defaultStrType = StrType.XML
    if (isValidCreateTableSyntax(text)) defaultStrType = StrType.TableSql
    return defaultStrType
}
export function isValidCreateTableSyntax(query: string): boolean {
    const createTablePattern = /^CREATE\s+TABLE\s+\w+\s+\(/i;
    return createTablePattern.test(query);
}

export function isValidJSON(input: string): boolean {
    try {
        JSON.parse(input);
        return true;
    } catch (error) {
        return false;
    }
}

export function isValidXML(input: string): boolean {
    const xmlPattern = /^<\?xml\s+version=["'][\d.]+["']\s*\?>/;
    return xmlPattern.test(input);
}