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
published: true
title: "RSS feeds for each Tags - Jekyll"
---


[Jekyll](https://jekyllrb.com/ "Jekyll") is a very popular and very powerful static blog generator. Out of the box it’s able to generate sophisticated site structures, and has a ton of configurability. One of the areas where I feel that Jekyll lacks some sophistication is around the handling of categories and tags; these are two data-sets that are core <!--more-->to Jekyll, but there isn’t a lot of functionality actually built around them.

All the less,it is designed with for expansion into larger degrees of customization and sophistication and it has a powerful [plugin](https://github.com/mojombo/jekyll/wiki/Plugins) model that are as easy as plug and play.

People have different interests and I thought if they have feeds filtered by tags (or) categories,that would be a real help since the world today is flooded with unrelated articles.

I hit a hurdle when I set out to do this, there is social plugin that is doing this.So, I got to build my own - and it turns out to be quite simple.

### Tag page generation

First, we will create a separate page for each tag assosciated with posts.Create a plugin 'tag_gen.rb' with the following code :

#### layout

We need a layout for the html that the tag page is gonna use :

{% highlight html linenos %}
{% raw %}
# _layouts/default.html

<!DOCTYPE html>
<html>
  {%  include head.html  %}
  <body>
    {%  include header.html  %}
    <div class="page-content">
      <div class="wrapper">
        {{ content  }}
      </div>
    </div>
    {%  include footer.html  %}
    {%  include scripts.html  %}
  </body>
</html>
{% endraw %}
{% endhighlight %}

{% highlight html linenos %}
{% raw %}
# _layouts/tag_index.html

---
layout: default
---

<div>
  <center>
    <a title="Subscribe to {{ page.tag | upcase  }}" href="/tag/{{ page.tag  }}/feed.xml"><h2 style="background:#ad141e;border-radius: 20px;margin-bottom: 56px;color: white;" class="post_title"><i class="fa fa-rss"  style="font-weight: 600;color: white;"> {{ page.tag | upcase  }}</i></h2></a>
    <ul>
      {%  for post in site.posts  %}
      {%  for tag in post.tags  %}
      {%  if tag == page.tag  %}
        <li style="padding-top: 1rem;" class='post-list'>
          <a style="font-size:2rem" class="title" href="{{ post.url  }}">{{ post.title  }}</a><br>
          {{ post.date | date: "%b %-d, %Y"  }}<br>
          {%  for tag in post.tags  %}
            <a class="tags" href="/tag/{{ tag  }}">{{ tag  }}</a>
          {%  endfor  %}
        </li>
      {%  endif  %}
      {%  endfor  %}
      {%  endfor  %}
    </ul>
  </center>
</div>
{% endraw %}
{% endhighlight %}

#### plugin

{% highlight ruby linenos %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

After this, you will have a proper page for each tag with all the posts corresponding to the tag in <b>tag/[tag]</b> folder.

### Tag feed generation

Next, we will create filtered feed for each tag.We will add another plugin 'rss_tag.rb' to plugins folder

#### layout

{% highlight html linenos %}
{% raw %}
# _layouts/atom.html

--- 
layout: null 
---
<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
        <link href="{{ site.url  }}/tag/{{ page.tag  }}/feed.xml" rel="self" type="application/atom+xml" />
        <link href="{{ site.url  }}/" rel="alternate" type="text/html" />
        <updated>{{ site.time | date_to_xmlschema  }}</updated>
        <id>{{ site.url  }}/</id>
        <title>Feed tagged <b>{{ page.tag | upcase  }}</b> - {{ site.name  }}</title>
        <subtitle> {{ site.description  }} </subtitle>
        <author>
            <name>{{ site.title | xml_escape  }}</name>
        </author>
        {%  for post in site.posts  %} {%  for tag in post.tags  %} {%  if tag == page.tag  %}
        <entry>
            <title>{{ post.title | xml_escape  }}</title>
            <link href="{{ site.url  }}{{ post.url  }}/" />
            <published>{{ post.date | date_to_xmlschema  }}</published>
            <updated>{{ post.date | date_to_xmlschema  }}</updated>
            <id>{{ site.url  }}{{ post.url  }}/</id>
            <content type="html" xml:base="{{ site.url  }}{{ post.url  }}/">{{ post.content | xml_escape  }}</content>
        </entry>
        {%  endif  %} {%  endfor  %} {%  endfor  %}
    </feed>
{% endraw %}
{% endhighlight %}

#### plugin

{% highlight ruby linenos %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

After this, you will have a file named feed.xml in each tag folder that contains the feed corresponding to that tag.

All done, now you have feed for each tag and you can provide the feed to anyone who is interested in following particular tags from your blog.

This was a good excercise since I have not done any feature improvement to my blog other than style tweaks lately.

You can also look at my other jekyll posts by clicking on **jekyll** tag top of this page.You can see the feed button too ;)
