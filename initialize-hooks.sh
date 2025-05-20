
#!/bin/bash

# Ensure script is executable
chmod +x initialize-hooks.sh

# Make sure Git hooks directory exists
mkdir -p .git/hooks

# Make sure Git hooks are executable
if [ -d .git/hooks ]; then
  echo "Making Git hooks executable..."
  chmod +x .git/hooks/*
  echo "✅ Git hooks permissions updated!"
else
  echo "❌ Error: .git/hooks directory not found"
  exit 1
fi

# Run the setup hooks script
echo "Running setup-hooks.js..."
node setup-hooks.js

echo "All done! Git hooks are now set up and ready to use."
