run: fmt
	echo "Running mod.js..."
	deno run -A mod.js

test: fmt
	deno test

fmt:
	deno fmt -q
