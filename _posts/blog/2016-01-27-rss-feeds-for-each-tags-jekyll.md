---
categories: blog
category: blog
author: Revanth Revoori
layout: blogpost
date: "2016-01-27 15:19 +0530"
tags: 
  - blog
  - jekyll
  - rss
excerpt_separator: "<!--more-->"
published: false
title: "RSS feeds for each Tags - Jekyll"
---

[Jekyll](https://jekyllrb.com/ "Jekyll") is a very popular and very powerful static blog generator. Out of the box it’s able to generate sophisticated site structures, and has a ton of configurability. One of the areas where I feel that Jekyll lacks some sophistication is around the handling of categories and tags; these are two data-sets that are core <!--more--> to Jekyll, but there isn’t a lot of functionality actually built around them.

All the less,it is designed with for expansion into larger degrees of customization and sophistication and it has a powerful [plugin](https://github.com/mojombo/jekyll/wiki/Plugins) model that are as easy as plug and play.

People have different interests and I thought if they have feeds filtered by tags | categories,that would be a real help since the world today is flooed with unrelated articles.

I hit a hurdle when I set out to do this, there is social plugin that is doing this.So, I got to build my own - and it turns out to be quite simple.

#### First Step 

