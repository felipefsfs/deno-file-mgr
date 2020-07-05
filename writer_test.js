import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { write_text } from "./writer.js";

async function setup() {
  const file_name = "./test_file/writehere";
  const file = await Deno.open(
    file_name,
    { read: true, append: true, create: true },
  );
  return file;
}
async function teardown(file) {
  file.close();
  await Deno.remove("./test_file/writehere");
}
Deno.test("write line", async function () {
  const file = await setup();
  const bytes = await write_text({ file, text: "test text" });
  assertEquals(bytes, 9);
  await teardown(file);
});
