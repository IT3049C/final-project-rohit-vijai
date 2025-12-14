# GameHub

## Team members

Rohit Vijai

## Checklist

- [x] frequent commits to github.
- [x] filled out the self-evaluation.

## Self Grading Guide

I should get **(20)** out of 20 on this assignment.

## 💭 Reflection

### What I Learned
- **API Integration**: Successfully implemented multiplayer functionality using RESTful API, managing asynchronous state updates and error handling
- **Testing Strategies**: Gained expertise in writing resilient E2E tests using semantic selectors (`getByRole`, `getByLabel`) instead of brittle CSS selectors
- **State Management**: Mastered React Hooks patterns for complex game state, including multi-step game logic and turn-based interactions

### What I Would Change Next
- **Real-time Updates**: Replace polling with WebSockets for instant multiplayer synchronization
- **State Management**: Implement Redux or Zustand for better state sharing across components
- **Animations**: Add CSS transitions and React Spring for smoother game interactions
- **Mobile Optimization**: Improve touch controls and responsive layouts for mobile devices
- **Testing Coverage**: Add unit tests for game logic functions using Vitest

### How Peer Feedback Shaped Decisions
- **Navigation Improvement**: Initially used dropdown menu; switched to persistent navbar after feedback about discoverability issues
- **Visual Feedback**: Added immediate visual responses (color changes, animations) to button clicks after users reported unclear action confirmation
- **Instructions**: Included game rules on each page following feedback from users who were unfamiliar with game mechanics
- **Reset Functionality**: Made reset buttons more prominent and added confirmation dialogs after accidental resets during testing
- **Accessibility**: Added ARIA labels and keyboard navigation support based on accessibility testing feedback

## 🚀 Setup & Run

### Install Dependencies
