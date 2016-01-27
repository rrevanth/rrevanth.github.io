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

[Jekyll](https://jekyllrb.com/ "Jekyll") is a very popular and very powerful static blog generator. Out of the box it’s able to generate sophisticated site structures, and has a ton of configurability. One of the areas where I feel that Jekyll lacks some sophistication is around the handling of categories and tags; these are two data-sets that are core <!--more-->to Jekyll, but there isn’t a lot of functionality actually built around them.

All the less,it is designed with for expansion into larger degrees of customization and sophistication and it has a powerful [plugin](https://github.com/mojombo/jekyll/wiki/Plugins) model that are as easy as plug and play.

People have different interests and I thought if they have feeds filtered by tags | categories,that would be a real help since the world today is flooed with unrelated articles.

I hit a hurdle when I set out to do this, there is social plugin that is doing this.So, I got to build my own - and it turns out to be quite simple.

### Tag page generation

First, we will create a separate page for each tag assosciated with posts.Create a plugin 'tag_gen.rb' with the following code :

{% highlight ruby linenos %}
    # _plugins/tag_gen.rb
    
module Jekyll

  class TagIndex < Page    
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag_index.html')
      self.data['tag'] = tag
      self.data['title'] = "Posts Tagged &ldquo;"+tag+"&rdquo;"
    end
  end

  class TagGenerator < Generator
    safe true
    
    def generate(site)
      if site.layouts.key? 'tag_index'
        dir = 'tag'
        site.tags.keys.each do |tag|
          write_tag_index(site, File.join(dir, tag), tag)
        end
      end
    end
  
    def write_tag_index(site, dir, tag)
      index = TagIndex.new(site, site.source, dir, tag)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end

end
{% endhighlight %}

### Tag feed generation

Next, we will create filtered feed for each tag.We will add another plugin 'rss_tag.rb' to plugins folder

{% highlight ruby linenos %}
    # _plugins/rss_tag.rb

module Jekyll
  class TagAtom < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir = dir
      @name = "feed.xml"

      process(@name)
      read_yaml(File.join(base, '_layouts'), 'atom.html')
      data['tag'] = tag
    end
  end

  class TagPageGenerator < Generator
    safe true

    # Generate tag page and atom feed for each tag used in the blogs
    def generate(site)
      # if site.layouts.key? 'tagpage'
        site.tags.each_key do |tag|
          site.pages << TagAtom.new(site, site.source, File.join('tag',tag), tag)
        end
      # end
    end
  end
end

{% endhighlight %}

