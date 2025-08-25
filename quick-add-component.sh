#!/bin/bash

# Quick component addition script for shadcn blocks
# Usage: ./quick-add-component.sh [component-name]

COMPONENT=$1

if [ -z "$COMPONENT" ]; then
    echo "Usage: ./quick-add-component.sh [component-name]"
    echo "Example: ./quick-add-component.sh pricing2"
    exit 1
fi

echo "Adding shadcn block: $COMPONENT"
echo "n" | npx shadcn@canary add https://www.shadcnblocks.com/r/$COMPONENT

echo "✅ Component added. Don't forget to:"
echo "1. Import the component in your page"
echo "2. Customize the content/props"
echo "3. Test the integration"