// 将 JSON 转换为 Go 结构体的函数
export function JsonToGoStruct(text: string, structName: string): string {
    try {
        // 尝试解析 JSON
        const parsedJson = JSON.parse(text);
        // 用于存储嵌套结构体的字符串
        let nestedStructs = '';
        // 计数器，用于生成唯一的嵌套结构体名称
        let n = 0;
        // 存储字段到结构体名称的映射，用于处理嵌套结构体
        let structNameSwitch: {[key: string]:string} = {};
        // 遍历 JSON 中的每个键
        for (const key in parsedJson) {
            // 检查键是否属于对象自身，并且值为数组
            if (parsedJson.hasOwnProperty(key) && Array.isArray(parsedJson[key])) {
                // 生成数组元素的结构体名称
                const itemType = capitalizeFirstLetter(`${key}Item${n}`);
                // 生成嵌套结构体的字符串，并将其添加到嵌套结构体列表中
                nestedStructs += generateGoStruct(parsedJson[key][0], itemType, 0, structNameSwitch);
                // 将字段名映射到对应的结构体名称
                structNameSwitch[key] = itemType;
                // 增加计数器
                n += 1;
            } else if (typeof parsedJson[key] === 'object' && parsedJson[key] !== null) {
                // 生成嵌套结构体的结构体名称
                const itemType = capitalizeFirstLetter(`${key}Item${n}`);
                // 生成嵌套结构体的字符串，并将其添加到嵌套结构体列表中
                nestedStructs += generateGoStruct(parsedJson[key], itemType, 0, structNameSwitch);
                // 将字段名映射到对应的结构体名称
                structNameSwitch[key] = itemType;
                // 增加计数器
                n += 1;
            }
        }
        // 生成主结构体的字符串
        const mainStruct = generateGoStruct(parsedJson, structName, 0, structNameSwitch);
        // 将主结构体和嵌套结构体列表合并为最终结果
        return `${mainStruct}\n${nestedStructs}`;
    } catch (error) {
        // JSON 解析错误处理
        return `解析 JSON 出错：${error}`;
    }
}

// 生成 Go 结构体的函数
function generateGoStruct(data: any, name: string, indentationLevel: number, structNameSwitch: {[key: string]:string}): string {
    // 根据缩进级别生成缩进字符串
    const indent = "    ".repeat(indentationLevel);
    // 检查数据类型是否为对象
    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
        // 构建结构体的开头部分
        let struct = `${indent}type ${name} struct {\n`;
        // 遍历对象的键
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                // 确定字段类型
                const fieldType = determineFieldType(key, data[key], structNameSwitch);
                // 构建结构体字段的字符串
                struct += `${indent}    ${capitalizeFirstLetter(key)} ${fieldType} \`json:"${key}"\`\n`;
            }
        }
        // 添加结构体的结束部分
        struct += `${indent}}\n`;
        return struct;
    }
    // 生成非对象类型的结构体
    return `${indent}type ${name} ${determineFieldType("", data, structNameSwitch)}\n`;
}

// 确定字段类型的函数
function determineFieldType(key:string, value: any, structNameSwitch: {[key: string]:string}): string {
    // 根据值的类型返回对应的 Go 类型
    if (typeof value === 'string') {
        return 'string';
    } else if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'float64';
    } else if (typeof value === 'boolean') {
        return 'bool';
    } else if (Array.isArray(value)) {
        if (value.length > 0) {
            // 递归确定数组元素的类型
            return `[]${determineFieldType(key, value[0], structNameSwitch)}`;
        }
        return '[]interface{}';
    } else if (typeof value === 'object' && value !== null) {
        // 检查字段名是否在 structNameSwitch 中，并返回对应的结构体名称
        if (key in structNameSwitch) {
            return structNameSwitch[key];
        }
        return 'struct{}';
    }
    // 默认返回 interface{} 类型
    return 'interface{}';
}

// 将字符串首字母大写的函数
function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
