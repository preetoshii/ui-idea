# UI Prototype Requirements

## Overview
A minimalist wireframe prototype featuring an AI agent interface with multiple input modalities and expandable interactive areas. The design uses a simple grayscale color scheme (white, grey, black) to maintain a wireframe aesthetic.

## Components

### 1. Side Navigation Bar
**Description**: Auto-collapsing sidebar navigation that responds to hover

**States**:
- **Collapsed**: Hidden completely from view
- **Expanded**: Shows navigation items (Sessions, Journey, Explore, Schedule, User Profile)

**Behavior**:
- Automatically expands when mouse hovers over the sidebar region
- Automatically collapses when mouse leaves the region
- Navigation items are non-functional (no actual page navigation)

---

### 2. AI Agent Orb
**Description**: Visual representation of the AI agent

**States**:
- **Default**: Floating grey circle with subtle hover animation

**Behavior**:
- Continuous subtle floating/hovering animation to indicate "alive" state
- No interactive functionality required

---

### 3. Chat Input Component
**Description**: Expandable input area that transforms from a simple text field to a full messaging interface

**Architecture**:
- Base layer: Card/container (provides the visual background)
- Top layer: Transparent input field (no border, seamlessly integrated)

**States**:
- **Collapsed**: 
  - Appears as a standard input field with placeholder text "I'm feeling like..."
  - Input field sits on top of a subtle card background
  
- **Expanded**:
  - Card background expands to fill most of the screen (with padding/margin)
  - Input field remains in position
  - Space prepared for future message bubble interface (left/right aligned chat bubbles)

**Behavior**:
- Click to expand from collapsed to expanded state
- Expandable area ready for future chat interface implementation

---

### 4. Voice Input Component
**Description**: Voice recording interface displayed as a pill-shaped control

**Elements** (left to right):
- Microphone/mute button
- Voice waveform visualizer (center)
- Pause/play button

**States**:
- **Default**: Static display of voice controls

**Behavior**:
- Currently non-functional (visual only)
- Displays as alternative to text input when voice mode is selected

---

### 5. Toggle Modality Button
**Description**: Button to switch between text and voice input modes

**States**:
- **Text Mode Active**: Displays "SWITCH TO VOICE"
- **Voice Mode Active**: Displays "SWITCH TO KEYBOARD"

**Behavior**:
- Clicking toggles between input modalities
- Triggers fade out of current input component and fade in of alternate component
- Button text updates to show opposite modality option

---

### 6. Whiteboard Area Button
**Description**: Expandable button/area hybrid that transforms into a full canvas workspace

**Architecture**:
- Functions as both a button and an expandable container
- Similar expansion behavior to Chat Input Component

**States**:
- **Collapsed**: 
  - Appears as a button labeled "WHITEBOARD"
  - Positioned at top of interface
  
- **Expanded**:
  - Background expands to fill most of the screen (modal-like with padding)
  - Creates canvas area for future whiteboarding features
  - Prepared for card activities and drawing tools

**Behavior**:
- Click to expand from button to full canvas
- Expansion animation similar to modal opening
- Ready for future whiteboard functionality implementation

---

## Technical Considerations

### Component Architecture
- Components should be built with expansion/transformation in mind
- Use CSS transitions for smooth state changes
- Maintain clean separation between visual layers (backgrounds vs. content)
- Keep all styles inline or in the HTML file for prototyping speed

### Visual Design
- Strict grayscale palette: white, light grey, grey, dark grey, black
- Minimal styling to maintain wireframe aesthetic
- Simple borders and shadows only where necessary for clarity
- No decorative elements or colors

### Animations
- Smooth fade transitions for modality switching
- Expand/collapse animations for Chat Input and Whiteboard components
- Subtle floating animation for AI Agent Orb
- Slide animations for sidebar show/hide

### Future Extensibility
- Chat Input expanded area ready for message bubble interface
- Whiteboard expanded area ready for canvas tools and card activities
- Components structured to allow easy addition of functionality without restructuring