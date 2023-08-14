/**
 * 将 MySQL 创建表语法转换为 Go 结构体字符串
 * @param mysqlCreateTable MySQL 创建表语法字符串
 * @returns 转换后的 Go 结构体字符串
 */
export function TableSqlToGoStruct(mysqlCreateTable: string): string {
    const lines = mysqlCreateTable.split('\n');
    const structNameMatches = lines[0].match(/create table `?(\w+)`?/i);
    const structName = structNameMatches?.[1];
    // 处理 match 可能为 null
    if (!structName) return "";

    const exportedStructName = convertToCamelCase(structName);

    let goStruct = `type ${capitalizeFirstLetter(exportedStructName)} struct {\n`;

    let skippingPrimaryKeys = false;

    for (let i = 1; i < lines.length - 1; i++) {
        const line = lines[i].trim();

        if (line.startsWith(')')) {
            break;
        }

        if (line.includes('primary key')) {
            skippingPrimaryKeys = true;
            continue; // 跳过 primary key 行
        }

        const fieldMatches = line.match(/`?(\w+)`?\s+(\w+)/);
        if (!fieldMatches) continue;

        const fieldName = fieldMatches[1];
        const fieldType = fieldMatches[2];

        const commentMatches = line.match(/comment\s+'(.*)'/i);
        const comment = commentMatches ? commentMatches[1] : '';

        if (!fieldName || !fieldType) {
            continue; // 跳过不完整的行
        }

        const goFieldName = convertToCamelCase(fieldName);
        const exportedFieldName = capitalizeFirstLetter(goFieldName);
        const commentLine = comment ? ` // ${comment}` : '';

        goStruct += `    ${exportedFieldName} ${getFieldType(fieldType)} \`json:"${fieldName}"\`${commentLine}\n`;
    }

    goStruct += '}\n';

    return goStruct;
}



/**
 * 将字符串首字母大写
 * @param str 输入字符串
 * @returns 首字母大写后的字符串
 */
function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 将下划线命名转换为大驼峰命名
 * @param str 输入字符串
 * @returns 大驼峰命名后的字符串
 */
function convertToCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
}

/**
 * 获取 MySQL 数据类型对应的 Go 类型
 * @param mysqlType MySQL 数据类型
 * @returns 对应的 Go 类型字符串
 */
function getFieldType(mysqlType: string): string {
    if (mysqlType.startsWith('int') || mysqlType.startsWith('tinyint') || mysqlType.startsWith('smallint') || mysqlType.startsWith('mediumint') || mysqlType.startsWith('bigint')) {
        return 'int';
    } else if (mysqlType.startsWith('float') || mysqlType.startsWith('double')) {
        return 'float64';
    } else if (mysqlType.startsWith('decimal')) {
        return 'decimal.Decimal'; // 需要导入 Decimal 库
    } else if (mysqlType.startsWith('varchar') || mysqlType.startsWith('char')) {
        return 'string';
    } else if (mysqlType.startsWith('text') || mysqlType.startsWith('mediumtext') || mysqlType.startsWith('longtext')) {
        return 'string';
    } else if (mysqlType.startsWith('datetime') || mysqlType.startsWith('timestamp')) {
        return 'time.Time'; // 需要导入 time 包
    } else if (mysqlType.startsWith('date')) {
        return 'string'; // 或者您可以使用一个日期库来更好地处理
    } else {
        return 'interface{}';
    }
}
