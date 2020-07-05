import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { calc_buffer_start, calc_buffer_end, stat_size, stat } from "./stat.js";

Deno.test("stat result", async function () {
  const v = await stat("./test_file/readthis");
  assertEquals(v.isFile, true);
  assertEquals(v.size > 10, true);
  const w = await stat("./test_file/missingfile");
  assertEquals(w, {});
});

Deno.test("stat_size returns size", async function () {
  const size = await stat_size("./test_file/readthis");
  assertEquals(size > 10, true);
});

Deno.test("calc_buffer_start gets the right buffer", function () {
  const buffer_offset_size = [
    [5, 10, 0, { buffer: 0, offset: 0 }],
    [0, 10, 100, { buffer: 0, offset: 10 }],
    [5, -10, 100, { buffer: 0, offset: 0 }],
    [5, -2, 100, { buffer: 3, offset: 0 }],
    [5, 10, 100, { buffer: 5, offset: 10 }],
    [5, 99, 100, { buffer: 1, offset: 99 }],
    [5, 105, 100, { buffer: 0, offset: 100 }],
    [20, -100, 5, { buffer: 0, offset: 0 }],
    [20, -19, 5, { buffer: 1, offset: 0 }],
    [20, -4, 5, { buffer: 5, offset: 0 }],
    [20, 3, 5, { buffer: 2, offset: 3 }],
    [20, 10, 5, { buffer: 0, offset: 5 }],
  ];
  buffer_offset_size.forEach(([buffer, offset, size, r]) => {
    assertEquals(calc_buffer_start(buffer, offset, size), r);
  });
});

Deno.test("calc_buffer_end gets the right buffer", function () {
  const buffer_offset_size = [
    [5, -10, 0, { buffer: 0, offset: 0 }],
    [0, -10, 100, { buffer: 0, offset: -10 }],
    [5, -110, 100, { buffer: 0, offset: -100 }],
    [5, -102, 100, { buffer: 3, offset: -100 }],
    [5, -99, 100, { buffer: 5, offset: -99 }],
    [5, -4, 100, { buffer: 4, offset: -4 }],
    [5, 1, 100, { buffer: 0, offset: 0 }],
    [20, -100, 5, { buffer: 0, offset: -5 }],
    [20, -24, 5, { buffer: 1, offset: -5 }],
    [20, -12, 5, { buffer: 5, offset: -5 }],
    [20, -3, 5, { buffer: 3, offset: -3 }],
    [20, 1, 5, { buffer: 0, offset: 0 }],
  ];
  buffer_offset_size.forEach(([buffer, offset, size, r]) => {
    assertEquals(calc_buffer_end(buffer, offset, size), r);
  });
});
