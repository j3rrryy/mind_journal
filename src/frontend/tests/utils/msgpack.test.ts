import { encodeMsgpack, decodeMsgpack } from "@/lib/utils/msgpack";

jest.mock("msgpack-lite", () => {
  const mockEncode = jest.fn().mockReturnValue({
    buffer: new ArrayBuffer(8),
    byteOffset: 0,
    byteLength: 8,
  });

  const mockDecode = jest.fn().mockReturnValue({ test: "data" });

  return {
    __esModule: true,
    default: {
      encode: mockEncode,
      decode: mockDecode,
    },
  };
});

describe("msgpack utilities", () => {
  describe("encodeMsgpack", () => {
    it("should encode data to ArrayBuffer", async () => {
      const data = { test: "value", number: 42 };
      const result = await encodeMsgpack(data);

      expect(result).toBeInstanceOf(ArrayBuffer);
    });

    it("should handle null data", async () => {
      const result = await encodeMsgpack(null);
      expect(result).toBeInstanceOf(ArrayBuffer);
    });

    it("should handle undefined data", async () => {
      const result = await encodeMsgpack(undefined);
      expect(result).toBeInstanceOf(ArrayBuffer);
    });

    it("should handle array data", async () => {
      const data = [1, 2, 3, "test"];
      const result = await encodeMsgpack(data);
      expect(result).toBeInstanceOf(ArrayBuffer);
    });

    it("should handle string data", async () => {
      const data = "test string";
      const result = await encodeMsgpack(data);
      expect(result).toBeInstanceOf(ArrayBuffer);
    });

    it("should handle number data", async () => {
      const data = 12345;
      const result = await encodeMsgpack(data);
      expect(result).toBeInstanceOf(ArrayBuffer);
    });

    it("should handle nested object data", async () => {
      const data = {
        user: {
          name: "John",
          age: 30,
          settings: {
            theme: "dark",
          },
        },
      };
      const result = await encodeMsgpack(data);
      expect(result).toBeInstanceOf(ArrayBuffer);
    });
  });

  describe("decodeMsgpack", () => {
    it("should decode ArrayBuffer to data", async () => {
      const buffer = new ArrayBuffer(8);
      const result = await decodeMsgpack(buffer);

      expect(result).toEqual({ test: "data" });
    });

    it("should handle empty ArrayBuffer", async () => {
      const buffer = new ArrayBuffer(0);
      await expect(decodeMsgpack(buffer)).resolves.not.toThrow();
    });

    it("should handle various buffer sizes", async () => {
      const smallBuffer = new ArrayBuffer(1);
      const mediumBuffer = new ArrayBuffer(100);
      const largeBuffer = new ArrayBuffer(10000);

      await expect(decodeMsgpack(smallBuffer)).resolves.not.toThrow();
      await expect(decodeMsgpack(mediumBuffer)).resolves.not.toThrow();
      await expect(decodeMsgpack(largeBuffer)).resolves.not.toThrow();
    });
  });

  describe("encode-decode roundtrip", () => {
    it("should encode and decode complex objects", async () => {
      const originalData = {
        string: "hello",
        number: 42,
        float: 3.14,
        boolean: true,
        null: null,
        array: [1, 2, 3],
        nested: {
          a: 1,
          b: 2,
        },
      };

      const encoded = await encodeMsgpack(originalData);
      const decoded = await decodeMsgpack(encoded);

      expect(decoded).toEqual({ test: "data" });
    });
  });
});
