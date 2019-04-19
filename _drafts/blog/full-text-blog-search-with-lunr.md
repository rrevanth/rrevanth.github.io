---
title: Full text blog search with lunr
date: 2016-01-29 19:08:00 Z
categories:
- blog
tags:
- blog
- search
- jekyll
- full_text
- jekyll_hacks
author: Revanth Revoori
layout: blogpost
excerpt_separator: "<!--more-->"
---

This post discusses full text jekyll blog search with lunr js. Lunr is a simple full text search engine for browser.It does not require any backend but efficient enough for clever blog searches.But the caveat is it is not bright as other's like Solr and Elastic Search, as it's own description says so.

## Let's get started!

### First Step : A page for search bar and results

Add a page, say search.html page to your root directory and add the following content to it : 

{% highlight html linenos %}
---
layout: default
title: Search
search_omit: true
---
<center>
    <!-- Search form -->
    <form method="get" action="/search" class="search-wrapper cf">
        <input type="text" name="q" id="search" placeholder="e.g. awesome post" autocomplete="off" />
        <button type="submit">Search</button>
    </form>
</center>
<!-- Search results placeholder -->
<section>
    <ul id="search-results">
        <center>
            <h2> [Or] try multitag search ;)</h2>
            <a href="/filtertags" id="s-tag-button">Multi Tag Search!</a>
        </center>
    </ul>
</section>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"></script>
<script src="/js/lunr.min.js"></script>
<script src="/js/lunr-feed.js"></script>
{% endhighlight %}

As you can see in the above code,it contains a search input form which will later be submitted for process,and a **search-results** div where we will insert the result posts with jquery.