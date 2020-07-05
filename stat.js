export {
  calc_buffer_start,
  calc_buffer_end,
  stat_size,
  stat,
};

/**
 * Calculate the new buffer & offset for SeekModeStart
 * @param {number} buffer 
 * @param {number} offset 
 * @param {number} size 
 */
function calc_buffer_start(buffer = 0, offset = 0, size = 0) {
  if (size === 0) {
    return { buffer: 0, offset: 0 };
  }
  const turn = (buffer + offset > size)
    ? Math.max(0, size - offset)
    : Math.max(0, buffer + offset);
  return {
    buffer: Math.min(buffer, size, turn),
    offset: Math.min(size, Math.max(0, offset)),
  };
}

/**
 * Calculate the new buffer & offset for SeekModeEnd
 * @param {number} buffer 
 * @param {number} offset 
 * @param {number} size 
 */
function calc_buffer_end(buffer = 0, offset = 0, size = 0) {
  if (size === 0) {
    return { buffer: 0, offset: 0 };
  }
  const turn = ((buffer + offset < 0) || (size + offset < 0))
    ? Math.max(0, buffer + offset + size)
    : Math.max(0, -offset);
  return {
    buffer: Math.min(buffer, size, turn),
    offset: Math.min(0, Math.max(-size, offset)),
  };
}

/**
 * Returns the size i bytes of the file
 * @param {string} name 
 */
async function stat_size(name) {
  const s = await stat(name);
  return s.size || 0;
}

/**
 * Returns the stat of the file
 * @param {string} name 
 */
async function stat(name = "") {
  try {
    return await Deno.stat(name);
  } catch (_) {
    return {};
  }
}
