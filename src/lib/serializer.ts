// BCS Serialization Utilities — Bun + SolidJS + TypeScript

// String
export function bcsSerializeString(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(str);
  const lengthBytes: number[] = [];
  let temp = utf8Bytes.length;
  while (temp > 0x7f) {
    lengthBytes.push((temp & 0x7f) | 0x80);
    temp >>= 7;
  }
  lengthBytes.push(temp);

  const result = new Uint8Array(lengthBytes.length + utf8Bytes.length);
  result.set(lengthBytes, 0);
  result.set(utf8Bytes, lengthBytes.length);
  return result;
}

// Bytes
export function bcsSerializeBytes(bytes: Uint8Array): Uint8Array {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error("Expected Uint8Array for vector<u8>");
  }
  const lengthBytes: number[] = [];
  let temp = bytes.length;
  while (temp > 0x7f) {
    lengthBytes.push((temp & 0x7f) | 0x80);
    temp >>= 7;
  }
  lengthBytes.push(temp);

  const result = new Uint8Array(lengthBytes.length + bytes.length);
  result.set(lengthBytes, 0);
  result.set(bytes, lengthBytes.length);
  return result;
}

// Bool
export function bcsSerializeBool(value: boolean): Uint8Array {
  if (typeof value !== "boolean") {
    throw new Error("Value must be a boolean");
  }
  return new Uint8Array([value ? 1 : 0]);
}

// u8
export function bcsSerializeU8(value: number): Uint8Array {
  if (typeof value !== "number" || value < 0 || value > 0xff || !Number.isInteger(value)) {
    throw new Error("Value must be a u8 integer (0 - 255)");
  }
  return new Uint8Array([value]);
}

// u16
export function bcsSerializeU16(value: number): Uint8Array {
  if (typeof value !== "number" || value < 0 || value > 0xffff || !Number.isInteger(value)) {
    throw new Error("Value must be a u16 integer (0 - 65535)");
  }
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setUint16(0, value, true);
  return new Uint8Array(buffer);
}

// u32
export function bcsSerializeU32(value: number): Uint8Array {
  if (typeof value !== "number" || value < 0 || value > 0xffffffff || !Number.isInteger(value)) {
    throw new Error("Value must be a u32 integer (0 - 4294967295)");
  }
  const buffer = new ArrayBuffer(4);
  new DataView(buffer).setUint32(0, value, true);
  return new Uint8Array(buffer);
}

// u64
export function bcsSerializeU64(value: number | bigint): Uint8Array {
  const big = BigInt(value);
  if (big < 0n || big > 0xffffffffffffffffn) {
    throw new Error("Value must be a u64 integer (0 - 2^64-1)");
  }
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setBigUint64(0, big, true);
  return new Uint8Array(buffer);
}

// u128
export function bcsSerializeU128(value: number | bigint): Uint8Array {
  const big = BigInt(value);
  if (big < 0n || big > (1n << 128n) - 1n) {
    throw new Error("Value must be a u128 integer (0 - 2^128-1)");
  }
  const buffer = new ArrayBuffer(16);
  const view = new DataView(buffer);
  let temp = big;
  for (let i = 0; i < 16; i++) {
    view.setUint8(i, Number(temp & 0xffn));
    temp >>= 8n;
  }
  return new Uint8Array(buffer);
}

// u256
export function bcsSerializeU256(value: number | bigint): Uint8Array {
  const big = BigInt(value);
  if (big < 0n || big > (1n << 256n) - 1n) {
    throw new Error("Value must be a u256 integer (0 - 2^256-1)");
  }
  const buffer = new ArrayBuffer(32);
  const view = new DataView(buffer);
  let temp = big;
  for (let i = 0; i < 32; i++) {
    view.setUint8(i, Number(temp & 0xffn));
    temp >>= 8n;
  }
  return new Uint8Array(buffer);
}

// Address (expects hex string with 0x prefix, 32 bytes)
export function bcsSerializeAddress(addr: string): Uint8Array {
  if (typeof addr !== "string" || !addr.startsWith("0x")) {
    throw new Error("Address must be a hex string starting with 0x");
  }
  const bytes = hexStringToUint8Array(addr);
  if (bytes.length !== 32) {
    throw new Error("Address must be exactly 32 bytes (64 hex characters after 0x)");
  }
  return bytes;
}

