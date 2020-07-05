export {
  write_text,
};

/**
 * Write text to file and returns the total number of bytes written
 * @param {object} specs - write options 
 */
async function write_text({
  encoder = new TextEncoder(),
  file = new Deno.File(0),
  text = "",
} = {}) {
  if (!file) {
    return 0;
  }
  try {
    const encoded = encoder.encode(text);
    await Deno.writeAll(file, encoded);
    return encoded.byteLength;
  } catch (e) {
    console.error(e);
    return 0;
  }
}
