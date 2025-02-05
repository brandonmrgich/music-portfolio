// custom error handling
function throwDetailedError(message) {
  // Create an Error object to capture the stack trace
  const error = new Error(message);

  // Extract the stack trace and split into lines
  const stackLines = error.stack.split("\n");
  let methodName = "<unknown>";
  let fileName = "<unknown>";

  if (stackLines.length > 1) {
    // Example stack line: "    at methodName (fileName.js:line:column)"
    const match = stackLines[2].match(/\s*at\s*(\S*)\s*\((.*):\d+:\d+\)/);
    if (match) {
      methodName = match[1];
      fileName = match[2];
    } else {
      // Fallback for anonymous functions or if method name is not available
      const anonMatch = stackLines[2].match(/\s*at\s*(.*):\d+:\d+/);
      if (anonMatch) {
        fileName = anonMatch[1];
        methodName = "<anonymous>";
      }
    }
  }

  // Throw a new error with detailed information
  throw new Error(`${message} (in ${methodName} at ${fileName})`);
}

export default throwDetailedError;
