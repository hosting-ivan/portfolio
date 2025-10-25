#!/bin/bash

# Define the new theme slider HTML (project pages - no gradient button)
NEW_CONTROLS='    <!-- Theme Controls -->
    <div class="theme-controls">
      <!-- Light/Dark Slider -->
      <div class="theme-slider" role="radiogroup" aria-label="Theme mode">
        <button class="slider-button" data-theme="light" aria-label="Light mode">
          <span class="material-symbols-outlined">sunny</span>
        </button>
        <div class="slider-track">
          <div class="slider-thumb"></div>
        </div>
        <button class="slider-button" data-theme="dark" aria-label="Dark mode">
          <span class="material-symbols-outlined">bedtime</span>
        </button>
      </div>
    </div>'

# List of project pages
FILES="carbon.html waygo-a.html carbon-a.html ces-carbon.html cmc.html cryptography.html cve.html cve-a.html fernweh.html form.html noguchi.html renders.html streetalk.html streetalk-a.html super.html watching.html acssa.html"

for file in $FILES; do
  # Use sed to replace the old theme button with new slider
  # Find the theme button section and replace it
  sed -i '/<button id="theme-toggle"/,/<\/button>/c\'"$NEW_CONTROLS" "$file"
done

echo "Updated theme controls on all project pages"
