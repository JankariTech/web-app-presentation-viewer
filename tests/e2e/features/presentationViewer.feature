Feature: markdown presentation viewer
  As a user
  I want to view markdown documents in presentation format
  So that I can easily present content in a structured manner

  Background:
    Given user "admin" has uploaded the markdown file "test-markdown.md" using API
    And user "admin" has logged in


  Scenario: preview markdown file in presentation viewer
    When user "admin" previews a markdown file "test-markdown.md" in presentation viewer
    Then markdown file "test-markdown.md" should be opened in the presentation viewer


  Scenario: check content of a slide
    When user "admin" previews a markdown file "test-markdown.md" in presentation viewer
    Then the content of the current slide should be "PRESENTATION VIEWER"
