#!/bin/bash

# Test script to manually create shopping list and trigger GitHub Action

echo "Creating test shopping list..."

# Create data directory if it doesn't exist
mkdir -p data

# Create a test shopping list
cat > data/shopping-list.json << 'EOF'
{
  "date": "2025-10-23T18:30:00.000Z",
  "vegetables": {
    "Carrot": 2,
    "Tomato": 3,
    "Banana": 1
  },
  "total": 6
}
EOF

echo "Shopping list created!"
echo ""
echo "Now committing and pushing to GitHub to trigger SMS..."
echo ""

# Add, commit, and push
git add data/shopping-list.json
git commit -m "Test shopping list - trigger SMS"
git push

echo ""
echo "Done! Check your GitHub Actions tab to see if the workflow ran:"
echo "https://github.com/dhyan6/veggie-garden/actions"
echo ""
echo "If configured correctly, you should receive an SMS at your phone number."
