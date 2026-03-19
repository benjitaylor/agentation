#!/bin/bash
# Agentation Feedback Hook for Claude Code
# Checks for pending UI annotations and outputs them for context injection

# Silently check for pending annotations (fail silently if server not running)
response=$(curl -s --connect-timeout 1 --max-time 2 "http://localhost:4747/pending" 2>/dev/null)

# Exit silently if curl failed or returned empty
if [ -z "$response" ]; then
  exit 0
fi

# Parse count from JSON (simple grep, no jq dependency)
count=$(echo "$response" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')

# Exit silently if no pending annotations
if [ -z "$count" ] || [ "$count" -eq 0 ]; then
  exit 0
fi

# We have pending annotations - output them for Claude
echo ""
echo "=== AGENTATION FEEDBACK ($count pending) ==="
echo ""
echo "The user has UI annotations waiting for you to address:"
echo ""

# Extract and format annotations using basic tools
# This outputs the raw JSON which Claude can parse
echo "$response" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for i, a in enumerate(data.get('annotations', []), 1):
        print(f\"[{i}] {a.get('element', 'unknown element')}\")
        if a.get('comment'):
            print(f\"    Comment: {a['comment']}\")
        if a.get('nearbyText'):
            text = a['nearbyText'][:100] + '...' if len(a.get('nearbyText', '')) > 100 else a.get('nearbyText', '')
            print(f\"    Context: {text}\")
        if a.get('reactComponents'):
            print(f\"    React: {a['reactComponents']}\")
        print()
except:
    pass
" 2>/dev/null

echo "Review and address these UI issues. Mark them resolved when done."
echo "=== END AGENTATION FEEDBACK ==="
echo ""
