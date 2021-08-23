export type DtoType = 'boolean' | 'number' | 'string';

export type DataType = DtoType
	| 'text'
	| 'integer'
	| 'decimal'
	| 'float'
	| 'money'
	| 'boolean'
	| 'bit'
	| 'binary'
	| 'UUID'
	| 'GUID'
	| 'datetime'
	| 'date'
	;

export const dataType2dtoType = (type: DataType): DtoType => {
	switch (type) {
		case 'string':
			return 'string';
		case 'boolean':
			return 'boolean';
		case 'integer':
			return 'number';
		case 'float':
			return 'number';
		case 'bit':
			return 'boolean';
		case 'date':
			return 'string';
		case 'datetime':
			return 'string';
		default:
			throw new Error('unknown data type: ' + type);
	}
}

