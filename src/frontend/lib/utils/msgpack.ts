async function encodeMsgpack(data: unknown): Promise<ArrayBuffer> {
  const msgpack = (await import("msgpack-lite")).default;
  const encoded = msgpack.encode(data);
  return encoded.buffer.slice(
    encoded.byteOffset,
    encoded.byteOffset + encoded.byteLength
  ) as ArrayBuffer;
}

async function decodeMsgpack(buffer: ArrayBuffer): Promise<unknown> {
  const msgpack = (await import("msgpack-lite")).default;
  return msgpack.decode(new Uint8Array(buffer));
}

export { encodeMsgpack, decodeMsgpack };