// Hex helper
export function hexStringToUint8Array(hexString: string): Uint8Array {
  if (hexString.startsWith("0x") || hexString.startsWith("0X")) {
    hexString = hexString.slice(2);
  }
  if (hexString.length % 2 !== 0) throw new Error("Invalid hex string length");
  const byteLength = hexString.length / 2;
  const uint8Array = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    uint8Array[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return uint8Array;
}

// Helper: encode ULEB128 length
function encodeULEB128(len: number): Uint8Array {
  const bytes: number[] = [];
  let temp = len;
  while (temp > 0x7f) {
    bytes.push((temp & 0x7f) | 0x80);
    temp >>= 7;
  }
  bytes.push(temp);
  return new Uint8Array(bytes);
}

// vector<String>
export function bcsSerializeVectorString(arr: string[]): Uint8Array {
  const encodedElements = arr.map(bcsSerializeString);
  const lengthBytes = encodeULEB128(arr.length);
  const totalLength = lengthBytes.length + encodedElements.reduce((sum, e) => sum + e.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  result.set(lengthBytes, offset);
  offset += lengthBytes.length;
  encodedElements.forEach((e) => {
    result.set(e, offset);
    offset += e.length;
  });
  return result;
}

// vector<Bool>
export function bcsSerializeVectorBool(arr: boolean[]): Uint8Array {
  const encodedElements = arr.map(bcsSerializeBool);
  const lengthBytes = encodeULEB128(arr.length);
  const result = new Uint8Array(lengthBytes.length + encodedElements.length);
  result.set(lengthBytes, 0);
  encodedElements.forEach((b, i) => (result[lengthBytes.length + i] = b[0]));
  return result;
}

// vector<vector<u8>>
export function bcsSerializeVectorBytes(arrOfArrs: number[][]): Uint8Array {
  const encodedElements = arrOfArrs.map((a) => bcsSerializeBytes(new Uint8Array(a)));
  const lengthBytes = encodeULEB128(arrOfArrs.length);
  const totalLength = lengthBytes.length + encodedElements.reduce((sum, e) => sum + e.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  result.set(lengthBytes, offset);
  offset += lengthBytes.length;
  encodedElements.forEach((e) => {
    result.set(e, offset);
    offset += e.length;
  });
  return result;
}

// vector<u8> (flat)
export function bcsSerializeVectorU8(arr: number[] | Uint8Array): Uint8Array {
  const bytes = arr instanceof Uint8Array ? arr : new Uint8Array(arr);
  const lengthBytes = encodeULEB128(bytes.length);
  const result = new Uint8Array(lengthBytes.length + bytes.length);
  result.set(lengthBytes, 0);
  result.set(bytes, lengthBytes.length);
  return result;
}

// vector<u64>
export function bcsSerializeVectorU64(arr: (number | bigint)[]): Uint8Array {
  const encodedElements = arr.map(bcsSerializeU64);
  const lengthBytes = encodeULEB128(arr.length);
  const totalLength = lengthBytes.length + encodedElements.reduce((sum, e) => sum + e.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  result.set(lengthBytes, offset);
  offset += lengthBytes.length;
  encodedElements.forEach((e) => {
    result.set(e, offset);
    offset += e.length;
  });
  return result;
}

// vector<address>
export function bcsSerializeVectorAddress(arr: string[]): Uint8Array {
  const encodedElements = arr.map(bcsSerializeAddress);
  const lengthBytes = encodeULEB128(arr.length);
  const totalLength = lengthBytes.length + encodedElements.reduce((sum, e) => sum + e.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  result.set(lengthBytes, offset);
  offset += lengthBytes.length;
  encodedElements.forEach((e) => {
    result.set(e, offset);
    offset += e.length;
  });
  return result;
}

// TypeTag types (server-side safe — no window dependency)
export type BasicType =
  | "address"
  | "bool"
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "u128"
  | "u256"
  | "string";

export interface StructTagParsed {
  kind: "struct";
  address: string;
  module: string;
  name: string;
  typeArgs: TypeTagParsed[];
}

export interface BasicTagParsed {
  kind: BasicType;
}

export interface VectorTagParsed {
  kind: "vector";
  inner: TypeTagParsed;
}

export type TypeTagParsed = StructTagParsed | BasicTagParsed | VectorTagParsed;

export function parseTypeTag(typeString: string): TypeTagParsed {
  typeString = typeString.trim();

  const basicTypes: BasicType[] = ["address", "bool", "u8", "u16", "u32", "u64", "u128", "u256", "string"];
  if (basicTypes.includes(typeString as BasicType)) {
    return { kind: typeString as BasicType };
  }

  if (typeString.startsWith("vector<") && typeString.endsWith(">")) {
    const inner = typeString.slice(7, -1);
    return { kind: "vector", inner: parseTypeTag(inner) };
  }

  if (typeString.includes("::")) {
    const ltIdx = typeString.indexOf("<");
    const base = ltIdx === -1 ? typeString : typeString.slice(0, ltIdx);
    const parts = base.split("::");
    if (parts.length !== 3) throw new Error(`Invalid struct type: ${typeString}`);
    const typeArgs: TypeTagParsed[] = [];
    if (ltIdx !== -1) {
      const inner = typeString.slice(ltIdx + 1, -1);
      typeArgs.push(parseTypeTag(inner));
    }
    return {
      kind: "struct",
      address: parts[0],
      module: parts[1],
      name: parts[2],
      typeArgs,
    };
  }

  throw new Error(`Unsupported type: ${typeString}`);
}