Feature: markdown presentation viewer
  As a user
  I want to view markdown documents in presentation format
  So that I can easily present content in a structured manner

  Background:
    Given user "admin" has uploaded the markdown file "test-markdown.md" using API
    And user "admin" has logged in


  Scenario: preview markdown file in presentation viewer
    When user "admin" previews markdown file "test-markdown.md" in presentation viewer
    Then markdown file "test-markdown.md" should be opened in the presentation viewer
    And the content of the current slide should be "PRESENTATION VIEWER"
    # change slide with button in UI
    When user "admin" navigates to the next slide using navigation button
    Then the content of the current slide should be "An extension for OpenCloud & ownCloud Infinite Scale (oCIS) that allows users to create slide presentations directly from markdown files."
    When user "admin" navigates to the previous slide using navigation button
    Then the content of the current slide should be "PRESENTATION VIEWER"
    # change slide with keyboard
    When user "admin" navigates to the next slide using keyboard
    Then the content of the current slide should be "An extension for OpenCloud & ownCloud Infinite Scale (oCIS) that allows users to create slide presentations directly from markdown files."
    When user "admin" navigates to the previous slide using keyboard
    Then the content of the current slide should be "PRESENTATION VIEWER"

  @skipOnOpenCloud
  Scenario: re-open markdown file in presentation viewer after opening in text editor
  When user "admin" previews markdown file "test-markdown.md" in presentation viewer
  Then markdown file "test-markdown.md" should be opened in the presentation viewer
  And the content of the current slide should be "PRESENTATION VIEWER"
  When user "admin" opens file "test-markdown.md" in text editor using sidebar panel
  Then file "test-markdown.md" should be opened in the text editor
  When user "admin" previews markdown file "test-markdown.md" in presentation viewer using sidebar panel
  Then markdown file "test-markdown.md" should be opened in the presentation viewer
  And the content of the current slide should be "PRESENTATION VIEWER"