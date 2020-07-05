import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { create_reader, READ_START, READ_END, READ_MIDDLE } from "./reader.js";

async function setup() {
  const file_name = "./test_file/readthis";
  const file = await Deno.open(file_name);
  const reader = await create_reader({
    file,
    file_name,
    decoder: new TextDecoder("utf8"),
  });
  return reader;
}
Deno.test("raw read lines", async function () {
  const reader = await setup();
  const lines = await reader.read_lines(
    { buffersize: 100, offset: 50, mode: Deno.SeekMode.Start },
  );
  assertEquals(lines.length > 0, true);
  assertEquals(typeof lines[0], "string");
  assertEquals(lines[0].length > 0, true);
  reader.close();
});

Deno.test("raw read 0 buffer", async function () {
  const reader = await setup();
  const lines = await reader.read_lines(
    { buffersize: 0, offset: 50, mode: Deno.SeekMode.Start },
  );
  assertEquals(lines.length > 0, true);
  assertEquals(typeof lines[0], "string");
  assertEquals(lines[0].length === 0, true);
  reader.close();
});

Deno.test("read 1st line", async function () {
  const reader = await setup();
  const result = await reader.read_parsed_data(
    { buffer: 100, mode: READ_START },
  );
  assertEquals(result.lines.length > 0, true);
  assertEquals(typeof result.lines[0], "string");
  assertEquals(result.lines[0].length > 0, true);
  assertEquals(result.buffer, 100);
  assertEquals(result.offset, 0);
  assertEquals(result.size > 0, true);
  reader.close();
});

Deno.test("read last line", async function () {
  const reader = await setup();
  const result = await reader.read_parsed_data(
    { buffer: 100, mode: READ_END },
  );
  assertEquals(result.lines.length > 0, true);
  assertEquals(typeof result.lines[result.lines.length - 1], "string");
  assertEquals(result.lines[result.lines.length - 1].length > 0, true);
  assertEquals(result.buffer, 100);
  assertEquals(result.offset, -100);
  assertEquals(result.size > 0, true);
  reader.close();
});

Deno.test("read middle lines", async function () {
  const reader = await setup();
  const result = await reader.read_parsed_data(
    { buffer: 100, offset: 50, file_size: 75, mode: READ_MIDDLE },
  );
  assertEquals(result.lines.length > 0, true);
  assertEquals(typeof result.lines[result.lines.length - 1], "string");
  assertEquals(result.lines[result.lines.length - 1].length > 0, true);
  assertEquals(result.buffer > 0, true);
  assertEquals(result.offset >= 0, true);
  assertEquals(result.size, 75);
  reader.close();
});
