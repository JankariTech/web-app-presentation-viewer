Feature: Markdown presentation viewer
  As a user
  I want to view the markdown in the presentation format
  So that I can view the markdown documents in the presentation format
  
  Background:
    Given some markdown files are in the home page
    
  
  Scenario: Open Markdown file and verify rendering
    Given the user opens a markdown file "index.md"
    When the file is rendered
    Then the content should be displayed in a presentation viewer
    And all tags should be rendered correctly (e.g., # -> <h1>)


  Scenario: Verify slide content and navigation
    Given the user opens a markdown file with multiple slides "slides.md"
    Then the total number of slides should be correct
    When the user navigates to the next slide
    Then the content of the current slide should be displayed
    And the slide number indicator should reflect the current slide
  

  Scenario: Navigate slides using navigation buttons
    Given the user opens a markdown file with multiple slides "slides.md"
    Then the presentation viewer should have navigation buttons (Previous, Next)
    When the user clicks the "Next" button
    Then the content of the next slide should be displayed
