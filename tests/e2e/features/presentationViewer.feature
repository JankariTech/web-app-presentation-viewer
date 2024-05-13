Feature: markdown presentation viewer
  As a user
  I want to view markdown documents in presentation format
  So that I can easily present content in a structured manner


  Scenario: validate content of code-blocks in markdown file in presentation viewer
    Given user "admin" has uploaded markdown file "test-markdown.md" with content:
    """
    ```code
     let a = 1;
     let b = 2;
     let c = x => 1 + 2 + x;
     c(3);
    ```
    """
    And user "admin" has logged in to the web UI
    When the user previews the markdown file using the webUI
    Then the rendered HTML should be:
    """
    <pre class="code-wrapper"><code class="code hljs language-apache" data-highlighted="yes">    <span class="hljs-attribute">let</span> a = <span class="hljs-number">1</span>;
    <span class="hljs-attribute">let</span> b = <span class="hljs-number">2</span>;
    <span class="hljs-attribute">let</span> c = x =&gt; <span class="hljs-number">1</span> + <span class="hljs-number">2</span> + x;
    <span class="hljs-attribute">c</span>(<span class="hljs-number">3</span>);</code></pre>
    """


  Scenario: validate content of lists in markdown file in presentation viewer
    Given user "admin" has uploaded markdown file "test-markdown.md" with content:
    """
    1. Item 1
    2. Item 2
    - Item A
    - Item B
    """
    And user "admin" has logged in to the web UI
    When the user previews the markdown file using the webUI
    Then the rendered HTML should be:
    """
    <ol>
    <li>Item 1</li>
    <li>Item 2</li>
    </ol>
    <ul>
    <li>Item A</li>
    <li>Item B</li>
    </ul>
    """


  Scenario Outline: validate content of markdown file in presentation viewer
    Given user "admin" has uploaded markdown file "test-markdown.md" with "<markdown-content>"
    And user "admin" has logged in to the web UI
    When the user previews the markdown file using the webUI
    Then the rendered HTML should be "<html-content>"
    Examples:
    | markdown-content | html-content      |
    | # heading1       | <h1>heading1</h1> |
    | ## heading2      | <h2>heading2</h2> |
    | ### heading3     | <h3>heading3</h3> |
    | #### heading4    | <h4>heading4</h4> |
    | ##### heading5   | <h5>heading5</h5> |
    | ###### heading6  | <h6>heading6</h6> |
    