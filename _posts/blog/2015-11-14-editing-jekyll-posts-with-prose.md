---
categories: blog
author: Revanth Revoori
layout: blogpost
published: true
date: "2015-11-14 15:43 +0530"
tags: 
  - blog
  - prose
  - jekyll
excerpt_separator: "<!--more-->"
title: Editing Jekyll Posts With Prose
---


Jekyll supports markdown posts.We will discuss an online Github Content Editor [Prose](http://prose.io/ "Prose") that can be used to edit jekyll posts.It uses github authentication.Prose does not need to be specifically used for jekyll.You can edit any hosting site that has Git Hooks.

<!--more-->

In this post,I will share

- Explain prose configuration operations
- Normal setup of prose for jekyll sites

Prose is a free online github content editor.It can be customised to our requirements such as

**Image Uploading**
When editing markdown documents you can drag and drop images onto the page which are uploaded to a media directory you specify in your configuration or the current directory.

**Mobile Layout**
Prose is designed as a mobile ready application and is particularly well suited for the iPad.

**Markdown Features**
Prose pays particular attention to Markdown files by providing a formatting toolbar and in page previewing.

**Configurations**
Often you want to provide site maintainers access to create and edit content but not direct access to the source code that runs a project. Or you want a simple authoring environment that's focused on what matters to you. Configurations are a powerful way to customize what's provided during the day to day management of a site.

For non-jekyll sites, You can set up configurations by creating a _prose.yml file or add configurations as an entry to your Jekyll site in _config.yml.

Prose provides specific features to Jekyll sites

- A Publish/Unpublish workflow.
- Multilingual page translation support.
- Drafts Management.
- YAML Frontmatter Configuration.
- Full site layout previewing.

### **Prose Config Options**

Descriptions with **\*** are jekyll specific

##### **rooturl: "DIRECTORY NAME"**
Adding this option will restrict the prose access to the specific directory of the repo.

##### **ignore: ['file_a.html', '_config.yml']**
This option will ignore the files and do not show the files for edit.

##### **siteurl: "http://domain-name.com"**
\* Set this to your site and it will show live previews rather than inhouse previews of prose.

##### **site:**
\* This field accepts a list of absolute .JSONP paths to content that is loaded during Jekyll live previews. This is particularly useful for building out tags or categories that should be present during preview.

##### **media: "DIRECTORY NAME"**
Specify a media directory uploading images defaults to. When media is added to this directory, a listing of available assets is populated from the image dropdown link on markdown files.

##### **relativeLinks: "ABSOLUTE-URL.JSONP"**
Displays a list of links to a user from the link dropdown on markdown files.

##### **metadata:**
\* This adds YAML frontmatter to jekyll posts automatically.

## Metadata Configuration
Each jekyll post must contain frontmatter such as layout,date.Other options such as title,category,tags helps us organize site better.Prose helps us to add such front matter automatically when creating posts so you can concentrate on the content rather than structure.

prose options can be added to it's own specific file _\_prose.yml_ or can be added to jekyll's _\_config.yml_ .

metadata should be of format :

{% highlight python linenos %}

metadata:
  _posts:
    - # Elements ..

{% endhighlight %}

For each front matter you need in your post,you can add metadata element as name of the frontmatter key and a field object that describes what html element is used and how this should be displayed to the user.

For example,an entry like `layout:blog` in file can be configured as :

{% highlight python linenos %}

- name: "layout"
      field:
          element: "hidden"
          value: "blog"

{% endhighlight %}

where 

`name` is exact match of frontmatter key
`field` is where values and display options are set.
`element` is the option type of the key type.
`value` which contains the values.
\*`options` comes into picture for select and multiselect elements which we will see in a while.

## **Form field attributes**

#### **Text**

element: text
label: (optional string) Label to the user
help: (optional string) Help/description to accompany a label
value: (optional string) A default value
placeholder: (optional string) Helper text in the input if no value is provided.

type: text

#### **Textarea**

element: textarea
label: (optional string) Label to the user
help: (optional string) Help/description to accompany a label
value: (optional string) A default value
placeholder: (optional string) Helper text in the textarea if no value is 
provided.

#### **Select & Multiselect**

Allow a user to make one or more selections

element: select OR multiselect
label: (optional string) Label to the user
help: (optional string) Help/description to accompany a label
options: (array or string) If the value is a string prose expects this to be a 
JSONP file that links to a json file structured in the following format: 
{"name": "Granny Apples", "value": "granny-apples" } if this is an array the formal should look like:

{% highlight python linenos %}

options:
  - name: 'Granny Apples'
    value: 'granny-apples'

{% endhighlight %}

placeholder: (optional string) Helper text if no value is provided
lang: (optional string) if a lang key is set this allows the option of filtering a JSONP response by language. Useful for multilingual sites in Jekyll
(Multiselect only)
alterable: (optional boolean) true or false whether a user can add additional values. Useful for tags.
Hidden

This is particularly useful for frontmatter fields that should always have a fixed value and not changed. An good example is the layout field a file inherits.

#### **Hidden**

element: hidden
value: (optional string) The default value

#### **Number**

element: number
label: (optional string) Label to the user
help: (optional string) Help/description to accompany a label
value: (optional integer) A default integer
type: number

#### **Button**

A button can be used to toggle on and off the value

element: button
label: (optional string) Label to the user
help: (optional string) Help/description to accompany a label
on: (string) The name of the on value
off: (string) The name of the off value

#### **Checkbox**

Toggles on a true or false state

element: checkbox
label: (optional string) Label to the user
help: (optional string) Help/description to accompany a label
value: (boolean) true or false

## **Jekyll Prose Config**

Consider a jekyll sites contain a following directory structure of \_posts.

{% highlight python linenos %}

\_posts
	- blog
	- reads

{% endhighlight %}

Then the prose configuration sample can be like this :

{% highlight ruby linenos=table %}

# Prose.io Config
prose:
  rooturl: "_posts"
  siteurl: 'http://rrevanth.github.io/'
  relativeLinks: 'http://rrevanth.github.io/links.jsonp'
  media: 'assests/media'
  metadata:
    _posts/blog:
      - name: "published"
        field:
          element: "checkbox"
          label: "Publish now"
          help: "Keep this unchecked if you do not want to   publish the article right now"
          value: "true"
      - name: "layout"
        field:
          element: "hidden"
          value: "post"
      - name: "title"
        field:
          element: "text"
          label: "Enter title of the Article"
          placeholder: "Enter Title"
      - name: "date"
        field:
          element: "text"
          label: "Date"
          value: "CURRENT_DATETIME"
      - name: "author"
        field:
          element: "hidden"
          value: "Revanth Revoori"
      - name: "categories"
        field:
          element: "hidden"
          value: "blog"
          alterable: "true"
      - name: "tags"
        field:
          element: "multiselect"
          label: "Add Tags"
          placeholder: "Add Tags"
          options:
            - name: "Blog"
              value: "blog"
          alterable: true
      - name: "excerpt_separator"
        field:
          element: "text"
          value: "<!--more-->"
          
{% endhighlight %}

With this config,front matter can be automated for the blog sub-directory in \_posts directory.In the same way,we can add other sub-directories to the options.

I hope this series of posts helps you get started with jekyll blog [Autodeployed to Github Pages with Travis CI](http://rrevanth.github.io/blog/jekyllraketravisci) and an online editor with Prose.
