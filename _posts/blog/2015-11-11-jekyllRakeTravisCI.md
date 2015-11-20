---
categories: blog
author: Revanth Revoori
layout: blogpost
published: true
title: Automate Jekyll Blog to Github with Travis CI
date: "Wed Nov 11 2015 23:14:34 GMT+0530 (IST)"
tags: 
  - blog
  - jekyll
  - rake
  - travis
  - deploy
  - automate
excerpt_separator: "<!--more-->"
---


In addition to supporting regular HTML content, GitHub Pages supports Jekyll, a simple, blog-aware static site generator. Jekyll makes it easy to create site-wide headers and footers without having to copy them across every page. It also offers some other advanced templating features.

<!--more-->

Every GitHub Page runs through Jekyll when you push content to a specially named branch within your repository. For User Pages, use the master branch in your username.github.io repository. For Project Pages, use the gh-pages branch in your project's repository. Creating blog in Jekyll is awesome but it comes with a catch.Everytime we publish a post,we need to update the master branch with compiled website. Also, post editing is a horror if you are a person who likes to do it in editor.

In this post,we will go through 

1. Deploying a jekyll blog to github with rake
2. Automate the build process with Travis CI
3. Github content editor Prose


### **Deploying with Rake**

This post assumes that your jekyll blog git repo contains two branches
- source branch - contains the source files for blog.
- master branch - contains the compiled blog.

Make sure you are in source branch.Add a file named Rakefile to your root dir that contains the following code ..

Rakefile
{% highlight ruby linenos=table %}

require 'rubygems'
    require 'rake'
    require 'rdoc'
    require 'date'
    require 'yaml'
    require 'tmpdir'
    require 'jekyll'

    desc "Generate blog files"
    task :generate do
      Jekyll::Site.new(Jekyll.configuration({
        "source"      => ".",
        "destination" => "_site"
      })).process
    end


    desc "Generate and publish blog to master"
    task :publish => [:generate] do
      Dir.mktmpdir do |tmp|
        system "mv _site/* #{tmp}"
        system "git checkout -B master"
        system "rm -rf *"
        system "mv #{tmp}/* ."
        message = "Site updated at #{Time.now.utc}"
        system "git add ."
        system "git commit -am #{message.shellescape}"
        system "git push origin master --force"
        system "git checkout source"
        system "echo published to master"
      end
    end

task :default => :publish

{% endhighlight %} 

After adding this,you can build and deploy the updated source code to master just by running one command.Make sure you are in root dir of your git repo and run the following command :

> rake

That's it.So simple,right.Not so fast.We just don't wanna run this command every time we create to post.We need something much better.

## **Enter Travis,the saviour**

### **Travis SSH setup**

For travis to have git repo permissions,you can do this two ways
1. Using Git access tokens (Less secure method)
2. Using SSH keys (More secure and recommended method)

Generate a private/public key pair without passphrase in the repo directory.Be sure to be in root dir,not any sub dir or other system dir.

> ssh-keygen -t rsa -C "deploy@travis-ci.org" -f deploy_key -N ''

Add the public key (deploy_key.pub) to the Git repo as a 'Deploy Key' through the web interface. We are using deploy keys so that we can make them specific to a single repository. You could use 'Personal access tokens' but they would then allow access to all repositories associated with the given account - this might be preferable in an organization context, using special GitHub accounts created specifically for Travis-CI to work with multiple repositories. The use of 'Personal access tokens' (and my starting point for this approach) is illustrated in Evan Sosenko's article [Automatic publishing to GitHub Pages with Travis CI](https://evansosenko.com/posts/automatic-publishing-github-pages-travis-ci/ "Personal Access Jekyll Travis")

Install the travis gem

> gem install travis

Login to travis with your GitHub credentials

> travis login

Encrypt the SSH key to generate **deploy_key.enc**.

> travis encrypt-file deploy_key

This should modify your .travis.yml file adding the openssh keys to before_install property like this

> before_install:
> - openssl aes-256-cbc -K {blah blah blah}

{% highlight ruby linenos=table %}

Add private deploy key files to .gitignore
deploy_key
deploy_key.pub

{% endhighlight %}

> # make sure you ignore the SSH keys and only commit the
# encrypted version. You may also want to back up the original
# key files elsewhere
{:warnquote}

### **Setting Travis in the project**

As you might know,Travis CI is used for testing and deploying automatically for git repositories.We are gonna use this feature to automatically build and deploy the site to master whenever we push any changes to source.

Adding Travis integration is simple,add .travis.yml file to source root dir.

.travis.yml
{% highlight ruby linenos=table %}

language: ruby
branches:
  only:
  - source  # branch that contains source files
rvm:
- 2.2.3
before_install:
- openssl aes-256-cbc -K $encrypted_{blah blah blah}
- chmod u=rw,og= ~/.ssh/deploy_key
- echo "Host github.com" >> ~/.ssh/config
- echo "  IdentityFile ~/.ssh/deploy_key" >> ~/.ssh/config
- git --version
- git config user.name "{GIT_UNAME}"
- git config user.email "{GIT_EMAIL}"
- git remote set-url origin git@github.com:{GIT_UNAME}/{GIT_UNAME}.github.io.git
- git remote -v
script:
- bundle exec rake
notifications:
  email:
    recipients:
      - {GIT_EMAIL}
    on_success: change
    on_failure: always
    
{% endhighlight %}

Replace {GIT_UNAME},{GIT_EMAIL} with their appropriate values.


Now Signin to Travis CI and add your site repo for watching the repo to Automatically build.

In the project settings,Turn OFF **Build pull requests** and **Build only if .travis.yml is present** to ON.

Now,whenever your push any changes to source branch,Travis should automatically build and deploy the site to master branch.

### **Post Editing**

Recently,I found a great site for post editing,checkout out [Prose](http://prose.io/ "Prose").It has a awesome Markdown editor that accessess your repo and you can add posts,drafts to your source repo from there.

Life gets so much simplified with all this awesome tools and experience is blissful.

Thanks for reading.Share and spread the knowledge :+1:
